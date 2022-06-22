import { Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
/**
 * Create the infrastructure necessary to invoke a lambda when an event is received by the SNS.
 *
 * @param stack
 * @param service_name
 * @param region
 * @returns
 */
export declare function LambdaEventsSubscription(stack: Stack, service_name: string, region?: string): (lambda: lambda.Function, event_names: string[]) => void;
