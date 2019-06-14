# api-alerter

This is an Ansible role to create or delete the api-alrter stack. It will even purge versioned buckets that contain the CloudTrail logs of an existing stack

## Example Playbook(s)

Including an example of how to use your role (for instance, with variables passed in as parameters) is always nice for users too:

## Deleting the stack

```yml
---
- hosts: localhost
  vars:
    stack_action: "create"
    
  roles:
    - api-alerter
```

This would be called using the following syntax

```bash
ansible-playbook create-api-alerter.yml
```

## Deleting the stack

```yml
---
- hosts: localhost
  vars:
    stack_action: "delete"
    
  roles:
    - api-alerter
```

This would be called using the following syntax

```bash
ansible-playbook delete-api-alerter.yml
```