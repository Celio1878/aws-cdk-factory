import { Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { TableProps } from 'aws-cdk-lib/aws-dynamodb';
export declare function DynamoTable(stack: Stack, name: string, partitionKey: dynamodb.Attribute, props?: Partial<TableProps>): dynamodb.Table;
