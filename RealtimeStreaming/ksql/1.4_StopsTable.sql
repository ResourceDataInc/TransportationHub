CREATE TABLE StopsTable (
stop_id STRING PRIMARY KEY,
direction_id INT,
route_id STRING,
stop_lat double,
stop_lon double,
stop_name STRING,
stop_sequence INT 
)
WITH (
    KAFKA_TOPIC = 'Stops', KEY_FORMAT='KAFKA', VALUE_FORMAT='JSON'
);
