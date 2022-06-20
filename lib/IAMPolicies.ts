import { Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export function IAMPolicies(stack: Stack) {
	//
	return {
		/**
		 * Access Permissions to the SSM Parameters.
		 * Used for searching service_vars.
		 * @returns iam.PolicyStatement
		 */
		SSM: () => {
			return new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["ssm:GetParametersByPath", "ssm:GetParameters", "ssm:GetParameter"],
				resources: [`arn:aws:ssm:${stack.region}:${stack.account}:parameter/*`],
			});
		},
		/**
		 * Permission to send messages to the SNS (publish events).
		 * @returns iam.PolicyStatement
		 */
		SNS: () => {
			return new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["SNS:Publish"],
				resources: [`arn:aws:sns:${stack.region}:${stack.account}:prod-topic`],
			});
		},
		/**
		 * Table Permissions are used for caching the services.
		 * @returns iam.PolicyStatement
		 */
		dynamo_cache: () => {
			return new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				resources: [`arn:aws:dynamodb:${stack.region}:${stack.account}:table/prod-service-cache`],
				actions: ["*"],
			});
		},
		/**
		 * Bucket Permissions are used for caching the services.
		 * @returns iam.PolicyStatement
		 */
		s3_cache: () => {
			return new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["*"],
				resources: [`arn:aws:s3:::prod-service-cache`, `arn:aws:s3:::prod-service-cache/*`],
			});
		},
		/**
		 * Permission to send metrics to CloudWatch.
		 * @returns iam.PolicyStatement
		 */
		CloudWatchLambdaInsightsExecutionRolePolicy: () => {
			return iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLambdaInsightsExecutionRolePolicy");
		},
	};
}
