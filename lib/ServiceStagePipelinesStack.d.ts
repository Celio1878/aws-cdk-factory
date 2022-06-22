import { App, Stack, StackProps } from "aws-cdk-lib";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as iam from "aws-cdk-lib/aws-iam";
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
export declare class ServiceStagePipelinesStack extends Stack {
    private readonly props;
    constructor(app: App, props: Props);
    create_pipeline(branch: string): void;
    private sanitize_project_name;
}
export {};
