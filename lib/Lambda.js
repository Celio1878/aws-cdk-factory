"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const codedeploy = require("aws-cdk-lib/aws-codedeploy");
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");
const normalize_name_1 = require("./normalize_name");
function Lambda(stack, service_name, region = "sa-east-1") {
    return (env_vars = {}, overrides = {}, functionName = service_name) => {
        const normalized_function_name = (0, normalize_name_1.normalize_name)(functionName);
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
            timeout: aws_cdk_lib_1.Duration.seconds(10),
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
exports.Lambda = Lambda;
/**
 * Common resources for all lambdas in a stack.
 */
class StackCommonLambdaResources {
    constructor(stack) {
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
    get_code(stack) {
        const code_asset_bucket = new aws_cdk_lib_1.CfnParameter(stack, "codeAssetBucket", {
            type: "String",
            description: "Bucket that contains the lambda code.",
        });
        const code_asset_key = new aws_cdk_lib_1.CfnParameter(stack, "codeAssetKey", {
            type: "String",
            description: "Key that contains the lambda code.",
        });
        return lambda.Code.fromBucket(s3.Bucket.fromBucketName(stack, "AssetsBucket", code_asset_bucket.valueAsString), code_asset_key.valueAsString);
    }
    get_insisights_layer(stack) {
        const layerArn = `arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:14`;
        return lambda.LayerVersion.fromLayerVersionArn(stack, `LayerFromArn`, layerArn);
    }
    get code() {
        var _a;
        const code = (_a = StackCommonLambdaResources.cache.get(this.stack_id)) === null || _a === void 0 ? void 0 : _a.code;
        if (!code) {
            throw new Error("code not found in the cache" + this.stack_id);
        }
        return code;
    }
    get insights_layer() {
        var _a;
        const layer = (_a = StackCommonLambdaResources.cache.get(this.stack_id)) === null || _a === void 0 ? void 0 : _a.insights_layer;
        if (!layer) {
            throw new Error("nao achou layer no cache");
        }
        return layer;
    }
}
StackCommonLambdaResources.cache = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUE0RDtBQUM1RCx5REFBeUQ7QUFDekQsaURBQWlEO0FBRWpELHlDQUF5QztBQUN6QyxxREFBa0Q7QUFFbEQsU0FBZ0IsTUFBTSxDQUFDLEtBQVksRUFBRSxZQUFvQixFQUFFLE1BQU0sR0FBRyxXQUFXO0lBQzlFLE9BQU8sQ0FBQyxXQUFnQixFQUFFLEVBQUUsWUFBb0MsRUFBRSxFQUFFLFlBQVksR0FBRyxZQUFZLEVBQUUsRUFBRTtRQUNsRyxNQUFNLHdCQUF3QixHQUFHLElBQUEsK0JBQWMsRUFBQyxZQUFZLENBQUMsQ0FBQztRQUU5RCxNQUFNLGdCQUFnQixHQUFHLElBQUksMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLHdCQUF3QixFQUFFLEVBQUU7WUFDbkYsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUk7WUFDM0IsWUFBWTtZQUNaLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsV0FBVyxFQUFFLDBCQUEwQixJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ2pFLFdBQVcsRUFBRTtnQkFDWixNQUFNLEVBQUUsTUFBTTtnQkFDZCxZQUFZLEVBQUUsWUFBWTtnQkFDMUIsR0FBRyxRQUFRO2FBQ1g7WUFDRCxPQUFPLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzdCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztZQUN6QyxHQUFHLFNBQVM7U0FDWixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxL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ImF3cy1jZGstbGliXCI7XG5pbXBvcnQgKiBhcyBjb2RlZGVwbG95IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY29kZWRlcGxveVwiO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBGdW5jdGlvblByb3BzLCBJTGF5ZXJWZXJzaW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIHMzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtczNcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZV9uYW1lIH0gZnJvbSBcIi4vbm9ybWFsaXplX25hbWVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIExhbWJkYShzdGFjazogU3RhY2ssIHNlcnZpY2VfbmFtZTogc3RyaW5nLCByZWdpb24gPSBcInNhLWVhc3QtMVwiKSB7XG5cdHJldHVybiAoZW52X3ZhcnM6IGFueSA9IHt9LCBvdmVycmlkZXM6IFBhcnRpYWw8RnVuY3Rpb25Qcm9wcz4gPSB7fSwgZnVuY3Rpb25OYW1lID0gc2VydmljZV9uYW1lKSA9PiB7XG5cdFx0Y29uc3Qgbm9ybWFsaXplZF9mdW5jdGlvbl9uYW1lID0gbm9ybWFsaXplX25hbWUoZnVuY3Rpb25OYW1lKTtcblxuXHRcdGNvbnN0IGxhbWJkYV9yZXNvdXJjZXMgPSBuZXcgU3RhY2tDb21tb25MYW1iZGFSZXNvdXJjZXMoc3RhY2spO1xuXG5cdFx0Y29uc3QgbGFtYmRhX2Z1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCBgTGFtYmRhJHtub3JtYWxpemVkX2Z1bmN0aW9uX25hbWV9YCwge1xuXHRcdFx0Y29kZTogbGFtYmRhX3Jlc291cmNlcy5jb2RlLFxuXHRcdFx0ZnVuY3Rpb25OYW1lLFxuXHRcdFx0aGFuZGxlcjogXCJoYW5kbGVyLmFwaVwiLFxuXHRcdFx0cnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE2X1gsXG5cdFx0XHRkZXNjcmlwdGlvbjogYEZ1bmN0aW9uIGdlbmVyYXRlZCBvbjogJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9YCxcblx0XHRcdGVudmlyb25tZW50OiB7XG5cdFx0XHRcdFJFR0lPTjogcmVnaW9uLFxuXHRcdFx0XHRTRVJWSUNFX05BTUU6IHNlcnZpY2VfbmFtZSxcblx0XHRcdFx0Li4uZW52X3ZhcnMsXG5cdFx0XHR9LFxuXHRcdFx0dGltZW91dDogRHVyYXRpb24uc2Vjb25kcygxMCksXG5cdFx0XHRtZW1vcnlTaXplOiAxMDI0LFxuXHRcdFx0bGF5ZXJzOiBbbGFtYmRhX3Jlc291cmNlcy5pbnNpZ2h0c19sYXllcl0sXG5cdFx0XHQuLi5vdmVycmlkZXMsXG5cdFx0fSk7XG5cblx0XHRjb25zdCBhbGlhcyA9IG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssIGBMYW1iZGFBbGlhcyR7bm9ybWFsaXplZF9mdW5jdGlvbl9uYW1lfWAsIHtcblx0XHRcdGFsaWFzTmFtZTogXCJQcm9kXCIsXG5cdFx0XHR2ZXJzaW9uOiBsYW1iZGFfZnVuYy5jdXJyZW50VmVyc2lvbixcblx0XHR9KTtcblxuXHRcdG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgYERlcGxveW1lbnRHcm91cCR7bm9ybWFsaXplZF9mdW5jdGlvbl9uYW1lfWAsIHtcblx0XHRcdGFsaWFzLFxuXHRcdFx0ZGVwbG95bWVudENvbmZpZzogY29kZWRlcGxveS5MYW1iZGFEZXBsb3ltZW50Q29uZmlnLkFMTF9BVF9PTkNFLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGxhbWJkYV9mdW5jO1xuXHR9O1xufVxuXG50eXBlIFN0YWNrSWQgPSBzdHJpbmc7XG4vKipcbiAqIENvbW1vbiByZXNvdXJjZXMgZm9yIGFsbCBsYW1iZGFzIGluIGEgc3RhY2suXG4gKi9cbmNsYXNzIFN0YWNrQ29tbW9uTGFtYmRhUmVzb3VyY2VzIHtcblx0cHJpdmF0ZSBzdGFja19pZDogU3RhY2tJZDtcblx0cHJpdmF0ZSBzdGF0aWMgY2FjaGUgPSBuZXcgTWFwPFN0YWNrSWQsIHsgY29kZTogbGFtYmRhLlMzQ29kZTsgaW5zaWdodHNfbGF5ZXI6IElMYXllclZlcnNpb24gfT4oKTtcblxuXHRjb25zdHJ1Y3RvcihzdGFjazogU3RhY2spIHtcblx0XHR0aGlzLnN0YWNrX2lkID0gc3RhY2suc3RhY2tJZDtcblxuXHRcdGlmICghU3RhY2tDb21tb25MYW1iZGFSZXNvdXJjZXMuY2FjaGUuaGFzKHN0YWNrLnN0YWNrSWQpKSB7XG5cdFx0XHRjb25zdCBjb2RlID0gdGhpcy5nZXRfY29kZShzdGFjayk7XG5cdFx0XHRjb25zdCBpbnNpZ2h0c19sYXllciA9IHRoaXMuZ2V0X2luc2lzaWdodHNfbGF5ZXIoc3RhY2spO1xuXG5cdFx0XHRTdGFja0NvbW1vbkxhbWJkYVJlc291cmNlcy5jYWNoZS5zZXQoc3RhY2suc3RhY2tJZCwge1xuXHRcdFx0XHRjb2RlLFxuXHRcdFx0XHRpbnNpZ2h0c19sYXllcixcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgZ2V0X2NvZGUoc3RhY2s6IFN0YWNrKSB7XG5cdFx0Y29uc3QgY29kZV9hc3NldF9idWNrZXQgPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCBcImNvZGVBc3NldEJ1Y2tldFwiLCB7XG5cdFx0XHR0eXBlOiBcIlN0cmluZ1wiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiQnVja2V0IHRoYXQgY29udGFpbnMgdGhlIGxhbWJkYSBjb2RlLlwiLFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgY29kZV9hc3NldF9rZXkgPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCBcImNvZGVBc3NldEtleVwiLCB7XG5cdFx0XHR0eXBlOiBcIlN0cmluZ1wiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiS2V5IHRoYXQgY29udGFpbnMgdGhlIGxhbWJkYSBjb2RlLlwiLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGxhbWJkYS5Db2RlLmZyb21CdWNrZXQoXG5cdFx0XHRzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUoc3RhY2ssIFwiQXNzZXRzQnVja2V0XCIsIGNvZGVfYXNzZXRfYnVja2V0LnZhbHVlQXNTdHJpbmcpLFxuXHRcdFx0Y29kZV9hc3NldF9rZXkudmFsdWVBc1N0cmluZ1xuXHRcdCk7XG5cdH1cblxuXHRwcml2YXRlIGdldF9pbnNpc2lnaHRzX2xheWVyKHN0YWNrOiBTdGFjaykge1xuXHRcdGNvbnN0IGxheWVyQXJuID0gYGFybjphd3M6bGFtYmRhOnNhLWVhc3QtMTo1ODAyNDcyNzU0MzU6bGF5ZXI6TGFtYmRhSW5zaWdodHNFeHRlbnNpb246MTRgO1xuXG5cdFx0cmV0dXJuIGxhbWJkYS5MYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybihzdGFjaywgYExheWVyRnJvbUFybmAsIGxheWVyQXJuKTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgY29kZSgpIHtcblx0XHRjb25zdCBjb2RlID0gU3RhY2tDb21tb25MYW1iZGFSZXNvdXJjZXMuY2FjaGUuZ2V0KHRoaXMuc3RhY2tfaWQpPy5jb2RlO1xuXG5cdFx0aWYgKCFjb2RlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjb2RlIG5vdCBmb3VuZCBpbiB0aGUgY2FjaGVcIiArIHRoaXMuc3RhY2tfaWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0cHVibGljIGdldCBpbnNpZ2h0c19sYXllcigpIHtcblx0XHRjb25zdCBsYXllciA9IFN0YWNrQ29tbW9uTGFtYmRhUmVzb3VyY2VzLmNhY2hlLmdldCh0aGlzLnN0YWNrX2lkKT8uaW5zaWdodHNfbGF5ZXI7XG5cblx0XHRpZiAoIWxheWVyKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJuYW8gYWNob3UgbGF5ZXIgbm8gY2FjaGVcIik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxheWVyO1xuXHR9XG59XG4iXX0=