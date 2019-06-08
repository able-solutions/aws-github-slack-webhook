# AWS Github --> Slack Posting via API Gateway Information

AWS CloudFormation template and Lambda Function that is designed to accept post requests to an API Gateway endpoint  that which then forward said request to a Lambda function which will post message data to a designated Slack channel

- Author: Craig Lewis

- Date Created: June 2019

## What will this repository achieve? 

The scripts and templates in this repostiry will mean that by the end of deploying following the instructions in this README, you will have a fully working and deployed API Gateway endpoint that can receive (to date) push, member and ping event data from Github and forward that event data to a AWS Lambda Function, where the data is parsed into a human readable slack post, deliverabled to a Slack channel specified within the Lambda function environmental variables and config file. The greater underlying resources this project will create are as follows: 

1. AWS CodePipline 

Created  from one of the CloudFormation templates, the CodePipeline will orchestrate the source checkout of code from Github and then trigger the CodeBuild project at required stages. 

2. AWS CodeBuild Project

Created by one of the CloudFormation templates. This build project will package and store the Lambda function in S3 before then deploying the core CloudFormation template(s) that create the Lambda function, API Gateway endpoint and all associated resources. 

3. CloudFormation Template(s)

ALl the AWS resources will be created using CloudFormation and written in JSON. CodePipeline will trigger CodeBuild to build from the CloudFormation templates during the CodePipeline build stage. 

4. S3 Buckets

    1. Pipeline Bucket - S3 Bucket to store the source code checked out form Github and all CloudFormation templates. 

    2. Project Bucket - S3 Bucket used to package and store Project specific files such as Lambda's

    3. CodeBuild Bucket - S3 bucket to store build artifacts and other associated files generated from the build process
    

5. Slack Lambda Function

Will post events sent from Github WebHook to designated Slack Channel

6. Lambda IAM Role

IAM Role with relevant permissions, Lambda function requires

7. CodePipeline IAM Role

IAM Role with relevant permissions that CodePipeline requires

8. CodeBuild IAM Role

IAM Role with relevant permissions that CodeBuild requires

9. API Gateway IAM Role

IAM role with relevant permissions for API endpoint to invoke Lambda Function integration configured. 

10. API Gateway RESTApi

API Endpoint that Github will make POST requests to. This POST requests will then be proxied to the Lambda Function

## Prerequisites

Listed here are all the prerequisites that you require in order to deploy this "out of the box" solution that will enable real time event posts from Github to Slack via your AWS Account. These prerequisites are: 

  1. Create a Github OAuth Token here that CodePipeline will use for authentication [here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

  2. Create a designated Slack Channel (if you do not have one already) [here](https://get.slack.help/hc/en-us/articles/201402297-Create-a-channel).

  3. Create a Slack Channel Webhook [here](https://get.slack.help/hc/en-gb/articles/115005265063-Incoming-webhooks-for-Slack).

## Deployment Instructions