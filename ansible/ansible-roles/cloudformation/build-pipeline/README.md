build pipeline
=========

This role uses CodePipeline and iscreated via CloudFormation. The CloudFormation creates the CodepPieline, CodeBuild etc, lambda, and apigw.
For the CloudFormation to work we need to create an OAuth Token in the main GitHub account settings. It is known as creating an Application Registration.

Naviation in GitHub: Settings/Developer settings/Personal access tokens.

__repo__
- repo:status  Access commit status
- repo_deployment  Access deployment status

__admin:repo_hook__
 - write:repo_hook  Write repository hooks
 - read:repo_hook  Read repository hooks

__Note:__ The Personal Access Token is not knowm and cannot be used because the repo is in Able, not SiliconMaze. For now, I will need duplicate this code, so I can test different scenarios until I have access to Able Admin.


Requirements
------------

Any pre-requisites that may not be covered by Ansible itself or the role should be mentioned here. For instance, if the role uses the EC2 module, it may be a good idea to mention in this section that the boto package is required.

Role Variables
--------------

A description of the settable variables for this role should go here, including any variables that are in defaults/main.yml, vars/main.yml, and any variables that can/should be set via parameters to the role. Any variables that are read from other roles and/or the global scope (ie. hostvars, group vars, etc.) should be mentioned here as well.

Dependencies
------------

A list of other roles hosted on Galaxy should go here, plus any details in regards to parameters that may need to be set for other roles, or variables that are used from other roles.

Example Playbook
----------------

Create the stack:

ansible-playbook delete-pipeline.yml -vvvv

Delete the stack

ansible-playbook create-pipeline.yml -vvvv

__Note:__ -vvvv is full trace mode for ansible.

License
-------

BSD

Author Information
------------------

An optional section for the role authors to include contact information, or a website (HTML is not allowed).
