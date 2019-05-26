var AWS = require('aws-sdk');
var url = require('url');
var https = require('https');
var config = require('../config');
var _ = require('lodash');
var moment = require('moment');
var hookUrl;

var baseSlackMessage = {
  channel: config.slackChannel,
  username: config.slackUsername,
  IconEmoji: config.IconEmoji,
  attachments: [
    {
      "footer": "Powered by " + config.orgName,
      "footer_icon": config.orgIcon
    }
  ]
};

var postMessage = function(message, callback) {
  var body = JSON.stringify(message);
  var options = url.parse(hookUrl);
  options.method = 'POST';
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
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
    return res;
  });

  postReq.write(body);
  postReq.end();
};

var handleGithubPushEvent = function(event) {
  var message = event.commits[0].message;
  var pushed_at = event.commits.pushed_at;
  var time = moment(pushed_at).format("HH:mm:ss A");
  var date = moment(pushed_at).format('Do MMMM YYYY');
  var repository = event.repository;
  var reponame = repository.name;
  var committer = event.commits[0].committer.name;
  var commit_url = event.head_commit.url;
  var repourl = repository.url;
  var cloneurl = repository.ssh_url;
  var subject = "New Commit pushed to Github Repository";
  var eventmessage = "New Push Detected!";
  var color = "#2E86C1";

  var slackMessage = {
    text: "*" + subject + "*",
    attachments: [
      {
        "color": color,
        "fields": [
          { "title": "Event", "value": eventmessage, "short": true },
          { "title": "Repository Name:", "value": reponame, "short": false},
          { "title": "Time Pushed:", "value": time + " (UTC)", "short": true },
          { "title": "Date Pushed:", "value": date, "short": true },
          { "title": "Latest Commit:", "value": message, "short": false },
          { "title": "Committed By:", "value": committer, "short": false },
          { "title": "Link to all Commits:", "value": commit_url, "short": false },
          { "title": "Link to Repository", "value": repourl, "short": false },
          { "title": "Clone Repository:", "value": "git clone " + cloneurl, "short": false }
        ]
      }
    ]
  };
  return _.merge(slackMessage, baseSlackMessage);
};

var handleGithubNewHook = function(event, context) {
  var zen = event.zen;
  var reponame = event.repository.name;
  var timestamp = event.hook.created_at;
  var time = moment(timestamp).format("HH:mm:ss A");
  var date = moment(timestamp).format('Do MMMM YYYY');
  var endpoint = event.hook.config.url;
  var repourl = event.repository.html_url;
  var cloneurl = event.repository.ssh_url;
  var subject = "New GitHub WebHook Created";
  var eventmessage = "Github WebHook Detected!";
  var color = "#F7EF00";

  var slackMessage = {
    text: "*" + subject + "*",
    attachments: [
      {
        "color": color,
        "fields": [
          { "title": "Event", "value": eventmessage, "short": true },
          { "title": "WebHook Created for Repository:", "value": reponame, "short": false},
          { "title": "Time:", "value": time + " (UTC)", "short": true },
          { "title": "Date:", "value": date, "short": true },
          { "title": "Zen Message of the Day:", "value": zen, "short": false },
          { "title": "Hook Endpoint:", "value": endpoint, "short": false },
          { "title": "Link to Repository", "value": repourl, "short": false },
          { "title": "Clone Repository:", "value": "git clone " + cloneurl, "short": false }
        ]
      }
    ]
  };
  return _.merge(slackMessage, baseSlackMessage);
};

var handleGithubNewCollobrator = function(event, context) {
  var member = event.member.login;
  var action = event.action;
  var reponame = event.repository.name;
  var timestamp = event.repository.created_at;
  var time = moment(timestamp).format("HH:mm:ss A");
  var date = moment(timestamp).format('Do MMMM YYYY');
  var adder = event.sender.login;
  var repourl = event.repository.html_url;
  var cloneurl = event.repository.ssh_url;
  var subject = "Collaborator status changed for Repository";
  var eventmessage = "Collaborator Changes Detected!";
  var color = "#1AD502";

  var slackMessage = {
    text: "*" + subject + "*",
    attachments: [
      {
        "color": color,
        "fields": [
          { "title": "Event", "value": eventmessage, "short": true },
          { "title": "Time:", "value": time + " (UTC)", "short": true },
          { "title": "Date:", "value": date, "short": true },
          { "title": "Message:", "value": `${member} has been ${action} to the ${reponame} repository by ${adder}.`, "short": false },
          { "title": "Link to Repository", "value": repourl, "short": false },
          { "title": "Clone Repository:", "value": "git clone " + cloneurl, "short": false }
        ]
      }
    ]
  };
  return _.merge(slackMessage, baseSlackMessage);
};

var processEvent = function(event, context) {
  //console.log("Data from API Gateway received:" + JSON.stringify(event, null, 2));
  var slackMessage = null;
  //var eventcommits = event.commits[0].message;
  //var eventrepository = event.repository[0].name;
  //var pusher = event.pusher.name;
  //var hook = event.hook_id;

  if(event.hasOwnProperty('pusher')){
    console.log("Processing Github Push Event");
    slackMessage = handleGithubPushEvent(event,context);
  }
  else if(event.hasOwnProperty('hook_id')){
    console.log("Processing Github New Hook");
    slackMessage = handleGithubNewHook(event,context);
  }
  else if(event.hasOwnProperty('member')){
    console.log("Processing New Collaborator added to Github");
    slackMessage = handleGithubNewCollobrator(event,context);
  }
  else{
    console.log('Cannot post to slack');
  }

  postMessage(slackMessage, function(response) {
    if (response.statusCode < 400) {
      console.info('message posted successfully');
      context.succeed();
    } else if (response.statusCode < 500) {
      console.error("error posting message to slack API: " + response.statusCode + " - " + response.statusMessage);
      // Don't retry because the error is due to a problem with the request
      context.succeed();
    } else {
      // Let Lambda retry
      context.fail("server error when processing message: " + response.statusCode + " - " + response.statusMessage);
    }
  });
};

exports.handler = function(event, context) {
  if (hookUrl) {
    processEvent(event, context);
  } else if (config.unencryptedHookUrl) {
    hookUrl = config.unencryptedHookUrl;
    processEvent(event, context);
  } else if (config.kmsEncryptedHookUrl && config.kmsEncryptedHookUrl !== '<kmsEncryptedHookUrl>') {
    var encryptedBuf = new Buffer(config.kmsEncryptedHookUrl, 'base64');
    var cipherText = { CiphertextBlob: encryptedBuf };
    var kms = new AWS.KMS();

    kms.decrypt(cipherText, function(err, data) {
      if (err) {
        console.log("decrypt error: " + err);
        processEvent(event, context);
      } else {
        hookUrl = "https://" + data.Plaintext.toString('ascii');
        processEvent(event, context);
      }
    });
  } else {
    context.fail('hook url has not been set.');
  }
};