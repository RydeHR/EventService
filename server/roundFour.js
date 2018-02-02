/* ----------- PACKAGES ----------- */
var Router = require('koa-router');
var roundFourRouter = new Router();
const cassandra = require('cassandra-driver');
const axios = require('axios');
const Promise = require('bluebird');

/* ----------- DATABASE CONNECTION ----------- */
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'dillon' });
client.connect();

/* ----------- FUNCTIONS ----------- */
roundFourRouter = {

	insertAnalyticsData: (businessQuestionData) => {
		let query = `INSERT INTO businessQuestion (event_ID, event_Start, surge_Multiplier) VALUES (${businessQuestionData})`;
		console.log('query for business', query);
		return new Promise ((resolve, reject) => { 
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

	retrieveAnalyticsData: () => {
		let query = 'SELECT * FROM businessQuestion WHERE surge_Multiplier > 5';
		return new Promise ((resolve, reject) => { 
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

};

module.exports = roundFourRouter;