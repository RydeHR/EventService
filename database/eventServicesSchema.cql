DROP KEYSPACE dillon;

CREATE KEYSPACE dillon with replication = {
	'class': 'SimpleStrategy',
	'replication_factor': 1	
};

USE dillon;

CREATE TABLE events (
	event_ID int Primary Key,
	event_Start timestamp, 
	event_End timestamp,
	event_IsClosed boolean, 
	rider_ID int,
	driver_ID int,
	driver_Availability boolean, 
	timestamp_Pickup timestamp,
	timestamp_Dropoff timestamp,
	geolocation_Pickup list <decimal>,
	geolocation_Dropoff list <decimal>,
	geolocation_SurgeZone int,
	surge_Multiplier decimal,
	price decimal,
	success boolean
);

CREATE TABLE pricing (
	event_ID int Primary Key,
	timestamp_Pickup timestamp,
	geolocation_SurgeZone list <int>,
	surge_Multiplier decimal,
	success boolean
);

CREATE TABLE location (
	driver_ID int Primary Key,
	geolocation_Dropoff list <int>,
	geolocation_SurgeZone list <int>
);