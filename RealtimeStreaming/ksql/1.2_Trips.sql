CREATE STREAM Trips 
  WITH (KAFKA_TOPIC='TripUpdate',
        KEY_FORMAT = 'KAFKA',
        VALUE_FORMAT='PROTOBUF',
        VALUE_SCHEMA_FULL_NAME='transit_realtime.FeedMessage');
