import { Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
export declare function IAMPolicies(stack: Stack): {
    /**
     * Access Permissions to the SSM Parameters.
     * Used for searching service_vars.
     * @returns iam.PolicyStatement
     */
    SSM: () => iam.PolicyStatement;
    /**
     * Permission to send messages to the SNS (publish events).
     * @returns iam.PolicyStatement
     */
    SNS: () => iam.PolicyStatement;
    /**
     * Table Permissions are used for caching the services.
     * @returns iam.PolicyStatement
     */
    dynamo_cache: () => iam.PolicyStatement;
    /**
     * Bucket Permissions are used for caching the services.
     * @returns iam.PolicyStatement
     */
    s3_cache: () => iam.PolicyStatement;
    /**
     * Permission to send metrics to CloudWatch.
     * @returns iam.PolicyStatement
     */
    CloudWatchLambdaInsightsExecutionRolePolicy: () => iam.IManagedPolicy;
};
