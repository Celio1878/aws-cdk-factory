import { Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { LambdaRestApiProps } from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export function RestApi(stack: Stack, service_name: string) {
	return (lambda: lambda.Function, overrides: Partial<LambdaRestApiProps> = {}) => {
		return new apigateway.LambdaRestApi(stack, `${service_name}-api`, {
			handler: lambda,
			endpointTypes: [apigateway.EndpointType.REGIONAL],
			deployOptions: {
				throttlingRateLimit: 40,
				throttlingBurstLimit: 80,
			},
			...overrides,
		});
	};
}
