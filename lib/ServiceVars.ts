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
	function add_string_param(name: string, value: string) {
		const ssm_parameter = new ssm.StringParameter(stack, parameter_id(name), {
			parameterName: parameter_name(service_name, name),
			stringValue: value,
		});

		return ssm_parameter;
	}

	return {
		StringParam: add_string_param,
		/**
		 * Add the endpoint of the api to SSM.
		 * @param api
		 */
		ApiUrl: (api: apigateway.LambdaRestApi) => add_string_param("api", `${api.url}${service_name}`),
	};
}

function parameter_id(id: string): string {
	const sanitized_name = id.replace(/[ -_]/g, "");

	return sanitized_name;
}

function parameter_name(service_name: string, parameter_name: string): string {
	const sanitized_parameter_name = `${service_name}_${parameter_name}`
		.trim()
		.toUpperCase()
		.replace(/-/g, "_");

	return `/output/${service_name}/${sanitized_parameter_name}`;
}
