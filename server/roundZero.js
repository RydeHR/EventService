/* ----------- PACKAGES ----------- */
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

	sendToPricingService: () => {
		let start = new Date(); // THIS IS FOR TESTING THE 200 MS TIME THING
		roundZeroRouter.retrievePricingData()
		.then((result) => {
			console.log('This is the time it takes', new Date() - start, 'milliseconds');
			axios.post('/history', result.rows)
			.then(() => { console.log('Successful post!')} )
			.catch((err) => { console.log('Axios post is an error because we have not connected the services yet.') })
		})
		.catch((err) => {
			console.log('There is an error in the retrievePricingData', err);
		})
	}
};

module.exports = roundZeroRouter;