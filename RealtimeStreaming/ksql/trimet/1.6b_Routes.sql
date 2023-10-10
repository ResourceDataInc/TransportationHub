CREATE SOURCE TABLE RoutesTable (
index STRING PRIMARY KEY,
route_id STRING,
route_long_name STRING,
route_color STRING,
route_text_color STRING
)
WITH (
    KAFKA_TOPIC = 'Routes', KEY_FORMAT='KAFKA', VALUE_FORMAT='JSON'
);
