import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { TableProps } from 'aws-cdk-lib/aws-dynamodb';
import { normalize_name } from './normalize_name';

export function DynamoTable(
	stack: Stack,
	name: string,
	partitionKey: dynamodb.Attribute,
	props: Partial<TableProps> = {}
) {
	return new dynamodb.Table(stack, normalize_name(name), {
		tableName: name,
		billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
		removalPolicy: RemovalPolicy.RETAIN,
		pointInTimeRecovery: true,
		partitionKey,
		...props,
	});
}
