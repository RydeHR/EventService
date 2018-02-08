/* ----------- REQUIRE PACKAGES ----------- */
var Router = require('koa-router');
var roundThreeRouter = new Router();
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
    defaultMessage = JSON.stringify(locationData)
    return new Promise ((resolve, reject) => {
      sns.publish({
        Message: JSON.stringify({ default: defaultMessage }),
        MessageStructure: 'json',
        TargetArn: 'arn:aws:sns:us-east-2:771728572408:Testing'
      }, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      });
    })
  }
};

module.exports = roundThreeRouter;