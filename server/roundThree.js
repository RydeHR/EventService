/* ----------- PACKAGES ----------- */
var Router = require('koa-router');
var roundThreeRouter = new Router();
const cassandra = require('cassandra-driver');
const axios = require('axios');
const Promise = require('bluebird');

/* ----------- DATABASE CONNECTION ----------- */
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS ----------- */
roundThreeRouter = {

	sendToLocationService: (locationData) => {
		axios.post('/driver', locationData)
		.then(() => { roundThreeRouter.storeLocationData(locationData); })
		.catch((err) => { console.log('Axios post is an error because we have not connected the services yet.') })
	},

	storeLocationData: (locationData) => {
		let query = `INSERT INTO location (driver_ID, geolocation_Dropoff, geolocation_SurgeZone) VALUES (${locationData})`;
		return new Promise ((resolve, reject) => { 
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	}
};

module.exports = roundThreeRouter;