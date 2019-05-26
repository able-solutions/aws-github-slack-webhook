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
  
  //Get Branch Details
  const branch = (event.ref).split('/')[2];
  
  //Check for Commit Event
  if (event.hasOwnProperty('commits')) {
    eventType = "New Commit Detected";
    const commits = event.commits[0];
    const commitMessage = commits.message;
    const committer = commits.committer.name;
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
            { "title": `Date & Time of Commit`, "value": `${timestamp}`, "short": false },
            { "title": `Branch`, "value": `${branch}`, "short": true },
            { "title": `Committed By`, "value": `${committer}`, "short": true },
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
  
};