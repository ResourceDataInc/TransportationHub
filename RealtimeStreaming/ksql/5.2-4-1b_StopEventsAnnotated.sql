CREATE STREAM StopEventsAnnotated
    WITH (KAFKA_TOPIC='StopEventsAnnotated', VALUE_FORMAT='PROTOBUF')
    AS
    SELECT
        CONCAT(v.stop_lat,'_',v.stop_lon) as stop_coords,
        v.k1 as k1,
        v.k2 as k2,
        v.route_id as route_id,
        v.direction_id as direction_id,
        v.stop_sequence as stop_sequence,
        v.stop_lat as stop_lat,
        v.stop_lon as stop_lon,
        v.stop_name as stop_name,
        v.vehicle_id as vehicle_id,
        v.trip_id as trip_id,
        t.stop_time_update as stop_time_update,
        t.ts as ts
    FROM VehicleStopConnectorExp v
    INNER JOIN TripsKeyed t WITHIN 15 MINUTES ON t.k2 = v.k2
EMIT CHANGES;
