# Nuggets

Links and Ideas for Deploying Lambda using CodePipeline

https://docs.aws.amazon.com/lambda/latest/dg/build-pipeline.html

====

Example CF Stack create by Able Solution's last deployment of the stack.

APIEndpoint	github	-
Branch	master	-
GitHubToken	****	-
GitHubUser	Able710	-
IconEmoji	:github:	-
OrgIcon	http://cloudy.dog/images/logo.png	-
OrgName	Able Cloudy Dog	-
Repo	aws-apigateway-slackpost	-
SlackChannel	#repo_alerts	-
SlackUsername	Github via AWS	-
StackActionMode	CREATE_UPDATE	-
StackName	Slack-APIGateway	-
UnencryptedHookURL	****	-
codePipelineBucket	able710-buildbucket

====

https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#structure-configuration-examples

====

Storing a public access token in ansible as a var and used in the ansible CloudFormation plugin, means that the token is stored in the code, and I think git hub removes this token immediately if it detects it in a commit. It will work on the stack creation, but subsequent calls it will fail.

Solution: Use AWS secrets manager to store the github personal access token.

https://medium.com/@eoins/securing-github-tokens-in-a-serverless-codepipeline-dc3a24ddc356

====

Complex  codepipeline including codebuild exmample.

https://github.com/aws-samples/codepipeline-nested-cfn/blob/master/codepipeline-cfn-codebuild.yml

====

For my first effort, I am going to add a stage to pipeline that will build out a lambda function from source.


Project name – lambda-pipeline-build

Operating system – Ubuntu

Runtime – Standard

Runtime version – aws/codebuild/standard:2.0

Image version – Latest

Buildspec name – buildspec.yml

====

These are all documents that I referenced..


https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html

https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#runtime-versions-buildspec-file

https://github.com/aws-samples/aws-codebuild-samples/blob/master/cloudformation/continuous-deployment.yml



====

Issue when deleting a stack that was created by pipeline, but pipeline has been deleted.

https://dev.to/david_j_eddy/how-to-fix-failed-to-delete-stack-role--is-invalid-or-cannot-be-assumed-in-aws-cloudformation-3aip


Adding ectra details via Environment Variables for code build
https://github.com/thii/aws-codebuild-extras

