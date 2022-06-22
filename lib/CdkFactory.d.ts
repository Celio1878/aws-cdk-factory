import { Stack } from "aws-cdk-lib";
import { Attribute, TableProps } from "aws-cdk-lib/aws-dynamodb";
export declare function CdkFactory(stack: Stack, service_name: string): {
    Lambda: (env_vars?: any, overrides?: Partial<import("aws-cdk-lib/aws-lambda").FunctionProps>, functionName?: string) => import("aws-cdk-lib/aws-lambda").Function;
    LambdaEventsSubscription: (lambda: import("aws-cdk-lib/aws-lambda").Function, event_names: string[]) => void;
    RestApi: (lambda: import("aws-cdk-lib/aws-lambda").Function, overrides?: Partial<import("aws-cdk-lib/aws-apigateway").LambdaRestApiProps>) => import("aws-cdk-lib/aws-apigateway").LambdaRestApi;
    ServiceVars: {
        StringParam: (name: string, value: string) => void;
        ApiUrl: (api: import("aws-cdk-lib/aws-apigateway").LambdaRestApi) => void;
    };
    DynamoTable: (name: string, partitionKey: Attribute, props?: Partial<TableProps>) => import("aws-cdk-lib/aws-dynamodb").Table;
};
