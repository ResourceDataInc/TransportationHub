CREATE SOURCE TABLE TripsTable (
index STRING PRIMARY KEY,
route_id STRING,
service_id STRING,
direction_id INT,
shape_id BIGINT
)
WITH (
    KAFKA_TOPIC = 'Trips', KEY_FORMAT='KAFKA', VALUE_FORMAT='JSON'
);
