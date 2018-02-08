/* ----------- REQUIRE PACKAGES ----------- */
var Router = require('koa-router');
var roundThreeRouter = new Router();
const cassandra = require('cassandra-driver');
const path = require('path');
const AWS = require('aws-sdk');

/* ----------- AWS CONFIGURATION ----------- */

// Loading AWS Credentials
AWS.config.loadFromPath(path.join(__dirname + '../../../config.json'));

// Set The Region
AWS.config.update({region: 'us-east-2'});

// Create SQS Service Object
var sns = new AWS.SNS();

/* ----------- FUNCTIONS ----------- */

var exampleMessage = JSON.stringify({
        event_ID: 10000007, 
        event_Start: 1509551094000, 
        event_End: 1488694571000,
        event_IsClosed: true, 
        rider_ID: 39383,
        rider_Firstname: "'Carls'",
        driver_ID: 23926,
        driver_Firstname: "'Junior'",
        driver_Availability: true, 
        timestamp_Pickup: 1517506892000,
        timestamp_Dropoff: 1517473258000,
        geolocation_Pickup: "[9.7004, -120.6138]",
        geolocation_Dropoff: "[-59.0519, 41.6842]",
        geolocation_SurgeZone: 121,
        surge_Multiplier: 7.05,
        price: 15.16,
        success: true
      });

testSNSPublish = {

  publishMessage: () => { 
    sns.publish({
      Message: JSON.stringify({ default: exampleMessage }),
      MessageStructure: 'json',
      TargetArn: 'arn:aws:sns:us-east-2:771728572408:Event_Service'
    }, function(err, data) {
      if (err) {
        console.log('Error With Message Sent', err);
      }
      console.log('SNS Message Was Sent!');
    });
  }
};

module.exports = testSNSPublish;