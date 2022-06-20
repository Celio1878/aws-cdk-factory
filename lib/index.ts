import { Stack } from "aws-cdk-lib";
import { Attribute, TableProps } from "aws-cdk-lib/aws-dynamodb";
import { DynamoTable as _DynamoTable } from "./DynamoTable";
import { IAMPolicies as _IAMPolicies } from "./IAMPolicies";
import { Lambda as _Lambda } from "./Lambda";
import { LambdaEventsSubscription as _LambdaEventsSubscription } from "./LambdaEventSubscription";
import { RestApi as _RestApi } from "./RestApi";
import { ServiceStagePipelinesStack as _ServiceStagePipelinesStack } from "./ServiceStagePipelinesStack";
import { ServiceVars as _ServiceVars } from "./ServiceVars";

export namespace NodeCdkFactory {
	export const DynamoTable = _DynamoTable;
	export const ServiceStagePipelinesStack = _ServiceStagePipelinesStack;
	export const IAMPolicies = _IAMPolicies;

	export function Factory(stack: Stack, service_name: string) {
		return {
			Lambda: _Lambda(stack, service_name),
			LambdaEventsSubscription: _LambdaEventsSubscription(stack, service_name),
			RestApi: _RestApi(stack, service_name),
			ServiceVars: _ServiceVars(stack, service_name),
			DynamoTable: (name: string, partitionKey: Attribute, props: Partial<TableProps> = {}) =>
				_DynamoTable(stack, name, partitionKey, props),
		};
	}
}
