CREATE STREAM Vehicles
  WITH (KAFKA_TOPIC='VehiclePositions',
        KEY_FORMAT = 'KAFKA',
        VALUE_FORMAT='PROTOBUF',
        VALUE_SCHEMA_FULL_NAME='transit_realtime.FeedMessage');
