# API Gateway & Lambda Integration Testing

Error seen in Log Group for API Gateway

```json
(8d95939b-9abc-11e9-9737-6faf576ecdf9) Endpoint response body before transformations:
{
    "errorType": "TypeError",
    "errorMessage": "Cannot read property 'X-GitHub-Event' of undefined",
    "trace": [
        "TypeError: Cannot read property 'X-GitHub-Event' of undefined",
        "    at Runtime.exports.handler (/var/task/slack.js:69:36)",
        "    at Runtime.handleOnce (/var/runtime/Runtime.js:63:25)",
        "    at process._tickCallback (internal/process/next_tick.js:68:7)"
    ]
}
````

This was solved by adding

 ```yaml
 IntegrationHttpMethod: POST
        PassthroughBehavior: WHEN_NO_MATCH
```

and removing

```yaml
         IntegrationResponses:
          - StatusCode: 200
```

Note: On a new API GW deployment, I need to turn on logs manually, this needs to be added to the CF
