'use-strict';

const AWS = require('aws-sdk');
const https = require('https');
const moment = require('moment');

//Github Event Global Variables
let eventType = "Github Event Type Not Known";
let timestamp = "";

//Global Slack Variables
var slackHook = process.env.SlackHook;
var slackUsername = process.env.SlackUsername;
var slackChannel = process.env.SlackChannel;
var emoji = process.env.IconEmoji;
let color = "#778899";

//POST Function
var postMessage = async function(slackMessage, callback) {
  return new Promise((resolve, reject) => {
    var body = JSON.stringify(slackMessage);
    var options = {
      hostname: 'hooks.slack.com',
      path: slackHook,
      method: 'POST',
    };

    var postReq = https.request(options, function(res) {
        var chunks = [];
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            return chunks.push(chunk);
        });
        res.on('end', function() {
        var body = chunks.join('');
            if (callback) {
                callback({
                    body: body,
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage
                });
            }
        });
        resolve(res);
    });
    postReq.write(body);
    postReq.end();
  });  
};

exports.handler = async (event, context) => {
  
  const payload = JSON.stringify(event);
  console.log(payload);
  
  if (event.hasOwnProperty('commits')) {
    eventType = "New Commit Detected";
    let branch = (event.ref).split('/')[2];
    const commits = event.commits[0];
    const commitMessage = commits.message;
    const committer = commits.committer.name;
    const repository = event.repository.name;
    const added = commits.added;
    const removed = commits.removed;
    const modified = commits.modified;
    const commitLink = commits.url;
    let timestamp = moment(commits.timestamp).format('llll');
    
    //Commit Slack Message
    var slackCommitMessage = {
      channel: slackChannel,
      username: slackUsername,
      icon_emoji: emoji,
      attachments: [
        {
          "color": color,
          "author_name": eventType
        },
        {
          "color": color,
          "fields": [
            { "title": `Date & Time of Commit`, "value": `${timestamp}`, "short": true },
            { "title": `Committed By`, "value": `${committer}`, "short": true },
            { "title": `Repository`, "value": `${repository}`, "short": true },
            { "title": `Branch`, "value": `${branch}`, "short": true },
            { "title": `Commit Message`, "value": `${commitMessage}`, "short": false },
            { "title": `Added`, "value": `${added}`, "short": false },
            { "title": `Removed`, "value": `${removed}`, "short": false },
            { "title": `Modified`, "value": `${modified}`, "short": false }
          ]
        },
        {
          "color": color,
          "title": "Link to Commit",
          "footer": commitLink
        }
      ]
    };

    try {

      await postMessage(slackCommitMessage);

    } catch(e) {

      console.error(e);

    }
    
  }
  
  if (event.hasOwnProperty('hook')) {
    eventType = "New Web Hook Created";
    const zen = event.zen;
    let timestamp = moment(event.hook.created_at).format('llll');
    const repository = event.repository.name;
    const repoLink = event.repository.html_url;
    let color = "#F7EF00";
    
    //Hook Slack Message
    var slackHookMessage = {
      channel: slackChannel,
      username: slackUsername,
      icon_emoji: emoji,
      attachments: [
        {
          "color": color,
          "author_name": eventType
        },
        {
          "color": color,
          "fields": [
            { "title": `Date & Time Hook Created`, "value": `${timestamp}`, "short": false },
            { "title": `Zen Message of the Day`, "value": `${zen}`, "short": false },
            { "title": `Repository`, "value": `${repository}`, "short": true },
            { "title": `Repository Link`, "value": `${repoLink}`, "short": false }
          ]
        }
      ]
    };

    try {

      await postMessage(slackHookMessage);

    } catch(e) {

      console.error(e);

    }
  }
  
  if (event.hasOwnProperty('comment')) {
    eventType = "New Comment Detected";
    let timestamp = moment(event.comment.created_at).format('llll');
    const commentLink = event.comment.html_url;
    const comment = event.comment.body;
    const repository = event.repository.name;
    const issue = event.issue.title;
    let color = "#FF8C00";
    
    //Comment Slack Message
    var slackCommentMessage = {
      channel: slackChannel,
      username: slackUsername,
      icon_emoji: emoji,
      attachments: [
        {
          "color": color,
          "author_name": eventType
        },
        {
          "color": color,
          "fields": [
            { "title": `Date & Time Comment Made`, "value": `${timestamp}`, "short": true },
            { "title": `Repository`, "value": `${repository}`, "short": true },
            { "title": `Issue`, "value": `${issue}`, "short": false },
            { "title": `Comment`, "value": `${comment}`, "short": false },
            { "title": `Comment Link`, "value": `${commentLink}`, "short": false }
          ]
        }
      ]
    };

    try {

      await postMessage(slackCommentMessage);

    } catch(e) {

      console.error(e);

    }
  }
  
  if (event.ref_type === 'branch') {
    eventType = "New Branch Created";
    let branch = event.ref;
    let timestamp = moment(event.repository.created_at).format('llll');
    const repository = event.repository.name;
    const createLink = `${event.repository.html_url}/tree/${branch}`;
    let color = "#FF8C00";
    
    //Create Slack Message
    var slackCreateMessage = {
      channel: slackChannel,
      username: slackUsername,
      icon_emoji: emoji,
      attachments: [
        {
          "color": color,
          "author_name": eventType
        },
        {
          "color": color,
          "fields": [
            { "title": "Date & Time Created", "value": `${timestamp}`, "short": false },
            { "title": `Repository`, "value": `${repository}`, "short": true },
            { "title": `New Branch Name`, "value": `${branch}`, "short": true },
            { "title": `Link`, "value": `${createLink}`, "short": false }
          ]
        }
      ]
    };

    try {

      await postMessage(slackCreateMessage);

    } catch(e) {

      console.error(e);

    }
  }
  
};