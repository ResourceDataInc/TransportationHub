CREATE SOURCE TABLE CalendarDatesTable (
index STRING PRIMARY KEY,
service_id STRING,
date BIGINT,
exception_type INT
)
WITH (
    KAFKA_TOPIC = 'CalendarDates', KEY_FORMAT='KAFKA', VALUE_FORMAT='JSON'
);
