#!/usr/bin/env node
import { App, Stack } from "aws-cdk-lib";
import { CdkFactory } from "../lib";

export function create_stacks(props: { service_name: string; system: string }) {
	const app = new App();

	const stack = new Stack(app, "TopicsStack");

	const factory = CdkFactory(stack, props.service_name);

	const evts_lambda = factory.Lambda({}, { handler: "handler.events" }, "evts");

	factory.LambdaEventsSubscription(evts_lambda, ["evt"]);
}
