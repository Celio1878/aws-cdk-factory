import { CfnParameter, Duration, Stack } from "aws-cdk-lib";
import * as codedeploy from "aws-cdk-lib/aws-codedeploy";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { FunctionProps, ILayerVersion } from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { normalize_name } from "./normalize_name";

export function Lambda(stack: Stack, service_name: string, region = "sa-east-1") {
	return (env_vars: any = {}, overrides: Partial<FunctionProps> = {}, functionName = service_name) => {
		const normalized_function_name = normalize_name(functionName);

		const lambda_resources = new StackCommonLambdaResources(stack);

		const lambda_func = new lambda.Function(stack, `Lambda${normalized_function_name}`, {
			code: lambda_resources.code,
			functionName,
			handler: "handler.api",
			runtime: lambda.Runtime.NODEJS_16_X,
			description: `Function generated on: ${new Date().toISOString()}`,
			environment: {
				REGION: region,
				SERVICE_NAME: service_name,
				...env_vars,
			},
			timeout: Duration.seconds(10),
			memorySize: 1024,
			layers: [lambda_resources.insights_layer],
			...overrides,
		});

		const alias = new lambda.Alias(stack, `LambdaAlias${normalized_function_name}`, {
			aliasName: "Prod",
			version: lambda_func.currentVersion,
		});

		new codedeploy.LambdaDeploymentGroup(stack, `DeploymentGroup${normalized_function_name}`, {
			alias,
			deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
		});

		return lambda_func;
	};
}

type StackId = string;
/**
 * Common resources for all lambdas in a stack.
 */
class StackCommonLambdaResources {
	private stack_id: StackId;
	private static cache = new Map<StackId, { code: lambda.S3Code; insights_layer: ILayerVersion }>();

	constructor(stack: Stack) {
		this.stack_id = stack.stackId;

		if (!StackCommonLambdaResources.cache.has(stack.stackId)) {
			const code = this.get_code(stack);
			const insights_layer = this.get_insisights_layer(stack);

			StackCommonLambdaResources.cache.set(stack.stackId, {
				code,
				insights_layer,
			});
		}
	}

	private get_code(stack: Stack) {
		const code_asset_bucket = new CfnParameter(stack, "codeAssetBucket", {
			type: "String",
			description: "Bucket that contains the lambda code.",
		});

		const code_asset_key = new CfnParameter(stack, "codeAssetKey", {
			type: "String",
			description: "Key that contains the lambda code.",
		});

		return lambda.Code.fromBucket(
			s3.Bucket.fromBucketName(stack, "AssetsBucket", code_asset_bucket.valueAsString),
			code_asset_key.valueAsString
		);
	}

	private get_insisights_layer(stack: Stack) {
		const layerArn = `arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:14`;

		return lambda.LayerVersion.fromLayerVersionArn(stack, `LayerFromArn`, layerArn);
	}

	public get code() {
		const code = StackCommonLambdaResources.cache.get(this.stack_id)?.code;

		if (!code) {
			throw new Error("code not found in the cache" + this.stack_id);
		}

		return code;
	}

	public get insights_layer() {
		const layer = StackCommonLambdaResources.cache.get(this.stack_id)?.insights_layer;

		if (!layer) {
			throw new Error("nao achou layer no cache");
		}

		return layer;
	}
}
