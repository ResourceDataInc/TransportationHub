CREATE TABLE StopMapState (
id STRING PRIMARY KEY,
stop_id STRING,
stop_name STRING,
stop_lat STRING,
stop_lon STRING,
stop_sequence STRING,
route_id STRING,
direction_id STRING
)
WITH (
    KAFKA_TOPIC = 'StopMap', KEY_FORMAT='KAFKA', VALUE_FORMAT='JSON'
);
