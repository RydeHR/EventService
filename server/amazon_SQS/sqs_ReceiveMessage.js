/* ----------- REQUIRE PACKAGES ----------- */
const Router = require('koa-router');
const sqs_ReceiveMessageRouter = new Router();
const path = require('path');
const axios = require('axios');
const AWS = require('aws-sdk');
const QUEUE_URL = 'https://sqs.us-east-2.amazonaws.com/771728572408/ClientToEvents';

/* ----------- AWS CONFIGURATION ----------- */
// Set the region
AWS.config.update({region: 'us-east-2'});

// Create SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
 AttributeNames: ['SentTimestamp'],
 MaxNumberOfMessages: 10,
 QueueUrl: QUEUE_URL,
 VisibilityTimeout: 0,
 WaitTimeSeconds: 0
};

const receiveSQSMessage = () => {
  return new Promise((resolve, reject) => {
    sqs.receiveMessage(params, function(err, data) {
      if (err) {
        console.log('Error Retrieving Data', err);
        reject(err);
      } else if (data) {
        console.log('This Is The Data From SQS Queue', data)
        resolve(data)
        if(data.Messages) {
          var deleteParams = {
            QueueUrl: QUEUE_URL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, function(err, data) {
            if (err) { console.log('Error Whilst Deleting Message', err); } 
            else { console.log('Message Was Deleted', data); }
          });
        }
      }
    });
  })
}

exports.receiveSQSMessage = receiveSQSMessage;