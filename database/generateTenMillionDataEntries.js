/* ----------- IMPORT PACKAGES ----------- */
const faker = require('faker');
const fs = require('fs');
const csvStringify = require('csv-stringify');

/* ----------- GENERATE INITIAL 2 MILLION DATA ----------- */
var generateOneMillion = () => {
	var tenMillionArray = [];
	for(let i = 0; i < 1000000; i++) {
		var eventObject = {};
		eventObject.event_ID = i;
		eventObject.event_Start = faker.date.past();
		eventObject.event_End = faker.date.past();
		eventObject.event_IsClosed = 'true';
		eventObject.rider_ID = faker.random.number();
		eventObject.driver_ID = faker.random.number();
		eventObject.driver_Availability = 'true';
		eventObject.timestamp_Pickup = faker.date.recent();
		eventObject.timestamp_Dropoff = faker.date.recent();
		eventObject.geolocation_Pickup = `[${faker.address.latitude()}, ${faker.address.longitude()}]`;
		eventObject.geolocation_Dropoff = `[${faker.address.latitude()}, ${faker.address.longitude()}]`;
		eventObject.geolocation_SurgeZone = faker.random.number({min:0, max:200});
		eventObject.surge_Multiplier = faker.finance.amount(0, 8, 2);
		eventObject.price = faker.finance.amount(0, 200, 2);
		eventObject.success = 'true';
		tenMillionArray.push(eventObject);
	} 
	var writeTenMillion = fs.createWriteStream(`tenthMillion.csv`, 'utf8');
	var result = tenMillionArray;
	csvStringify(result, (error, output) => {
		writeTenMillion.write(output, 'utf8');
		writeTenMillion.end();
		console.log('FINISHED GENERATING DATA!');
	})
}

generateOneMillion();

/* ----------- GENERATE EVERY SUCCEEDING 2 MILLION DATA ----------- */
// var appendTwoMillion = () => {
// 	var tenMillionArray = [];
// 	for(let i = 2000000; i < 3000000; i++) {
// 		var eventObject = {};
// 		eventObject.event_ID = i;
// 		eventObject.event_Start = faker.date.past();
// 		eventObject.event_End = faker.date.past();
// 		eventObject.event_IsClosed = 'true';
// 		eventObject.rider_ID = faker.random.number();
// 		eventObject.driver_ID = faker.random.number();
// 		eventObject.driver_Availability = 'true';
// 		eventObject.timestamp_Pickup = faker.date.recent();
// 		eventObject.timestamp_Dropoff = faker.date.recent();
// 		eventObject.geolocation_Pickup = `[${faker.address.latitude()}, ${faker.address.longitude()}]`;
// 		eventObject.geolocation_Dropoff = `[${faker.address.latitude()}, ${faker.address.longitude()}]`;
// 		eventObject.geolocation_SurgeZone = faker.random.number({min:0, max:200});
// 		eventObject.surge_Multiplier = faker.finance.amount(0, 8, 2);
// 		eventObject.price = faker.finance.amount(0, 200, 2);
// 		eventObject.success = 'true';
// 		tenMillionArray.push(eventObject);
// 	}
// 	var result = tenMillionArray;
// 	csvStringify(result, (error, output) => {
// 		fs.appendFile(`tenMillionEvents.csv`, output);
// 		console.log('FINISHED APPENDING DATA!');
// 	})
// }

// appendTwoMillion();