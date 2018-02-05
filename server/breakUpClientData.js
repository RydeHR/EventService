/* ----------- PACKAGES ----------- */
var Router = require('koa-router');
var breakUpClientDataRouter = new Router();
const axios = require('axios');
const Promise = require('bluebird');

/* ----------- FUNCTIONS ----------- */
breakUpClientDataRouter = {
	createSmallerObjects: (clientData) => {
		return new Promise ((resolve, reject) => {
			if(clientData === undefined) { reject('Something wrong with client data'); }
			let brokenUpData = [];
			let pricing = {};
			let location = {};
			let businessQuestion = {};
			for(var key in clientData) {
				pricing.event_ID = clientData.event_ID;
				pricing.timestamp_Pickup = clientData.timestamp_Pickup;
				pricing.geolocation_SurgeZone = clientData.geolocation_SurgeZone;
				pricing.surge_Multiplier = clientData.surge_Multiplier;
				pricing.success = clientData.success;
				location.driver_ID = clientData.driver_ID;
				location.geolocation_Dropoff = clientData.geolocation_Dropoff;
				location.geolocation_SurgeZone = clientData.geolocation_SurgeZone;
				businessQuestion.event_ID = clientData.event_ID;
				businessQuestion.event_Start = clientData.event_Start;
				businessQuestion.surge_Multiplier = clientData.surge_Multiplier;
			}
			brokenUpData.push(pricing, location, businessQuestion);
			resolve(brokenUpData);
		})
	}
}

module.exports = breakUpClientDataRouter;