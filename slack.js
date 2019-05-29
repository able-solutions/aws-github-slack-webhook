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

exports.handler = async (event, context, callback) => {

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Lambda has successfully executed',
      input: event,
    }),
  };
  
  const errorResponse = {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Bad request Dude',
    }),
  };
  
  //console.log(JSON.stringify(event));
  const githubEvent = event.headers['X-GitHub-Event'];
  const rawBody = JSON.parse(event.body);
  const body = JSON.stringify(rawBody);
  console.log(githubEvent);
  console.log(body);
  
  if (githubEvent === 'push') {
    eventType = "New Push Detected";
    let branch = (rawBody.ref).split('/')[2];
    const commits = rawBody.commits[0];
    const commitMessage = commits.message;
    const committer = commits.committer.name;
    const repository = rawBody.repository.name;
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
      
      callback(null, response);

    } catch(e) {

      console.error(e);
      
      callback(null, errorResponse);

    }
    
  } else if (githubEvent === 'ping') {
    let action = rawBody.hook.active;
    eventType = `Web Hook ${action}`;
    const zen = rawBody.zen;
    let timestamp = moment(rawBody.hook.updated_at).format('llll');
    const repository = rawBody.repository.name;
    const repoLink = rawBody.repository.html_url;
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
    
    console.log(slackHookMessage);

    try {

      await postMessage(slackHookMessage);
      
      callback(null, response);

    } catch(e) {

      console.error(e);
      
      callback(null, errorResponse);

    }
  } else if (rawBody.hasOwnProperty('comment')) {
    eventType = "New Comment Detected";
    let timestamp = moment(rawBody.comment.created_at).format('llll');
    const commentLink = rawBody.comment.html_url;
    const comment = rawBody.comment.body;
    const repository = rawBody.repository.name;
    const issue = rawBody.issue.title;
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
      
      callback(null, response);

    } catch(e) {

      console.error(e);
      
      callback(null, errorResponse);

    }
  } else if (rawBody.ref_type === 'branch') {
    eventType = "Branch Changes Detected";
    let branch = rawBody.ref;
    let timestamp = moment(rawBody.repository.created_at).format('llll');
    const repository = rawBody.repository.name;
    const createLink = `${rawBody.repository.html_url}/tree/${branch}`;
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
            { "title": "Date & Time of Event", "value": `${timestamp}`, "short": false },
            { "title": `Repository`, "value": `${repository}`, "short": true },
            { "title": `Branch Name`, "value": `${branch}`, "short": true },
            { "title": `Link`, "value": `${createLink}`, "short": false }
          ]
        }
      ]
    };

    try {

      await postMessage(slackCreateMessage);
      
      callback(null, response);

    } catch(e) {

      console.error(e);

    }
  } else {
    
    console.log('No events detected...');
    
    callback(null, response);
    
  }
  
};