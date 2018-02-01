const cassandra = require('cassandra-driver');

//Connect to the cluster
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'demo'});
client.execute("COPY events (event_ID, event_Start, event_End, event_IsClosed, rider_ID, driver_ID, driver_Availability, timestamp_Pickup, timestamp_Dropoff, geolocation_Pickup, geolocation_Dropoff, geolocation_SurgeZone, surge_Multiplier, price, success) FROM '/Users/dillonlin/Desktop/HackReactor/Hack_Reactor/Hack_Reactor_Thesis/RydeHR_Events_Service/TenMillionEntries/firstMillion.csv' WITH DELIMITER = ',';")
/* var query = COPY events (event_ID, event_Start, event_End, event_IsClosed, rider_ID, driver_ID, driver_Availability, timestamp_Pickup, timestamp_Dropoff, geolocation_Pickup, geolocation_Dropoff, geolocation_SurgeZone, surge_Multiplier, price, success) FROM '/Users/dillonlin/Desktop/HackReactor/Hack_Reactor/Hack_Reactor_Thesis/RydeHR_Events_Service/TenMillionEntries/firstMillion.csv' WITH DELIMITER = ',';
*/


