/* ----------- REQUIRE PACKAGES ----------- */
var Router = require('koa-router');
var roundOneRouter = new Router();
const cassandra = require('cassandra-driver');
const path = require('path');
const Promise = require('bluebird');
const AWS = require('aws-sdk');

/* ----------- DATABASE CONNECTION ----------- */
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- AWS CONFIGURATION ----------- */

// Loading AWS Credentials
AWS.config.loadFromPath(path.join(__dirname + '../../config.json'));

// Create SQS Service Object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

// AWS Queue URL
const QUEUE_URL = 'https://sqs.us-east-2.amazonaws.com/771728572408/ClientToEvents';

/* ----------- FUNCTIONS ----------- */
roundOneRouter = {

	logCloseEvent: (eventData) => {
		let query = `INSERT INTO events (event_ID, event_Start, event_End, event_IsClosed, rider_ID, rider_Firstname, driver_ID, driver_Firstname, driver_Availability, timestamp_Pickup, timestamp_Dropoff, geolocation_Pickup, geolocation_Dropoff, geolocation_SurgeZone, surge_Multiplier, price, success) VALUES (${eventData})`;
		return new Promise((resolve, reject) => {
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

  getSQSAttributes: () => {
    return new Promise ((resolve, reject) => {
      sqs.getQueueAttributes({
        QueueUrl: QUEUE_URL,
        AttributeNames: ['ApproximateNumberOfMessages']
      }, function (err, result) {
          if (err) { reject(err); }
          else { resolve(result.Attributes.ApproximateNumberOfMessages); }
      });
    })
  },
  
  // THIS FUNCTION IS ONLY USED FOR TESTING PURPOSES
  receiveSQSMessage: () => {
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
};

module.exports = roundOneRouter;