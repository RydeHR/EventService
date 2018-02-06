/* ----------- REQUIRE PACKAGES ----------- */
var Router = require('koa-router');
var roundThreeRouter = new Router();
const cassandra = require('cassandra-driver');
const path = require('path');
const axios = require('axios');
const util = require('util');
const Promise = require('bluebird');
const AWS = require('aws-sdk');

/* ----------- DATABASE CONNECTION ----------- */
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- AWS CONFIGURATION ----------- */

// Loading AWS Credentials
AWS.config.loadFromPath(path.join(__dirname + '../../config.json'));
AWS.config.update({region: 'us-east-2'});

// Create SQS Service Object
var sns = new AWS.SNS();

/* ----------- FUNCTIONS ----------- */
roundThreeRouter = {

	storeLocationData: (locationData) => {
		let query = `INSERT INTO location (driver_ID, geolocation_Dropoff, geolocation_SurgeZone) VALUES (${locationData})`;
		return new Promise ((resolve, reject) => { 
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

  publishLocationsDataToSNS: (locationData) => {
    // console.log('Location data was sent!');
    sns.publish({
      Message: JSON.stringify({default: locationData}),
      MessageStructure: 'json',
      TargetArn: 'arn:aws:sns:us-east-2:771728572408:Event_Service'
    }, function(err, data) {
      if (err) {
        console.log('ERROR WITH THE SNS PUBLISH', err.stack);
        return;
      } else {
        console.log('SUCCESSFUL PUBLISH TO SNS')
      }
    });
  }

  // // SQS Version Of Send Pricing
  // sendToSQSLocationService: (locationData) => {
  //   return new Promise((resolve, reject) => {
  //     sqs.sendMessage({
  //       DelaySeconds: 0,
  //       MessageBody: `${locationData}`,
  //       QueueUrl: `${QUEUE_URL}`
  //     }, function(err, data) {
  //       if (err) { reject(err); }
  //       else { resolve(data); }
  //     })
  //   })   
  // }

  // Axios Version Of Send Pricing
  // sendToLocationService: (locationData) => {
  //   axios.post('/driver', locationData)
  //   .then(() => { roundThreeRouter.storeLocationData(locationData); })
  //   .catch((err) => { console.log('Axios post is an error because we have not connected the services yet.') })
  // },

};

module.exports = roundThreeRouter;