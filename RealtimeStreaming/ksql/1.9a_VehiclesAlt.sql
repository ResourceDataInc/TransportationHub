CREATE STREAM VehiclesAlt
  WITH (KAFKA_TOPIC='vehicles',
        KEY_FORMAT='KAFKA',
        VALUE_FORMAT='JSON_SR');
