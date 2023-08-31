CREATE STREAM StopEventsAnnotated
    WITH (KAFKA_TOPIC='StopEventsAnnotated', VALUE_FORMAT='PROTOBUF')
    AS
    SELECT
        v.stop_id as stop_id,
        t.trip_seq_id as trip_seq_id,
        t.vehicle_id as vehicle_id,
        v.stop_lat as stop_lat,
        v.stop_lon as stop_lon,
        v.stop_name as stop_name,
        t.stop_time_update as stop_time_update,
        t.ts as ts
    FROM VehicleStopConnectorExp v
    JOIN TripsKeyed t WITHIN 15 MINUTES ON t.trip_seq_id = v.trip_seq_id
EMIT CHANGES;
