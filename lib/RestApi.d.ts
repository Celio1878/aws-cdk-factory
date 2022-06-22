import { Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { LambdaRestApiProps } from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
export declare function RestApi(stack: Stack, service_name: string): (lambda: lambda.Function, overrides?: Partial<LambdaRestApiProps>) => apigateway.LambdaRestApi;
