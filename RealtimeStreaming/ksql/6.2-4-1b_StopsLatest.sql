CREATE TABLE StopsLatest
    WITH (KAFKA_TOPIC='StopsLatest', VALUE_FORMAT='PROTOBUF')
    AS
    SELECT
        stop_coords,
        LATEST_BY_OFFSET(route_id,3) as route_ids,
        LATEST_BY_OFFSET(direction_id,3) as direction_ids,
        LATEST_BY_OFFSET(stop_sequence,3) as stop_sequences,
        LATEST_BY_OFFSET(stop_lat) as stop_lat,
        LATEST_BY_OFFSET(stop_lon) as stop_lon,
        LATEST_BY_OFFSET(stop_name) as stop_name,
        LATEST_BY_OFFSET(vehicle_id,3) as vehicle_ids,
        LATEST_BY_OFFSET(trip_id,3) as trip_ids,
        LATEST_BY_OFFSET(stop_time_update,3) as stop_time_updates,
        LATEST_BY_OFFSET(ts,3) as timestamps
    FROM StopEventsAnnotated
    GROUP BY stop_coords 
EMIT CHANGES;
