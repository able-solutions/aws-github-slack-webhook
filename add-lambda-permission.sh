#!/bin/bash

aws lambda add-permission --function-name Slack-APIGateway-LambdaSlackFunction-1UC2TJEBLSR02 \
--statement-id apigateway-github --action lambda:InvokeFunction \
--principal apigateway.amazonaws.com \
--source-arn "arn:aws:execute-api:eu-west-1:823785814768:zu69u0o2p3/*/POST/github"