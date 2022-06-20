import { Duration, Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_evt_srcs from "aws-cdk-lib/aws-lambda-event-sources";
import * as sns from "aws-cdk-lib/aws-sns";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { normalize } from "path";

/**
 * Create the infrastructure necessary to invoke a lambda when an event is received by the SNS.
 *
 * @param stack
 * @param service_name
 * @param region
 * @returns
 */

export function LambdaEventsSubscription(stack: Stack, service_name: string, region = "sa-east-1") {
	return (lambda: lambda.Function, event_names: string[]) => {
		const events_topic = sns.Topic.fromTopicArn(
			stack,
			"EventsTopic",
			`arn:aws:sns:${region}:${stack.account}:prod-topic`
		);

		const queue = create_queue(stack, service_name);

		const subscription = new SqsSubscription(queue, {
			filterPolicy: {
				event: sns.SubscriptionFilter.stringFilter({
					allowlist: event_names,
				}),
			},
		});

		events_topic.addSubscription(subscription);

		const event_src = new lambda_evt_srcs.SqsEventSource(queue);

		lambda.addEventSource(event_src);
	};
}

function create_queue(stack: Stack, service_name: string) {
	const dlq = new sqs.Queue(stack, normalize(`${service_name}EventsDLQ`), {
		queueName: `${service_name}-dlq`,
		retentionPeriod: Duration.days(5),
	});

	return new sqs.Queue(stack, `${service_name}EventsQueue`, {
		queueName: `${service_name}-queue`,
		visibilityTimeout: Duration.seconds(20),
		receiveMessageWaitTime: Duration.seconds(10),
		deadLetterQueue: {
			maxReceiveCount: 3,
			queue: dlq,
		},
	});
}
