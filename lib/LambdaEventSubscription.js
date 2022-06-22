"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaEventsSubscription = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda_evt_srcs = require("aws-cdk-lib/aws-lambda-event-sources");
const sns = require("aws-cdk-lib/aws-sns");
const aws_sns_subscriptions_1 = require("aws-cdk-lib/aws-sns-subscriptions");
const sqs = require("aws-cdk-lib/aws-sqs");
const path_1 = require("path");
/**
 * Create the infrastructure necessary to invoke a lambda when an event is received by the SNS.
 *
 * @param stack
 * @param service_name
 * @param region
 * @returns
 */
function LambdaEventsSubscription(stack, service_name, region = "sa-east-1") {
    return (lambda, event_names) => {
        const events_topic = sns.Topic.fromTopicArn(stack, "EventsTopic", `arn:aws:sns:${region}:${stack.account}:prod-topic`);
        const queue = create_queue(stack, service_name);
        const subscription = new aws_sns_subscriptions_1.SqsSubscription(queue, {
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
exports.LambdaEventsSubscription = LambdaEventsSubscription;
function create_queue(stack, service_name) {
    const dlq = new sqs.Queue(stack, (0, path_1.normalize)(`${service_name}EventsDLQ`), {
        queueName: `${service_name}-dlq`,
        retentionPeriod: aws_cdk_lib_1.Duration.days(5),
    });
    return new sqs.Queue(stack, `${service_name}EventsQueue`, {
        queueName: `${service_name}-queue`,
        visibilityTimeout: aws_cdk_lib_1.Duration.seconds(20),
        receiveMessageWaitTime: aws_cdk_lib_1.Duration.seconds(10),
        deadLetterQueue: {
            maxReceiveCount: 3,
            queue: dlq,
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmRhRXZlbnRTdWJzY3JpcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJMYW1iZGFFdmVudFN1YnNjcmlwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBOEM7QUFFOUMsd0VBQXdFO0FBQ3hFLDJDQUEyQztBQUMzQyw2RUFBb0U7QUFDcEUsMkNBQTJDO0FBQzNDLCtCQUFpQztBQUVqQzs7Ozs7OztHQU9HO0FBRUgsU0FBZ0Isd0JBQXdCLENBQUMsS0FBWSxFQUFFLFlBQW9CLEVBQUUsTUFBTSxHQUFHLFdBQVc7SUFDaEcsT0FBTyxDQUFDLE1BQXVCLEVBQUUsV0FBcUIsRUFBRSxFQUFFO1FBQ3pELE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUMxQyxLQUFLLEVBQ0wsYUFBYSxFQUNiLGVBQWUsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLGFBQWEsQ0FDbkQsQ0FBQztRQUVGLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFaEQsTUFBTSxZQUFZLEdBQUcsSUFBSSx1Q0FBZSxDQUFDLEtBQUssRUFBRTtZQUMvQyxZQUFZLEVBQUU7Z0JBQ2IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7b0JBQzFDLFNBQVMsRUFBRSxXQUFXO2lCQUN0QixDQUFDO2FBQ0Y7U0FDRCxDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTNDLE1BQU0sU0FBUyxHQUFHLElBQUksZUFBZSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1RCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQztBQUNILENBQUM7QUF4QkQsNERBd0JDO0FBRUQsU0FBUyxZQUFZLENBQUMsS0FBWSxFQUFFLFlBQW9CO0lBQ3ZELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBQSxnQkFBUyxFQUFDLEdBQUcsWUFBWSxXQUFXLENBQUMsRUFBRTtRQUN2RSxTQUFTLEVBQUUsR0FBRyxZQUFZLE1BQU07UUFDaEMsZUFBZSxFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNqQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxZQUFZLGFBQWEsRUFBRTtRQUN6RCxTQUFTLEVBQUUsR0FBRyxZQUFZLFFBQVE7UUFDbEMsaUJBQWlCLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLHNCQUFzQixFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxlQUFlLEVBQUU7WUFDaEIsZUFBZSxFQUFFLENBQUM7WUFDbEIsS0FBSyxFQUFFLEdBQUc7U0FDVjtLQUNELENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgbGFtYmRhX2V2dF9zcmNzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXNcIjtcbmltcG9ydCAqIGFzIHNucyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXNuc1wiO1xuaW1wb3J0IHsgU3FzU3Vic2NyaXB0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1zbnMtc3Vic2NyaXB0aW9uc1wiO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc3FzXCI7XG5pbXBvcnQgeyBub3JtYWxpemUgfSBmcm9tIFwicGF0aFwiO1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgaW5mcmFzdHJ1Y3R1cmUgbmVjZXNzYXJ5IHRvIGludm9rZSBhIGxhbWJkYSB3aGVuIGFuIGV2ZW50IGlzIHJlY2VpdmVkIGJ5IHRoZSBTTlMuXG4gKlxuICogQHBhcmFtIHN0YWNrXG4gKiBAcGFyYW0gc2VydmljZV9uYW1lXG4gKiBAcGFyYW0gcmVnaW9uXG4gKiBAcmV0dXJuc1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBMYW1iZGFFdmVudHNTdWJzY3JpcHRpb24oc3RhY2s6IFN0YWNrLCBzZXJ2aWNlX25hbWU6IHN0cmluZywgcmVnaW9uID0gXCJzYS1lYXN0LTFcIikge1xuXHRyZXR1cm4gKGxhbWJkYTogbGFtYmRhLkZ1bmN0aW9uLCBldmVudF9uYW1lczogc3RyaW5nW10pID0+IHtcblx0XHRjb25zdCBldmVudHNfdG9waWMgPSBzbnMuVG9waWMuZnJvbVRvcGljQXJuKFxuXHRcdFx0c3RhY2ssXG5cdFx0XHRcIkV2ZW50c1RvcGljXCIsXG5cdFx0XHRgYXJuOmF3czpzbnM6JHtyZWdpb259OiR7c3RhY2suYWNjb3VudH06cHJvZC10b3BpY2Bcblx0XHQpO1xuXG5cdFx0Y29uc3QgcXVldWUgPSBjcmVhdGVfcXVldWUoc3RhY2ssIHNlcnZpY2VfbmFtZSk7XG5cblx0XHRjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3FzU3Vic2NyaXB0aW9uKHF1ZXVlLCB7XG5cdFx0XHRmaWx0ZXJQb2xpY3k6IHtcblx0XHRcdFx0ZXZlbnQ6IHNucy5TdWJzY3JpcHRpb25GaWx0ZXIuc3RyaW5nRmlsdGVyKHtcblx0XHRcdFx0XHRhbGxvd2xpc3Q6IGV2ZW50X25hbWVzLFxuXHRcdFx0XHR9KSxcblx0XHRcdH0sXG5cdFx0fSk7XG5cblx0XHRldmVudHNfdG9waWMuYWRkU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbik7XG5cblx0XHRjb25zdCBldmVudF9zcmMgPSBuZXcgbGFtYmRhX2V2dF9zcmNzLlNxc0V2ZW50U291cmNlKHF1ZXVlKTtcblxuXHRcdGxhbWJkYS5hZGRFdmVudFNvdXJjZShldmVudF9zcmMpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfcXVldWUoc3RhY2s6IFN0YWNrLCBzZXJ2aWNlX25hbWU6IHN0cmluZykge1xuXHRjb25zdCBkbHEgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCBub3JtYWxpemUoYCR7c2VydmljZV9uYW1lfUV2ZW50c0RMUWApLCB7XG5cdFx0cXVldWVOYW1lOiBgJHtzZXJ2aWNlX25hbWV9LWRscWAsXG5cdFx0cmV0ZW50aW9uUGVyaW9kOiBEdXJhdGlvbi5kYXlzKDUpLFxuXHR9KTtcblxuXHRyZXR1cm4gbmV3IHNxcy5RdWV1ZShzdGFjaywgYCR7c2VydmljZV9uYW1lfUV2ZW50c1F1ZXVlYCwge1xuXHRcdHF1ZXVlTmFtZTogYCR7c2VydmljZV9uYW1lfS1xdWV1ZWAsXG5cdFx0dmlzaWJpbGl0eVRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMjApLFxuXHRcdHJlY2VpdmVNZXNzYWdlV2FpdFRpbWU6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuXHRcdGRlYWRMZXR0ZXJRdWV1ZToge1xuXHRcdFx0bWF4UmVjZWl2ZUNvdW50OiAzLFxuXHRcdFx0cXVldWU6IGRscSxcblx0XHR9LFxuXHR9KTtcbn1cbiJdfQ==