/* ----------- PACKAGES ----------- */
var Router = require('koa-router');
var roundOneRouter = new Router();
const cassandra = require('cassandra-driver');
const axios = require('axios');
const Promise = require('bluebird');

/* ----------- DATABASE CONNECTION ----------- */
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS ----------- */
roundOneRouter = {
	logCloseEvent: (event) => {
		let query = `INSERT INTO events (event_ID, event_Start, event_End, event_IsClosed, rider_ID, driver_ID, driver_Availability, timestamp_Pickup, timestamp_Dropoff, geolocation_Pickup, geolocation_Dropoff, geolocation_SurgeZone, surge_Multiplier, price, success) VALUES (${event})`;
		return new Promise((resolve, reject) => {
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

};

module.exports = roundOneRouter;