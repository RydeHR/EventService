/* ----------- REQUIRE PACKAGES ----------- */
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const cassandra = require('cassandra-driver');
const path = require('path');
const AWS = require('aws-sdk');

/* ----------- IMPORT SERVER ROUTES ----------- */
const server = require('../server/server.js');
const roundZero = require('../server/roundZero.js');
const roundOne = require('../server/roundOne.js');
const roundThree = require('../server/roundThree.js');
const roundFour = require('../server/roundFour.js');
const exampleSNSPublish = require('../server/example_amazon_SNS/example_sns_PublishMessage.js');

/* ----------- DATABASE CONNECTION ----------- */
client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- AWS CONFIGURATION ----------- */

// Loading AWS Credentials
AWS.config.loadFromPath(path.join(__dirname + '../../config.json'));

// Create SQS Service Object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

// AWS Queue URL
const QUEUE_URL = 'https://sqs.us-east-2.amazonaws.com/771728572408/Testing_Queue';

/* ----------- FUNCTIONS ----------- */
// Publish A Message To My SNS
exampleSNSPublish.publishMessage();

// Grabbing From SQS
const pullFromSQSTestingQueue = () => {
  return new Promise((resolve, reject) => {
    sqs.receiveMessage({
      AttributeNames: ['SentTimestamp'],
      MaxNumberOfMessages: 1,
      QueueUrl: QUEUE_URL,
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0
    }, function(err, data) {
      if (err) {
        console.log('Error Retrieving Data', err);
        reject(err);
      } 
      else if (data) {
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
      resolve(data)
      }
    });
  })
}

/* ----------- END TO END TEST ----------- */
describe('End To End Test', () => {
  it('Round Zero - Should Be Storing A New Pricing Entry', (done) => {
    client.execute('SELECT * FROM pricing WHERE event_ID = 10000007', (err, result) => {
      if(err) { console.log('Error With Selection From Pricing') }
      else { assert.equal(result.rowLength, 1); }
    })
    done();
  })
  it('Round Zero - Should Be Sending A Pricing Object To Pricing Services', (done) => {
    pullFromSQSTestingQueue().then((result) => { assert.equal(typeof result.ResponseMetadata, 'object'); })
    done();
  })
  it('Round One - Should Be Storing A New Event', (done) => {
    client.execute('SELECT * FROM pricing WHERE event_ID = 10000007', (err, result) => {
      if(err) { console.log('Error With Selection From Event') }
      else { assert.equal(result.rowLength, 1); }
    })
    done();
  })
  it('Round Three - Should Be Storing A New Location Entry', (done) => {
    client.execute('SELECT * FROM Location WHERE driver_id = 23926', (err, result) => {
      if(err) { console.log('Error With Selection From Location') }
      else { assert.equal(result.rowLength, 1); }
    })
    done();
  })
  it('Round Three - Should Be Sending A Location Object To Location Services', (done) => {
    pullFromSQSTestingQueue().then((result) => { assert.equal(typeof result.ResponseMetadata, 'object'); })
    done();
  })
  it('Round Four - Should Be Storing A New Analytics Entry', (done) => {
    client.execute('SELECT * FROM pricing WHERE event_ID = 10000007', (err, result) => {
      if(err) { console.log('Error With Selection From Business Question') }
      else { assert.equal(result.rowLength, 1); }
    })
    done();
  })
})