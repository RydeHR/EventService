/* ----------- REQUIRE PACKAGES ----------- */
var Router = require('koa-router');
var roundZeroRouter = new Router();
const cassandra = require('cassandra-driver');
const path = require('path');
const axios = require('axios');
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
roundZeroRouter = {

	retrievePricingData: () => {
		let query = 'SELECT * FROM events WHERE event_ID < 999 AND price > 150';
		return new Promise ((resolve, reject) => { 
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

	storePricingData: (pricingData) => {
		let query = `INSERT INTO pricing (event_ID, timestamp_Pickup, geolocation_SurgeZone, surge_Multiplier, success) VALUES (${pricingData})`;
		return new Promise((resolve, reject) => {
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

  sendToSQSPricingService: (pricingData) => {
    return new Promise((resolve, reject) => {
      sqs.sendMessage({
        DelaySeconds: 0,
        MessageBody: `${pricingData}`,
        QueueUrl: `${QUEUE_URL}`
      }, function(err, data) {
        if (err) { reject(err); }
        else { resolve(data); }
      })
    })   
  }

  // // Axios Version Of Send Pricing
	// sendToPricingService: (pricingData) => {
	// 	axios.post('/history', pricingData)
	// 	.then(() => { roundZeroRouter.storePricingData(pricingData); })
	// 	.catch((err) => { console.log('Axios post is an error because we have not connected the services yet.') })
	// }

};

module.exports = roundZeroRouter;