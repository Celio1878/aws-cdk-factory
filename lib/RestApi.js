"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestApi = void 0;
const apigateway = require("aws-cdk-lib/aws-apigateway");
function RestApi(stack, service_name) {
    return (lambda, overrides = {}) => {
        return new apigateway.LambdaRestApi(stack, `${service_name}-api`, {
            handler: lambda,
            endpointTypes: [apigateway.EndpointType.REGIONAL],
            deployOptions: {
                throttlingRateLimit: 40,
                throttlingBurstLimit: 80,
            },
            ...overrides,
        });
    };
}
exports.RestApi = RestApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdEFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJlc3RBcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseURBQXlEO0FBSXpELFNBQWdCLE9BQU8sQ0FBQyxLQUFZLEVBQUUsWUFBb0I7SUFDekQsT0FBTyxDQUFDLE1BQXVCLEVBQUUsWUFBeUMsRUFBRSxFQUFFLEVBQUU7UUFDL0UsT0FBTyxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsWUFBWSxNQUFNLEVBQUU7WUFDakUsT0FBTyxFQUFFLE1BQU07WUFDZixhQUFhLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUNqRCxhQUFhLEVBQUU7Z0JBQ2QsbUJBQW1CLEVBQUUsRUFBRTtnQkFDdkIsb0JBQW9CLEVBQUUsRUFBRTthQUN4QjtZQUNELEdBQUcsU0FBUztTQUNaLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNILENBQUM7QUFaRCwwQkFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBMYW1iZGFSZXN0QXBpUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXN0QXBpKHN0YWNrOiBTdGFjaywgc2VydmljZV9uYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIChsYW1iZGE6IGxhbWJkYS5GdW5jdGlvbiwgb3ZlcnJpZGVzOiBQYXJ0aWFsPExhbWJkYVJlc3RBcGlQcm9wcz4gPSB7fSkgPT4ge1xuXHRcdHJldHVybiBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFSZXN0QXBpKHN0YWNrLCBgJHtzZXJ2aWNlX25hbWV9LWFwaWAsIHtcblx0XHRcdGhhbmRsZXI6IGxhbWJkYSxcblx0XHRcdGVuZHBvaW50VHlwZXM6IFthcGlnYXRld2F5LkVuZHBvaW50VHlwZS5SRUdJT05BTF0sXG5cdFx0XHRkZXBsb3lPcHRpb25zOiB7XG5cdFx0XHRcdHRocm90dGxpbmdSYXRlTGltaXQ6IDQwLFxuXHRcdFx0XHR0aHJvdHRsaW5nQnVyc3RMaW1pdDogODAsXG5cdFx0XHR9LFxuXHRcdFx0Li4ub3ZlcnJpZGVzLFxuXHRcdH0pO1xuXHR9O1xufVxuIl19