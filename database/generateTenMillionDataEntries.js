/* ----------- IMPORT PACKAGES ----------- */
const faker = require('faker');
const fs = require('fs');
const csvStringify = require('csv-stringify');

/* ----------- GENERATE 1 MILLION DATA ENTRIES ----------- */
// For loop to generate 1 million entires.
var generateOneMillion = (start, end, name) => {
	var tenMillionArray = [];
	for(let i = start; i < end; i++) {
		var eventObject = {};
		eventObject.event_ID = i;
		eventObject.event_Start = Date.parse(faker.date.past());
		eventObject.event_End = Date.parse(faker.date.past());
		eventObject.event_IsClosed = 'true';
		eventObject.rider_ID = faker.random.number();
		eventObject.rider_Firstname = faker.name.firstName();
		eventObject.driver_ID = faker.random.number();
		eventObject.driver_Firstname = faker.name.firstName();
		eventObject.driver_Availability = 'true';
		eventObject.timestamp_Pickup = Date.parse(faker.date.recent());
		eventObject.timestamp_Dropoff = Date.parse(faker.date.recent());
		eventObject.geolocation_Pickup = `[${faker.address.latitude()}, ${faker.address.longitude()}]`;
		eventObject.geolocation_Dropoff = `[${faker.address.latitude()}, ${faker.address.longitude()}]`;
		eventObject.geolocation_SurgeZone = faker.random.number({min:0, max:200});
		eventObject.surge_Multiplier = faker.finance.amount(0, 8, 2);
		eventObject.price = faker.finance.amount(0, 200, 2);
		eventObject.success = 'true';
		tenMillionArray.push(eventObject);
	} 
	// Writing a .csv file for every 1 million generated.
	var writeTenMillion = fs.createWriteStream(`${name}Million.csv`, 'utf8');
	var result = tenMillionArray;
	csvStringify(result, (error, output) => {
		writeTenMillion.write(output, 'utf8');
		writeTenMillion.end();
		console.log('FINISHED GENERATING DATA!', name);
	})
}

// // Uncomment To Generate CSV Files
// generateOneMillion(0, 1000000, 'first')
// generateOneMillion(1000000, 2000000, 'second')
// generateOneMillion(2000000, 3000000, 'third')
// generateOneMillion(3000000, 4000000, 'fourth')
// generateOneMillion(4000000, 5000000, 'fifth')
// generateOneMillion(5000000, 6000000, 'sixth')
// generateOneMillion(6000000, 7000000, 'seventh')
// generateOneMillion(7000000, 8000000, 'eigth')
// generateOneMillion(8000000, 9000000, 'ninth')
// generateOneMillion(9000000, 10000000, 'tenth')