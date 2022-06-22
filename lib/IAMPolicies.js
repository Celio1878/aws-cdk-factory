"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMPolicies = void 0;
const iam = require("aws-cdk-lib/aws-iam");
function IAMPolicies(stack) {
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
exports.IAMPolicies = IAMPolicies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSUFNUG9saWNpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJJQU1Qb2xpY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBMkM7QUFFM0MsU0FBZ0IsV0FBVyxDQUFDLEtBQVk7SUFDdkMsRUFBRTtJQUNGLE9BQU87UUFDTjs7OztXQUlHO1FBQ0gsR0FBRyxFQUFFLEdBQUcsRUFBRTtZQUNULE9BQU8sSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO2dCQUM5QixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2dCQUN4QixPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQztnQkFDN0UsU0FBUyxFQUFFLENBQUMsZUFBZSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLGNBQWMsQ0FBQzthQUN2RSxDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsR0FBRyxFQUFFLEdBQUcsRUFBRTtZQUNULE9BQU8sSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO2dCQUM5QixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2dCQUN4QixPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hCLFNBQVMsRUFBRSxDQUFDLGVBQWUsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxhQUFhLENBQUM7YUFDdEUsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUNEOzs7V0FHRztRQUNILFlBQVksRUFBRSxHQUFHLEVBQUU7WUFDbEIsT0FBTyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQzlCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQ3hCLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLDJCQUEyQixDQUFDO2dCQUN6RixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7YUFDZCxDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNkLE9BQU8sSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO2dCQUM5QixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2dCQUN4QixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ2QsU0FBUyxFQUFFLENBQUMsaUNBQWlDLEVBQUUsbUNBQW1DLENBQUM7YUFDbkYsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUNEOzs7V0FHRztRQUNILDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxPQUFPLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUNsRyxDQUFDO0tBQ0QsQ0FBQztBQUNILENBQUM7QUF4REQsa0NBd0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2sgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCAqIGFzIGlhbSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gSUFNUG9saWNpZXMoc3RhY2s6IFN0YWNrKSB7XG5cdC8vXG5cdHJldHVybiB7XG5cdFx0LyoqXG5cdFx0ICogQWNjZXNzIFBlcm1pc3Npb25zIHRvIHRoZSBTU00gUGFyYW1ldGVycy5cblx0XHQgKiBVc2VkIGZvciBzZWFyY2hpbmcgc2VydmljZV92YXJzLlxuXHRcdCAqIEByZXR1cm5zIGlhbS5Qb2xpY3lTdGF0ZW1lbnRcblx0XHQgKi9cblx0XHRTU006ICgpID0+IHtcblx0XHRcdHJldHVybiBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG5cdFx0XHRcdGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcblx0XHRcdFx0YWN0aW9uczogW1wic3NtOkdldFBhcmFtZXRlcnNCeVBhdGhcIiwgXCJzc206R2V0UGFyYW1ldGVyc1wiLCBcInNzbTpHZXRQYXJhbWV0ZXJcIl0sXG5cdFx0XHRcdHJlc291cmNlczogW2Bhcm46YXdzOnNzbToke3N0YWNrLnJlZ2lvbn06JHtzdGFjay5hY2NvdW50fTpwYXJhbWV0ZXIvKmBdLFxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBQZXJtaXNzaW9uIHRvIHNlbmQgbWVzc2FnZXMgdG8gdGhlIFNOUyAocHVibGlzaCBldmVudHMpLlxuXHRcdCAqIEByZXR1cm5zIGlhbS5Qb2xpY3lTdGF0ZW1lbnRcblx0XHQgKi9cblx0XHRTTlM6ICgpID0+IHtcblx0XHRcdHJldHVybiBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG5cdFx0XHRcdGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcblx0XHRcdFx0YWN0aW9uczogW1wiU05TOlB1Ymxpc2hcIl0sXG5cdFx0XHRcdHJlc291cmNlczogW2Bhcm46YXdzOnNuczoke3N0YWNrLnJlZ2lvbn06JHtzdGFjay5hY2NvdW50fTpwcm9kLXRvcGljYF0sXG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIFRhYmxlIFBlcm1pc3Npb25zIGFyZSB1c2VkIGZvciBjYWNoaW5nIHRoZSBzZXJ2aWNlcy5cblx0XHQgKiBAcmV0dXJucyBpYW0uUG9saWN5U3RhdGVtZW50XG5cdFx0ICovXG5cdFx0ZHluYW1vX2NhY2hlOiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuXHRcdFx0XHRlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG5cdFx0XHRcdHJlc291cmNlczogW2Bhcm46YXdzOmR5bmFtb2RiOiR7c3RhY2sucmVnaW9ufToke3N0YWNrLmFjY291bnR9OnRhYmxlL3Byb2Qtc2VydmljZS1jYWNoZWBdLFxuXHRcdFx0XHRhY3Rpb25zOiBbXCIqXCJdLFxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBCdWNrZXQgUGVybWlzc2lvbnMgYXJlIHVzZWQgZm9yIGNhY2hpbmcgdGhlIHNlcnZpY2VzLlxuXHRcdCAqIEByZXR1cm5zIGlhbS5Qb2xpY3lTdGF0ZW1lbnRcblx0XHQgKi9cblx0XHRzM19jYWNoZTogKCkgPT4ge1xuXHRcdFx0cmV0dXJuIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcblx0XHRcdFx0ZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuXHRcdFx0XHRhY3Rpb25zOiBbXCIqXCJdLFxuXHRcdFx0XHRyZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OnByb2Qtc2VydmljZS1jYWNoZWAsIGBhcm46YXdzOnMzOjo6cHJvZC1zZXJ2aWNlLWNhY2hlLypgXSxcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogUGVybWlzc2lvbiB0byBzZW5kIG1ldHJpY3MgdG8gQ2xvdWRXYXRjaC5cblx0XHQgKiBAcmV0dXJucyBpYW0uUG9saWN5U3RhdGVtZW50XG5cdFx0ICovXG5cdFx0Q2xvdWRXYXRjaExhbWJkYUluc2lnaHRzRXhlY3V0aW9uUm9sZVBvbGljeTogKCkgPT4ge1xuXHRcdFx0cmV0dXJuIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcIkNsb3VkV2F0Y2hMYW1iZGFJbnNpZ2h0c0V4ZWN1dGlvblJvbGVQb2xpY3lcIik7XG5cdFx0fSxcblx0fTtcbn1cbiJdfQ==