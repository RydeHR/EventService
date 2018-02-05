/* ----------- REQUIRE PACKAGES ----------- */
const Router = require('koa-router');
const sqs_SendMessageRouter = new Router();
const path = require('path');
const axios = require('axios');
const AWS = require('aws-sdk');
const QUEUE_URL = "https://sqs.us-east-2.amazonaws.com/771728572408/ClientToEvents";


/* ----------- AWS CONFIGURATION ----------- */
// Set the region 
AWS.config.update({region: 'us-east-2'});

// Loading My AWS credentials and trying to instantiate the object
AWS.config.loadFromPath(path.join(__dirname + '../../../config.json'));

// Create SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Create Message Parameters
var params = {
  DelaySeconds: 0,
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

const sendToLocation = (locationData) => { 
  axios.post("https://sqs.us-east-2.amazonaws.com/771728572408/ClientToEvents", {
    messageBody: `${locationData}`
  })
  .then((result) => console.log('This Is The Location Data Result', result))
  .catch((err) => console.log('Send To Location Data Fail', err))
}

const sendToPricing = (pricingData) => { 
  axios.post("https://sqs.us-east-2.amazonaws.com/771728572408/ClientToEvents", {
    messageBody: `${pricingData}`
  })
  .then((result) => console.log('This Is The Pricing Data Result', result))
  .catch((err) => console.log('Send To Pricing Data Fail', err))
}

exports.sendSQSMessage = sendSQSMessage;
exports.sendToLocation = sendToLocation;
exports.sendToPricing = sendToPricing;