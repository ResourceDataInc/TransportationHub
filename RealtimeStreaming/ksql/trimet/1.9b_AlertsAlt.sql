CREATE STREAM AlertsAlt 
  WITH (KAFKA_TOPIC='alerts',
        KEY_FORMAT='KAFKA',
        VALUE_FORMAT='JSON_SR');