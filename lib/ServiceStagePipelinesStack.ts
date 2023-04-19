import { App, Duration, SecretValue, Stack, StackProps, Tags } from "aws-cdk-lib";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

const ASSETS_BUCKET = "code-asset";
const BUILD_ENV = {
	computeType: codebuild.ComputeType.SMALL,
	buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
};

interface Props extends StackProps {
	readonly system: string;
	readonly repo_owner: string;
	readonly prod_branch: string;
	readonly service_name: string;
	readonly build_env?: codebuild.BuildEnvironment;
	readonly add_policies_to_build_role: (stack: Stack, role: iam.Role) => any;
}

/**
 * Stack that contains the pipelines of each Stage of the service.
 */
export class ServiceStagePipelinesStack extends Stack {
	constructor(app: App, private readonly props: Props) {
		super(app, `${props.service_name}-pipelines`, props);

		Tags.of(this).add("system", props.system);

		this.create_pipeline(props.prod_branch);
	}

	create_pipeline(branch: string) {
		const { service_name, build_env, add_policies_to_build_role, repo_owner } = this.props;

		// artifacts
		const source_code = new codepipeline.Artifact("SourceCode");
		const service_synth_output = new codepipeline.Artifact("CdkBuildOutput");
		const code_asset = new codepipeline.Artifact("BuildOutput");

		const build_project = new codebuild.PipelineProject(this, "Build", {
			timeout: Duration.minutes(10),
			projectName: this.sanitize_project_name(`${service_name} build`),
			environment: build_env || BUILD_ENV,
			buildSpec: codebuild.BuildSpec.fromObject({
				version: "0.2",
				phases: {
					install: {
						commands: ["n 18", "cd code", "npm install"],
					},
					pre_build: {
						commands: ["npm test"],
					},
					build: {
						commands: ["npm run build"],
					},
				},
				artifacts: {
					"base-directory": "code/dist",
					files: ["**/*"],
				},
			}),
		});

		// adiciona permissao ao codebuild.
		add_policies_to_build_role(this, build_project.role as iam.Role);

		// Permissao para pegar valores exportados de outras stacks para testes.
		const describe_stack_policy = new iam.PolicyStatement({
			effect: iam.Effect.ALLOW,
			actions: ["cloudformation:DescribeStacks"],
			resources: [`arn:aws:cloudformation:${this.region}:${this.account}:stack/test*`],
		});

		build_project?.role?.addToPrincipalPolicy(describe_stack_policy);

		const stages: codepipeline.StageProps[] = [
			{
				stageName: "Source",
				actions: [
					new codepipeline_actions.GitHubSourceAction({
						actionName: "CodeCommit_Source",
						oauthToken: SecretValue.secretsManager("GithubToken"),
						owner: repo_owner,
						repo: service_name,
						branch,
						output: source_code,
					}),
				],
			},
			{
				stageName: "Build",
				actions: [
					new codepipeline_actions.CodeBuildAction({
						actionName: "Service_Build",
						input: source_code,
						project: build_project,
						outputs: [code_asset],
					}),
				],
			},
			{
				stageName: "Synth_CDK",
				actions: [
					new codepipeline_actions.CodeBuildAction({
						actionName: "CDK_Build",
						input: source_code,
						project: new codebuild.PipelineProject(this, "CdkBuild", {
							timeout: Duration.minutes(10),
							projectName: this.sanitize_project_name(`${service_name} ${branch} synth`),
							environment: build_env || BUILD_ENV,
							buildSpec: codebuild.BuildSpec.fromObject({
								version: "0.2",
								phases: {
									install: {
										commands: ["n 18.16.0", "cd cdk", "npm install"],
									},
									build: {
										commands: ["npm run build", "npm run cdk synth -- -o dist"],
									},
								},
								artifacts: {
									"base-directory": "cdk/dist",
									files: [`${service_name}.template.json`],
								},
							}),
						}),
						outputs: [service_synth_output],
					}),
				],
			},
		];

		stages.push({
			stageName: "Deploy",
			actions: [
				new codepipeline_actions.CloudFormationCreateUpdateStackAction({
					actionName: "CFN_Deploy",
					templatePath: service_synth_output.atPath(`${service_name}.template.json`),
					stackName: service_name,
					adminPermissions: true,
					parameterOverrides: {
						codeAssetBucket: code_asset.s3Location.bucketName,
						codeAssetKey: code_asset.s3Location.objectKey,
					},
					extraInputs: [code_asset],
				}),
			],
		});

		const artifactBucket = s3.Bucket.fromBucketName(this, "AssetsBucket", ASSETS_BUCKET);

		new codepipeline.Pipeline(this, "Pipeline", {
			pipelineName: `${service_name}-pipeline`,
			artifactBucket,
			stages,
		});
	}

	private sanitize_project_name(project_name: string): string {
		return project_name.replace(/-/g, "_").replace(/ /g, "_");
	}
}
