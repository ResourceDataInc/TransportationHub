CREATE STREAM Alerts 
  WITH (KAFKA_TOPIC='FeedSpecAlerts',
        KEY_FORMAT = 'KAFKA',
        VALUE_FORMAT='PROTOBUF',
        VALUE_SCHEMA_FULL_NAME='transit_realtime.FeedMessage');
