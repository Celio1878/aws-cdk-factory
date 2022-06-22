import { Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
/**
 * Utilitary to add service variables to SSM.
 *
 * @see https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
 * @param stack
 * @param service_name
 * @returns
 */
export declare function ServiceVars(stack: Stack, service_name: string): {
    StringParam: (name: string, value: string) => void;
    /**
     * Add the endpoint of the api to SSM.
     * @param api
     */
    ApiUrl: (api: apigateway.LambdaRestApi) => void;
};
