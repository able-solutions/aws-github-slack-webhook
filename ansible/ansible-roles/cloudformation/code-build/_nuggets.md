# CodeBuild Nuggets

## References

https://docs.aws.amazon.com/codebuild/latest/userguide/sample-github-pull-request.html
https://raw.githubusercontent.com/aws-samples/aws-codebuild-samples/master/cloudformation/continuous-deployment.yml
https://docs.aws.amazon.com/codebuild/latest/userguide/sample-github-pull-request.html#sample-github-pull-request-filter-webhook-events-cfn
https://github.com/awsdocs/aws-cloudformation-user-guide/blob/master/doc_source/aws-resource-codebuild-project.md

Alot of the information here was to log my experience with using CF to create CodeBuild. I learned a lot, and I am very happy with the results.

```bash
Error on cloudformation
{
            "last_updated_time": "2019-07-06T21:03:26.687000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Property validation failure: [Encountered unsupported properties in {/}: [FilterGroups]]"
        },
```

Current yaml

```yaml
        FilterGroups:
          - - Type: EVENT
              Pattern: PUSH
            - Type: HEAD_REF
              Pattern: !Ref GithubBranch
```


Correct yaml

```yaml

Triggers:
          Webhook: true
          FilterGroups:
            - - Type: EVENT
                Pattern: PUSH
              - Type: HEAD_REF
                Pattern: !Join
                  - ''
                  - - '^refs/heads/'
                    - !Ref GithubBranch
                    - '$'
            - - Type: EVENT
                Pattern: PUSH
              - Type: BASE_REF
                Pattern: ^refs/heads/master$
                ExcludeMatchedPattern: true
```

====

Error

```bash

            "last_updated_time": "2019-07-06T21:25:14.058000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Invalid project source: source location must be a valid GitHub repository URL (Service: AWSCodeBuild; Status Code: 400; Error Code: InvalidInputException; Request ID: 8a92f17b-a034-11e9-9fbf-e37a382d9189)"
        },
```

Example Code Build Yaml

```yaml
CodeBuildProject:
    Type: AWS::CodeBuild::Project
    Properties:
      Artifacts:
        Type: NO_ARTIFACTS
      Environment:
        ComputeType: "BUILD_GENERAL1_SMALL"
        Image: "aws/codebuild/docker:18.09.0"
        Type: LINUX_CONTAINER
      ServiceRole: !GetAtt CodeBuildRole.Arn
      Source:
        Type: GITHUB
        Location: "https://github.com/ORG/REPO.git"
        BuildSpec: "codebuild/create_docker_image.yml"
      Triggers:
        Webhook: true
        FilterGroups:
          - - Type: EVENT
              Pattern: PUSH
            - Type: HEAD_REF
              Pattern: master
```



https://github.com/able-solutions/aws-github-slack-webhook


```bash
No Access token found, please visit AWS CodeBuild console to connect to GitHub (Service: AWSCodeBuild; Status Code: 400; Error Code: InvalidInputException; Request ID: 0f6dcbba-a037-11e9-8f49-57b043411e5a)
```

LOL, it seems that currently code build cannot connect to git hub, unless an OAuth is created in the console.

https://docs.aws.amazon.com/codebuild/latest/userguide/sample-access-tokens.html
https://github.com/stelligent/pipeline-dashboard/blob/master/codebuild.yml


Add ...
Resource: !Ref GitHubToken


```yaml
source:
        Auth: 
          !If
          - HasGitHubToken
          - Type: OAUTH
            Resource: !Ref GitHubToken
          - !Ref AWS::NoValue
        Type: GITHUB
        Location: !Ref GitHubRepo
      # should be true, but webhook from CFN was failing?!
      #Triggers:
      #  Webhook: true 
      Artifacts:
        Type: NO_ARTIFACTS
```

```json
{
            "last_updated_time": "2019-07-06T22:05:39.295000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Property validation failure: [Value of property {/Source/Auth} does not match type {Object}]"
        },
```

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html

I am going to try an ssm parameter

```yaml
Auth:
            Type: OAUTH
            Resource: !Ref GithubPersonalAccessTokenSSMParameterName
```

```yaml
GithubPersonalAccessTokenSSMParameterName: 
    Type: 'AWS::SSM::Parameter::Value<String>'
    Description: Enter the name of the ssm parameter which holds the required personal access token.
```

Same error:
```json
{
            "last_updated_time": "2019-07-06T22:31:31.307000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "No Access token found, please visit AWS CodeBuild console to connect to GitHub (Service: AWSCodeBuild; Status Code: 400; Error Code: InvalidInputException; Request ID: cd3d0c49-a03d-11e9-bce8-f77cd7262b22)"
        },
```

The docs clearly state:

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html#cfn-codebuild-project-source-auth

```text
Auth
Information about the authorization settings for AWS CodeBuild to access the source code to be built.

This information is for the AWS CodeBuild console's use only. Your code should not get or set Auth directly.

Required: No

Type: SourceAuth

Update requires: No interruption
```

I am going to remove the auth section, and see if I can manually auth after the project is created!

====
Errors regarding webhook for github,,
```json
{
            "last_updated_time": "2019-07-06T22:53:30.500000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "slack-app-codebuild",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Failed to call CreateWebhook, reason: The following filter types are not allowed for GitHub webhook when EVENT is [PUSH]: [BASE_REF]. Make sure input filter types are supported by all the EVENT types specified. (Service: AWSCodeBuild; Status Code: 400; Error Code: InvalidInputException; Request ID: df5d1003-a040-11e9-9fbf-e37a382d9189)"
        },
```



```yaml
FilterGroups:
            - - Type: EVENT
                Pattern: PUSH
              - Type: BASE_REF
                Pattern: !Join
                  - ''
                  - - '^refs/heads/'
                    - !Ref 'GithubBranch'
                    - '$'
            - - Type: EVENT
                Pattern: PUSH
              - Type: BASE_REF
                Pattern: ^refs/heads/master$
                ExcludeMatchedPattern: true
```

```json
                {
            "last_updated_time": "2019-07-06T23:04:44.327000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "slack-app-codebuild",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Failed to call CreateWebhook, reason: The following filter types are not allowed for GitHub webhook when EVENT is [PUSH]: [BASE_REF]. Make sure input filter types are supported by all the EVENT types specified. (Service: AWSCodeBuild; Status Code: 400; Error Code: InvalidInputException; Request ID: 7123ad50-a042-11e9-8f49-57b043411e5a)"
        },
```

```yaml
FilterGroups:
            - - Type: EVENT
                Pattern: PUSH
```        



```json
{
            "last_updated_time": "2019-07-06T23:11:01.223000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "slack-app-codebuild",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Failed to call CreateWebhook, reason: Could not find access token for server type github (Service: AWSCodeBuild; Status Code: 400; Error Code: ResourceNotFoundException; Request ID: 51c049e9-a043-11e9-bca2-cf8e339f9a39)"
        },
```

It is a permissions issue....I am going to add a new token and give better access

Under Select scopes, select admin:repo_hook and repo to gve more access...


{
            "last_updated_time": "2019-07-06T23:26:47.208000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "slack-app-codebuild",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Failed to call CreateWebhook, reason: Could not find access token for server type github (Service: AWSCodeBuild; Status Code: 400; Error Code: ResourceNotFoundException; Request ID: 85ac7474-a045-11e9-a3a0-7d537243cb14)"
        },


now a different message of failed to CreatWebHook, changed to this yaml

```yaml

Source:
          Type: GITHUB
 ## used only by the console, this is not valid CloudFormation and it cannot yet configure an OAuth/Personal Access Token for GitHub, but CodePipeline can.
          Auth:
            Type: OAUTH
            Resource: !Ref 'GithubPersonalAccessTokenSSMParameterName'
          #https://github.com/able-solutions/aws-github-slack-webhook
          Location: !Join
            - ''
            - - 'https://github.com/'
              - !Ref 'GithubUser'
              - '/'
              - !Ref 'GithubRepoName'
          BuildSpec: 'ansible/ansible-roles/cloudformation/build-pipeline/files/buildspecs/lambda-buildspec.yml'
        SourceVersion: !Ref 'GithubBranch'
        Triggers:
          Webhook: true
          FilterGroups:
            - - Type: EVENT
                Pattern: PUSH
```



{
            "last_updated_time": "2019-07-06T23:29:56.146000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "No Access token found, please visit AWS CodeBuild console to connect to GitHub (Service: AWSCodeBuild; Status Code: 400; Error Code: InvalidInputException; Request ID: f65390fb-a045-11e9-9f54-1d6f406104ea)"
        },

```yaml
Location: !Join
            - ''
            - - 'https://github.com/'
              - !Ref 'GithubUser'
              - '/'
              - !Ref 'GithubRepoName'
```


chnaged to 


```yaml
Location: !Join
            - ''
            - - 'https://github.com/'
              - !Ref 'GithubUser'
              - '/'
              - !Ref 'GithubRepoName'
              - '.git'
```

error

```json
{
            "last_updated_time": "2019-07-06T23:47:04.813000+00:00",
            "logical_resource_id": "CodeBuildProject",
            "physical_resource_id": "slack-app-codebuild",
            "resource_type": "AWS::CodeBuild::Project",
            "status": "CREATE_FAILED",
            "status_reason": "Failed to call CreateWebhook, reason: Cannot specify filter groups when webhook is disabled. (Service: null; Status Code: 400; Error Code: null; Request ID: null)"
        },
```

Adding back webhook....

We are all now cool, I was wrong , we can add github to CodeBuild via cloudformation, so the docs still require updating!



=====

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-source.html

the docs say...

For source code in a GitHub repository, the HTTPS clone URL to the repository that contains the source and the build spec. You must connect your AWS account to your GitHub account. Use the AWS CodeBuild console to start creating a build project. When you use the console to connect (or reconnect) with GitHub, on the GitHub Authorize application page, for Organization access, choose Request access next to each repository you want to allow AWS CodeBuild to have access to, and then choose Authorize application. (After you have connected to your GitHub account, you do not need to finish creating the build project. You can leave the AWS CodeBuild console.) To instruct AWS CodeBuild to use this connection, in the source object, set the auth object's type value to OAUTH.

I am  going to try with no webhook.