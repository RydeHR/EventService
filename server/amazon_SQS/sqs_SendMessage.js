/* ----------- REQUIRE PACKAGES ----------- */
const Router = require('koa-router');
const sqs_SendMessageRouter = new Router();
const AWS = require('aws-sdk');
const path = require('path');
const QUEUE_URL = "https://sqs.us-east-2.amazonaws.com/771728572408/ClientToEvents";
const axios = require('axios');

/* ----------- AWS CONFIGURATION ----------- */
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Loading My AWS credentials and trying to instantiate the object
AWS.config.loadFromPath(path.join(__dirname + '../../../config.json'));

// Create SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Create Message Parameters
var params = {
  DelaySeconds: 0,
  MessageAttributes: {
    "Title": {
      DataType: "String",
      StringValue: "The Whistler"
    },
    "Author": {
    DataType: "String",
    StringValue: "John Grisham"
    },
  "WeeksOn": {
    DataType: "Number",
    StringValue: "6"
   }
 },
 MessageBody: "did you get boba today??",
 QueueUrl: `${QUEUE_URL}`
};

const sendSQSMessage = (params) => { 
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })   
}

const sendToLocation = (message) => { 
  axios.post("https://sqs.us-east-2.amazonaws.com/771728572408/ClientToEvents", {
    messageBody: `${message}`
  })
  .then((result) => console.log('This is the result', result))
  .catch((err) => console.log('Jackie didnt get it', err))
}

exports.sendSQSMessage = sendSQSMessage;
exports.sendToLocation = sendToLocation;