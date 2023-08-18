CREATE STREAM vehicles
  WITH (KAFKA_TOPIC='vehicle-positions', 
        KEY_FORMAT = 'KAFKA',
	VALUE_FORMAT='PROTOBUF',
	VALUE_SCHEMA_FULL_NAME='transit_realtime.FeedMessage');

CREATE STREAM entities_exploded
  WITH (KAFKA_TOPIC='entities_exploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT EXPLODE(entity) as entity  
	FROM vehicles
EMIT CHANGES;

CREATE TABLE vehicles_latest
  WITH (KAFKA_TOPIC='vehicles_latest', VALUE_FORMAT='PROTOBUF')
    AS SELECT 
		entity->id,
		LATEST_BY_OFFSET(entity->vehicle->position->latitude) as latitude,
		LATEST_BY_OFFSET(entity->vehicle->position->longitude) as longitude  
	FROM entities_exploded
	GROUP BY entity->id
EMIT CHANGES;