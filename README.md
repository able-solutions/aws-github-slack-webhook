# aws-apigateway-slackpost

AWS CloudFormation template and Lambda Function that is designed to accept post requests to an API Gateway endpoint  that which then forward said request to a Lambda function which will post message data to a designated Slack channel

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

x

6. Lambda IAM Role

x

7. CodePipeline IAM Role

x

8. CodeBuild IAM Role

x

9. API Gateway IAM Role

x

10. API Gateway RESTApi

x

11. API Gateway Deployment 

x

12. Lambda Permission

x

13. CloudWatch Logs

x

### Updates

This updates section will keep you informed of the progress made on this project:

* 12/06

The nodejs code for the lambda is complete. This Lambda can receive Push, Member and Ping events from github via API Gateway endpoints and reformat them into slack posts. Test payload files for each Push, Member and Ping event have been created also. The config file that the Lambda pulls in, using environmental variables to help customise the slack posts is also complete. 

Whats Next? - Work has been started on the CloudFormation template that will create the Lambda function, API Gateway, IAM roles,Lambda permissions. However, since scripting the CF template, work has turned towards creating a CodePipeline first. The plan is to code a full codepipeline that sources the Github repo, zips up all lambda files and then deploys the CF  templates that create all the AWS resources, making this a complete "Out of the Box" solution

* 20/06 @ 7:50pm

Successfully deployed the codepipeline.template into CloudFormation manually. This template creates all the SSM parameters that the Slack Lambda will use as its environmental variables. The Codepipeline will create two stages. The first stage will source checkout all the code from the Github repository. The second stage will hopefully deploy the cloudformation.template. Now that CodePipeline is deployed.... We need to test and make sure the cloudfomration.template builds successfully.

* 20/06 @ 8:00pm

The codepipeline works!!! Now on any new push and code change within the repository, the codepipeline detects this and triggers the two stages scripted. The cloudformation.template codepipeline tried to deploy failed as the Lambda function could not reference the correct artifact file that contains the slack.js script.

#### Prerequisites

Listed here are all the prerequisites that you require in order to deploy this "out of the box" solution that will enable real time event posts from Github to Slack via your AWS Account. These prerequisites are: 

1. AWS Account

2. Github Account with test repository created

3. OAuth Token - Create an OAuth token in GitHub and provide access to the admin:repo_hook and repo scopes.


##### Instructions

Instructions are to follow so watch this space! May even get some fancy input from Leah :)

