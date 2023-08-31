CREATE TABLE StopMapState (
stop_id STRING PRIMARY KEY,
direction_id STRING,
route_id STRING,
stop_lat STRING,
stop_lon STRING,
stop_name STRING,
stop_sequence STRING
)
WITH (
    KAFKA_TOPIC = 'StopMap', KEY_FORMAT='KAFKA', VALUE_FORMAT='JSON'
);
