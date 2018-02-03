/* ----------- REQUIRE PACKAGES ----------- */
var Router = require('koa-router');
var roundZeroRouter = new Router();
const cassandra = require('cassandra-driver');
const axios = require('axios');
const Promise = require('bluebird');

/* ----------- DATABASE CONNECTION ----------- */
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS ----------- */
roundZeroRouter = {
	retrievePricingData: () => {
		let query = 'SELECT * FROM events WHERE event_ID=9999999';
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

	sendToPricingService: (pricingData) => {
		axios.post('/history', pricingData)
		.then(() => { roundZeroRouter.storePricingData(pricingData); })
		.catch((err) => { console.log('Axios post is an error because we have not connected the services yet.') })
	}
};

roundZeroRouter.retrievePricingData();

module.exports = roundZeroRouter;