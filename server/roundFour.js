/* ----------- REQUIRE PACKAGES ----------- */
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
		return new Promise ((resolve, reject) => { 
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

	retrieveAnalyticsData: (randomNumber) => {
		let query = `SELECT * FROM businessQuestion WHERE event_ID = ${randomNumber} allow filtering`;
		return new Promise ((resolve, reject) => { 
			client.execute(query, (err, result) => {
				if(err) { reject(err); }
				else { resolve(result); }
			})
		})
	},

};

module.exports = roundFourRouter;