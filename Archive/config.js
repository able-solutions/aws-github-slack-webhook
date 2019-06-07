module.exports = {
  kmsEncryptedHookUrl: process.env.KMSEncryptedHookURL, // encrypted slack webhook url
  unencryptedHookUrl: process.env.UnencryptedHookURL,    // unencrypted slack webhook url
  slackChannel: process.env.SlackChannel,                 // slack channel to send a message to
  slackUsername: process.env.SlackUsername,               // "AWS SNS via Lamda", // slack username to user for messages
  IconEmoji: process.env.IconEmoji,                      // slack emoji icon to use for messages
  orgIcon: process.env.OrgIcon,                           // url to icon for your organization for display in the footer of messages
  orgName: process.env.OrgName,                           // name of your organization for display in the footer of messages

/*services: {
    githubPushEvent: {
      // If the pusher key exists in the event data
      owner: ""
    },
    githubNewHook: {
      // If the hook_id exists in the event data
      content: "json"
    }
  }*/
};