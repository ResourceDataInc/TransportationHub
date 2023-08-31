CREATE TABLE StopsLatest
    WITH (KAFKA_TOPIC='StopsLatest', VALUE_FORMAT='PROTOBUF')
    AS
    SELECT
        stop_id,
        LATEST_BY_OFFSET(trip_seq_id) as trip_seq_id,
        LATEST_BY_OFFSET(stop_lat) as stop_lat,
        LATEST_BY_OFFSET(stop_lon) as stop_lon,
        LATEST_BY_OFFSET(stop_name) as stop_name,
        LATEST_BY_OFFSET(vehicle_id) as vehicle_id,
        LATEST_BY_OFFSET(stop_time_update) as stop_time_update,
        LATEST_BY_OFFSET(ts) as ts
    FROM StopEventsAnnotated
    GROUP BY stop_id
EMIT CHANGES;
