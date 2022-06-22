"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStagePipelinesStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const codepipeline_actions = require("aws-cdk-lib/aws-codepipeline-actions");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const ASSETS_BUCKET = "code-asset";
const BUILD_ENV = {
    computeType: codebuild.ComputeType.SMALL,
    buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
};
/**
 * Stack that contains the pipelines of each Stage of the service.
 */
class ServiceStagePipelinesStack extends aws_cdk_lib_1.Stack {
    constructor(app, props) {
        super(app, `${props.service_name}-pipelines`, props);
        this.props = props;
        aws_cdk_lib_1.Tags.of(this).add("system", props.system);
        this.create_pipeline(props.prod_branch);
    }
    create_pipeline(branch) {
        var _a;
        const { service_name, build_env, add_policies_to_build_role, repo_owner } = this.props;
        // artifacts
        const source_code = new codepipeline.Artifact("SourceCode");
        const service_synth_output = new codepipeline.Artifact("CdkBuildOutput");
        const code_asset = new codepipeline.Artifact("BuildOutput");
        const build_project = new codebuild.PipelineProject(this, "Build", {
            timeout: aws_cdk_lib_1.Duration.minutes(10),
            projectName: this.sanitize_project_name(`${service_name} build`),
            environment: build_env || BUILD_ENV,
            buildSpec: codebuild.BuildSpec.fromObject({
                version: "0.2",
                phases: {
                    install: {
                        commands: ["cd code", "npm install"],
                    },
                    pre_build: {
                        commands: [`npm test`],
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
        add_policies_to_build_role(this, build_project.role);
        // Permissao para pegar valores exportados de outras stacks para testes.
        const describe_stack_policy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["cloudformation:DescribeStacks"],
            resources: [`arn:aws:cloudformation:${this.region}:${this.account}:stack/test*`],
        });
        (_a = build_project === null || build_project === void 0 ? void 0 : build_project.role) === null || _a === void 0 ? void 0 : _a.addToPrincipalPolicy(describe_stack_policy);
        const stages = [
            {
                stageName: "Source",
                actions: [
                    new codepipeline_actions.GitHubSourceAction({
                        actionName: "CodeCommit_Source",
                        oauthToken: aws_cdk_lib_1.SecretValue.secretsManager("GithubToken"),
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
                            timeout: aws_cdk_lib_1.Duration.minutes(10),
                            projectName: this.sanitize_project_name(`${service_name} ${branch} synth`),
                            environment: build_env || BUILD_ENV,
                            buildSpec: codebuild.BuildSpec.fromObject({
                                version: "0.2",
                                phases: {
                                    install: {
                                        commands: ["n 16.15.1", "cd cdk", "npm install"],
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
    sanitize_project_name(project_name) {
        return project_name.replace(/-/g, "_").replace(/ /g, "_");
    }
}
exports.ServiceStagePipelinesStack = ServiceStagePipelinesStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZVN0YWdlUGlwZWxpbmVzU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTZXJ2aWNlU3RhZ2VQaXBlbGluZXNTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBa0Y7QUFDbEYsdURBQXVEO0FBQ3ZELDZEQUE2RDtBQUM3RCw2RUFBNkU7QUFDN0UsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUV6QyxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDbkMsTUFBTSxTQUFTLEdBQUc7SUFDakIsV0FBVyxFQUFFLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSztJQUN4QyxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0I7Q0FDdEQsQ0FBQztBQVdGOztHQUVHO0FBQ0gsTUFBYSwwQkFBMkIsU0FBUSxtQkFBSztJQUNwRCxZQUFZLEdBQVEsRUFBbUIsS0FBWTtRQUNsRCxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLFlBQVksWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRGYsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUdsRCxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQWM7O1FBQzdCLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLDBCQUEwQixFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFdkYsWUFBWTtRQUNaLE1BQU0sV0FBVyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1RCxNQUFNLG9CQUFvQixHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFB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QUFDO1FBRXJGLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzNDLFlBQVksRUFBRSxHQUFHLFlBQVksV0FBVztZQUN4QyxjQUFjO1lBQ2QsTUFBTTtTQUNOLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxZQUFvQjtRQUNqRCxPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNEO0FBM0lELGdFQTJJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFNlY3JldFZhbHVlLCBTdGFjaywgU3RhY2tQcm9wcywgVGFncyB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkXCI7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSBcImF3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmVcIjtcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnNcIjtcbmltcG9ydCAqIGFzIGlhbSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0ICogYXMgczMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1zM1wiO1xuXG5jb25zdCBBU1NFVFNfQlVDS0VUID0gXCJjb2RlLWFzc2V0XCI7XG5jb25zdCBCVUlMRF9FTlYgPSB7XG5cdGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuU01BTEwsXG5cdGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfMyxcbn07XG5cbmludGVyZmFjZSBQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuXHRyZWFkb25seSBzeXN0ZW06IHN0cmluZztcblx0cmVhZG9ubHkgcmVwb19vd25lcjogc3RyaW5nO1xuXHRyZWFkb25seSBwcm9kX2JyYW5jaDogc3RyaW5nO1xuXHRyZWFkb25seSBzZXJ2aWNlX25hbWU6IHN0cmluZztcblx0cmVhZG9ubHkgYnVpbGRfZW52PzogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnQ7XG5cdHJlYWRvbmx5IGFkZF9wb2xpY2llc190b19idWlsZF9yb2xlOiAoc3RhY2s6IFN0YWNrLCByb2xlOiBpYW0uUm9sZSkgPT4gYW55O1xufVxuXG4vKipcbiAqIFN0YWNrIHRoYXQgY29udGFpbnMgdGhlIHBpcGVsaW5lcyBvZiBlYWNoIFN0YWdlIG9mIHRoZSBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZVN0YWdlUGlwZWxpbmVzU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBQcm9wcykge1xuXHRcdHN1cGVyKGFwcCwgYCR7cHJvcHMuc2VydmljZV9uYW1lfS1waXBlbGluZXNgLCBwcm9wcyk7XG5cblx0XHRUYWdzLm9mKHRoaXMpLmFkZChcInN5c3RlbVwiLCBwcm9wcy5zeXN0ZW0pO1xuXG5cdFx0dGhpcy5jcmVhdGVfcGlwZWxpbmUocHJvcHMucHJvZF9icmFuY2gpO1xuXHR9XG5cblx0Y3JlYXRlX3BpcGVsaW5lKGJyYW5jaDogc3RyaW5nKSB7XG5cdFx0Y29uc3QgeyBzZXJ2aWNlX25hbWUsIGJ1aWxkX2VudiwgYWRkX3BvbGljaWVzX3RvX2J1aWxkX3JvbGUsIHJlcG9fb3duZXIgfSA9IHRoaXMucHJvcHM7XG5cblx0XHQvLyBhcnRpZmFjdHNcblx0XHRjb25zdCBzb3VyY2VfY29kZSA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoXCJTb3VyY2VDb2RlXCIpO1xuXHRcdGNvbnN0IHNlcnZpY2Vfc3ludGhfb3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdChcIkNka0J1aWxkT3V0cHV0XCIpO1xuXHRcdGNvbnN0IGNvZGVfYXNzZXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KFwiQnVpbGRPdXRwdXRcIik7XG5cblx0XHRjb25zdCBidWlsZF9wcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QodGhpcywgXCJCdWlsZFwiLCB7XG5cdFx0XHR0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDEwKSxcblx0XHRcdHByb2plY3ROYW1lOiB0aGlzLnNhbml0aXplX3Byb2plY3RfbmFtZShgJHtzZXJ2aWNlX25hbWV9IGJ1aWxkYCksXG5cdFx0XHRlbnZpcm9ubWVudDogYnVpbGRfZW52IHx8IEJVSUxEX0VOVixcblx0XHRcdGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcblx0XHRcdFx0dmVyc2lvbjogXCIwLjJcIixcblx0XHRcdFx0cGhhc2VzOiB7XG5cdFx0XHRcdFx0aW5zdGFsbDoge1xuXHRcdFx0XHRcdFx0Y29tbWFuZHM6IFtcImNkIGNvZGVcIiwgXCJucG0gaW5zdGFsbFwiXSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHByZV9idWlsZDoge1xuXHRcdFx0XHRcdFx0Y29tbWFuZHM6IFtgbnBtIHRlc3RgXSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGJ1aWxkOiB7XG5cdFx0XHRcdFx0XHRjb21tYW5kczogW1wibnBtIHJ1biBidWlsZFwiXSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhcnRpZmFjdHM6IHtcblx0XHRcdFx0XHRcImJhc2UtZGlyZWN0b3J5XCI6IFwiY29kZS9kaXN0XCIsXG5cdFx0XHRcdFx0ZmlsZXM6IFtcIioqLypcIl0sXG5cdFx0XHRcdH0sXG5cdFx0XHR9KSxcblx0XHR9KTtcblxuXHRcdC8vIGFkaWNpb25hIHBlcm1pc3NhbyBhbyBjb2RlYnVpbGQuXG5cdFx0YWRkX3BvbGljaWVzX3RvX2J1aWxkX3JvbGUodGhpcywgYnVpbGRfcHJvamVjdC5yb2xlIGFzIGlhbS5Sb2xlKTtcblxuXHRcdC8vIFBlcm1pc3NhbyBwYXJhIHBlZ2FyIHZhbG9yZXMgZXhwb3J0YWRvcyBkZSBvdXRyYXMgc3RhY2tzIHBhcmEgdGVzdGVzLlxuXHRcdGNvbnN0IGRlc2NyaWJlX3N0YWNrX3BvbGljeSA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcblx0XHRcdGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcblx0XHRcdGFjdGlvbnM6IFtcImNsb3VkZm9ybWF0aW9uOkRlc2NyaWJlU3RhY2tzXCJdLFxuXHRcdFx0cmVzb3VyY2VzOiBbYGFybjphd3M6Y2xvdWRmb3JtYXRpb246JHt0aGlzLnJlZ2lvbn06JHt0aGlzLmFjY291bnR9OnN0YWNrL3Rlc3QqYF0sXG5cdFx0fSk7XG5cblx0XHRidWlsZF9wcm9qZWN0Py5yb2xlPy5hZGRUb1ByaW5jaXBhbFBvbGljeShkZXNjcmliZV9zdGFja19wb2xpY3kpO1xuXG5cdFx0Y29uc3Qgc3RhZ2VzOiBjb2RlcGlwZWxpbmUuU3RhZ2VQcm9wc1tdID0gW1xuXHRcdFx0e1xuXHRcdFx0XHRzdGFnZU5hbWU6IFwiU291cmNlXCIsXG5cdFx0XHRcdGFjdGlvbnM6IFtcblx0XHRcdFx0XHRuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcblx0XHRcdFx0XHRcdGFjdGlvbk5hbWU6IFwiQ29kZUNvbW1pdF9Tb3VyY2VcIixcblx0XHRcdFx0XHRcdG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKFwiR2l0aHViVG9rZW5cIiksXG5cdFx0XHRcdFx0XHRvd25lcjogcmVwb19vd25lcixcblx0XHRcdFx0XHRcdHJlcG86IHNlcnZpY2VfbmFtZSxcblx0XHRcdFx0XHRcdGJyYW5jaCxcblx0XHRcdFx0XHRcdG91dHB1dDogc291cmNlX2NvZGUsXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdF0sXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRzdGFnZU5hbWU6IFwiQnVpbGRcIixcblx0XHRcdFx0YWN0aW9uczogW1xuXHRcdFx0XHRcdG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuXHRcdFx0XHRcdFx0YWN0aW9uTmFtZTogXCJTZXJ2aWNlX0J1aWxkXCIsXG5cdFx0XHRcdFx0XHRpbnB1dDogc291cmNlX2NvZGUsXG5cdFx0XHRcdFx0XHRwcm9qZWN0OiBidWlsZF9wcm9qZWN0LFxuXHRcdFx0XHRcdFx0b3V0cHV0czogW2NvZGVfYXNzZXRdLFxuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0c3RhZ2VOYW1lOiBcIlN5bnRoX0NES1wiLFxuXHRcdFx0XHRhY3Rpb25zOiBbXG5cdFx0XHRcdFx0bmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG5cdFx0XHRcdFx0XHRhY3Rpb25OYW1lOiBcIkNES19CdWlsZFwiLFxuXHRcdFx0XHRcdFx0aW5wdXQ6IHNvdXJjZV9jb2RlLFxuXHRcdFx0XHRcdFx0cHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QodGhpcywgXCJDZGtCdWlsZFwiLCB7XG5cdFx0XHRcdFx0XHRcdHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMTApLFxuXHRcdFx0XHRcdFx0XHRwcm9qZWN0TmFtZTogdGhpcy5zYW5pdGl6ZV9wcm9qZWN0X25hbWUoYCR7c2VydmljZV9uYW1lfSAke2JyYW5jaH0gc3ludGhgKSxcblx0XHRcdFx0XHRcdFx0ZW52aXJvbm1lbnQ6IGJ1aWxkX2VudiB8fCBCVUlMRF9FTlYsXG5cdFx0XHRcdFx0XHRcdGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcblx0XHRcdFx0XHRcdFx0XHR2ZXJzaW9uOiBcIjAuMlwiLFxuXHRcdFx0XHRcdFx0XHRcdHBoYXNlczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5zdGFsbDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb21tYW5kczogW1wibiAxNi4xNS4xXCIsIFwiY2QgY2RrXCIsIFwibnBtIGluc3RhbGxcIl0sXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0YnVpbGQ6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29tbWFuZHM6IFtcIm5wbSBydW4gYnVpbGRcIiwgXCJucG0gcnVuIGNkayBzeW50aCAtLSAtbyBkaXN0XCJdLFxuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGFydGlmYWN0czoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XCJiYXNlLWRpcmVjdG9yeVwiOiBcImNkay9kaXN0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWxlczogW2Ake3NlcnZpY2VfbmFtZX0udGVtcGxhdGUuanNvbmBdLFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRvdXRwdXRzOiBbc2VydmljZV9zeW50aF9vdXRwdXRdLFxuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRdLFxuXHRcdFx0fSxcblx0XHRdO1xuXG5cdFx0c3RhZ2VzLnB1c2goe1xuXHRcdFx0c3RhZ2VOYW1lOiBcIkRlcGxveVwiLFxuXHRcdFx0YWN0aW9uczogW1xuXHRcdFx0XHRuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvbih7XG5cdFx0XHRcdFx0YWN0aW9uTmFtZTogXCJDRk5fRGVwbG95XCIsXG5cdFx0XHRcdFx0dGVtcGxhdGVQYXRoOiBzZXJ2aWNlX3N5bnRoX291dHB1dC5hdFBhdGgoYCR7c2VydmljZV9uYW1lfS50ZW1wbGF0ZS5qc29uYCksXG5cdFx0XHRcdFx0c3RhY2tOYW1lOiBzZXJ2aWNlX25hbWUsXG5cdFx0XHRcdFx0YWRtaW5QZXJtaXNzaW9uczogdHJ1ZSxcblx0XHRcdFx0XHRwYXJhbWV0ZXJPdmVycmlkZXM6IHtcblx0XHRcdFx0XHRcdGNvZGVBc3NldEJ1Y2tldDogY29kZV9hc3NldC5zM0xvY2F0aW9uLmJ1Y2tldE5hbWUsXG5cdFx0XHRcdFx0XHRjb2RlQXNzZXRLZXk6IGNvZGVfYXNzZXQuczNMb2NhdGlvbi5vYmplY3RLZXksXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRleHRyYUlucHV0czogW2NvZGVfYXNzZXRdLFxuXHRcdFx0XHR9KSxcblx0XHRcdF0sXG5cdFx0fSk7XG5cblx0XHRjb25zdCBhcnRpZmFjdEJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZSh0aGlzLCBcIkFzc2V0c0J1Y2tldFwiLCBBU1NFVFNfQlVDS0VUKTtcblxuXHRcdG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUodGhpcywgXCJQaXBlbGluZVwiLCB7XG5cdFx0XHRwaXBlbGluZU5hbWU6IGAke3NlcnZpY2VfbmFtZX0tcGlwZWxpbmVgLFxuXHRcdFx0YXJ0aWZhY3RCdWNrZXQsXG5cdFx0XHRzdGFnZXMsXG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIHNhbml0aXplX3Byb2plY3RfbmFtZShwcm9qZWN0X25hbWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHByb2plY3RfbmFtZS5yZXBsYWNlKC8tL2csIFwiX1wiKS5yZXBsYWNlKC8gL2csIFwiX1wiKTtcblx0fVxufVxuIl19