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
	logCloseEvent: () => {
		console.log('Need to send close event to events database');
	},

};

module.exports = roundThreeRouter;