import { Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { FunctionProps } from "aws-cdk-lib/aws-lambda";
export declare function Lambda(stack: Stack, service_name: string, region?: string): (env_vars?: any, overrides?: Partial<FunctionProps>, functionName?: string) => lambda.Function;
