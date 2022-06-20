import { Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as ssm from "aws-cdk-lib/aws-ssm";

/**
 * Utilitary to add service variables to SSM.
 *
 * @see https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
 * @param stack
 * @param service_name
 * @returns
 */
export function ServiceVars(stack: Stack, service_name: string) {
	const add_string_param = (name: string, value: string) => {
		new ssm.StringParameter(stack, parameter_id(name), {
			parameterName: parameter_name(service_name, name),
			stringValue: value,
		});
	};

	return {
		StringParam: add_string_param,
		/**
		 * Add the endpoint of the api to SSM.
		 * @param api
		 */
		ApiUrl: (api: apigateway.LambdaRestApi) => {
			add_string_param("api", `${api.url}${service_name}`);
		},
	};
}

function parameter_id(id: string) {
	return id.replace(/ /g, "").replace(/-/g, "").replace(/_/g, "");
}

function parameter_name(service_name: string, parameter_name: string) {
	const name = `${service_name}_${parameter_name}`.trim().toUpperCase().replace(/-/g, "_");

	return `/output/${service_name}/${name}`;
}
