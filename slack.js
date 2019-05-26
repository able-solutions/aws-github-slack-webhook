const AWS = require('aws-sdk');
const moment = require('moment');

exports.handler = function(event, context) {
  
  const payload = JSON.stringify(event);
  
  console.log(payload);
  
};