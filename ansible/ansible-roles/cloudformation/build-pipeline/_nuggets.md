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
UnencryptedHookURL	https://hooks.slack.com/services/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	-
codePipelineBucket	able710-buildbucket

====

https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#structure-configuration-examples

====

Storing a public access token in ansible as a var and used in the ansible CloudFormation plugin, means that the token is stored in the code, and I think git hub removes this token immediately if it detects it in a commit. It will work on the stack creation, but subsequent calls it will fail.

Solution: Use AWS secrets manager to store the github personal access token.

https://medium.com/@eoins/securing-github-tokens-in-a-serverless-codepipeline-dc3a24ddc356
