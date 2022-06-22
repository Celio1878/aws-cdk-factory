"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceVars = void 0;
const ssm = require("aws-cdk-lib/aws-ssm");
/**
 * Utilitary to add service variables to SSM.
 *
 * @see https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
 * @param stack
 * @param service_name
 * @returns
 */
function ServiceVars(stack, service_name) {
    const add_string_param = (name, value) => {
        new ssm.StringParameter(stack, parameter_id(name), {
            parameterName: parameter_name(service_name, name),
            stringValue: value,
        });
    };
    return {
        StringParam: add_string_param,
        /**
         * Add the endpoint of the api to SSM.
         * @param api
         */
        ApiUrl: (api) => {
            add_string_param("api", `${api.url}${service_name}`);
        },
    };
}
exports.ServiceVars = ServiceVars;
function parameter_id(id) {
    return id.replace(/ /g, "").replace(/-/g, "").replace(/_/g, "");
}
function parameter_name(service_name, parameter_name) {
    const name = `${service_name}_${parameter_name}`.trim().toUpperCase().replace(/-/g, "_");
    return `/output/${service_name}/${name}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZVZhcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTZXJ2aWNlVmFycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyQ0FBMkM7QUFFM0M7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxLQUFZLEVBQUUsWUFBb0I7SUFDN0QsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsRUFBRTtRQUN4RCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsRCxhQUFhLEVBQUUsY0FBYyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUM7WUFDakQsV0FBVyxFQUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsT0FBTztRQUNOLFdBQVcsRUFBRSxnQkFBZ0I7UUFDN0I7OztXQUdHO1FBQ0gsTUFBTSxFQUFFLENBQUMsR0FBNkIsRUFBRSxFQUFFO1lBQ3pDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDO0tBQ0QsQ0FBQztBQUNILENBQUM7QUFsQkQsa0NBa0JDO0FBRUQsU0FBUyxZQUFZLENBQUMsRUFBVTtJQUMvQixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsWUFBb0IsRUFBRSxjQUFzQjtJQUNuRSxNQUFNLElBQUksR0FBRyxHQUFHLFlBQVksSUFBSSxjQUFjLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXpGLE9BQU8sV0FBVyxZQUFZLElBQUksSUFBSSxFQUFFLENBQUM7QUFDMUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc3NtXCI7XG5cbi8qKlxuICogVXRpbGl0YXJ5IHRvIGFkZCBzZXJ2aWNlIHZhcmlhYmxlcyB0byBTU00uXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3lzdGVtcy1tYW5hZ2VyL2xhdGVzdC91c2VyZ3VpZGUvc3lzdGVtcy1tYW5hZ2VyLXBhcmFtZXRlci1zdG9yZS5odG1sXG4gKiBAcGFyYW0gc3RhY2tcbiAqIEBwYXJhbSBzZXJ2aWNlX25hbWVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTZXJ2aWNlVmFycyhzdGFjazogU3RhY2ssIHNlcnZpY2VfbmFtZTogc3RyaW5nKSB7XG5cdGNvbnN0IGFkZF9zdHJpbmdfcGFyYW0gPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSA9PiB7XG5cdFx0bmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssIHBhcmFtZXRlcl9pZChuYW1lKSwge1xuXHRcdFx0cGFyYW1ldGVyTmFtZTogcGFyYW1ldGVyX25hbWUoc2VydmljZV9uYW1lLCBuYW1lKSxcblx0XHRcdHN0cmluZ1ZhbHVlOiB2YWx1ZSxcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdFN0cmluZ1BhcmFtOiBhZGRfc3RyaW5nX3BhcmFtLFxuXHRcdC8qKlxuXHRcdCAqIEFkZCB0aGUgZW5kcG9pbnQgb2YgdGhlIGFwaSB0byBTU00uXG5cdFx0ICogQHBhcmFtIGFwaVxuXHRcdCAqL1xuXHRcdEFwaVVybDogKGFwaTogYXBpZ2F0ZXdheS5MYW1iZGFSZXN0QXBpKSA9PiB7XG5cdFx0XHRhZGRfc3RyaW5nX3BhcmFtKFwiYXBpXCIsIGAke2FwaS51cmx9JHtzZXJ2aWNlX25hbWV9YCk7XG5cdFx0fSxcblx0fTtcbn1cblxuZnVuY3Rpb24gcGFyYW1ldGVyX2lkKGlkOiBzdHJpbmcpIHtcblx0cmV0dXJuIGlkLnJlcGxhY2UoLyAvZywgXCJcIikucmVwbGFjZSgvLS9nLCBcIlwiKS5yZXBsYWNlKC9fL2csIFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJhbWV0ZXJfbmFtZShzZXJ2aWNlX25hbWU6IHN0cmluZywgcGFyYW1ldGVyX25hbWU6IHN0cmluZykge1xuXHRjb25zdCBuYW1lID0gYCR7c2VydmljZV9uYW1lfV8ke3BhcmFtZXRlcl9uYW1lfWAudHJpbSgpLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvLS9nLCBcIl9cIik7XG5cblx0cmV0dXJuIGAvb3V0cHV0LyR7c2VydmljZV9uYW1lfS8ke25hbWV9YDtcbn1cbiJdfQ==