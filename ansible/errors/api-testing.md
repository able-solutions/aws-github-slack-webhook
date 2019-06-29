## APi Gateway Testing


First test we see...


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

