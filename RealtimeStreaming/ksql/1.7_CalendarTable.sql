CREATE SOURCE TABLE CalendarTable (
index STRING PRIMARY KEY,
service_id STRING,
monday INT,
tuesday INT,
wednesday INT,
thursday INT,
friday INT,
saturday INT,
sunday INT,
start_date BIGINT,
end_date BIGINT
)
WITH (
    KAFKA_TOPIC = 'Calendar', KEY_FORMAT='KAFKA', VALUE_FORMAT='JSON'
);
