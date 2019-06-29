# AWS Github --> Slack Posting via API Gateway Information

AWS CloudFormation template and Lambda Function that is designed to accept post requests to an API Gateway endpoint  that which then forward said request to a Lambda function which will post message data to a designated Slack channel

- Author: Steve Robinson

- Date Created: 29 June 2019

## What  this repository achieve

The scripts and templates in this repository will mean that by the end of deploying following the instructions in this README, you will have a fully working and deployed API Gateway endpoint that can receive (to date) push, member and ping event data from Github and forward that event data to a AWS Lambda Function, where the data is parsed into a human readable slack post, delivered to a Slack channel specified within the Lambda function environmental variables and config file. The greater underlying resources this project will create are as follows:

1. AWS CodePipeline
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
API Endpoint that Github will make POST requests to. This POST requests will then proxy to the Lambda Function

## Prerequisites

Listed here are all the prerequisites that you require in order to deploy this "out of the box" solution that will enable real time event posts from Github to Slack via your AWS Account. These prerequisites are:

1. Create a designated Slack Channel for example: #repo_alerts (if you do not have one already) [here](https://get.slack.help/hc/en-us/articles/201402297-Create-a-channel).

2. Create an incoming Web-hook [here](https://get.slack.help/hc/en-gb/articles/115005265063-Incoming-webhooks-for-Slack).

  ```text
  Essentially you add an app, and search for web-hook app, then you assign a channel.
  
  Navigation steps in slack workspace online as of June 2019: 
  
  workspace settings/custom app/custom integrations

  for example here is a  link to online slack workspace admin settings for a custom integration.
  
  ```https://siliconmaze.slack.com/apps/manage/custom-integrations```

3. Create a Github OAuth Token here that github will use for authentication [here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

```text
Essentially in GitHub, we create an oauth integration within my  trigger_repo for testing

In my example, I used the SiliconMaze (steve@cloudy.dog) GitHub Account. Initially.

Note:  This web-hook does not use a secret, so someone could end up spiking the API Gateway if they figured out the API end point URL. 
```

## Development/Testing Instructions

In my initial development of IAC using Ansible, I elected to build out Lambda first which allowed testing of the Lambda->Slack integration, once this was working using appropriate tests (see testing examples), I as then able to integrate git hub with the api gateway POST URL

The URL is located in the stage for the API for example

```https://<unique_key>.execute-api.eu-west-2.amazonaws.com/slack/APIEndpoint```

I also created a private github repo, that allows me to test git commit web-hooks by making commits.

```git@github.com:siliconmaze/trigger-repo.git```

## Deployment Instructions

Lambda must have these environment variables for example...


SlackUsername = steve
SlackHook = ```https://hooks.slack.com/services/<unique_key>```
SlackChannel = #repo_alerts
IconEmoji = :github:

Note: Slac uses standard emojis from 

```https://www.webfx.com/tools/emoji-cheat-sheet/```

For my resting, I have created a custom emoji in siliconmaze workspace and I used the following unofficial emoji site:

```https://slackmojis.com/```

 and customised the workspace to add a the ```:github:``` and upload the icon

### Ansible and CloudFormation

navigate to ```<repo_root>/ansible/ansible-roles``` and then run appropriate plays

-vvvv is the ansible debug ie full trace

Create Lambda Function:

```ansible-playbook create-slack-alerter.yml -vvvv```

Create API Gateway to handle the POST action/integration

```ansible-playbook create-api-gateway.yml  -vvvv```


How to remove:

```ansible-playbook delete-api-gateway.yml  -vvvv```

```ansible-playbook delete-slack-alerter.yml -vvvv```

## To Do

I need to add a secret to the web-hook to stop spamming of the API gateway

