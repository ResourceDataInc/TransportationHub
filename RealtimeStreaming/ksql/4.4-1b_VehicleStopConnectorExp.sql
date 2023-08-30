CREATE STREAM VehicleStopConnectorExp 
    WITH (KAFKA_TOPIC='VehicleStopConnectorExp', VALUE_FORMAT='PROTOBUF')
    AS 
    SELECT 
        s.route_id as route_id,
        s.stop_sequence as stop_sequence,
        s.direction_id as direction_id,
        s.stop_lat as stop_lat,
        s.stop_lon as stop_lon,
        s.stop_name as stop_name,
        v.k1 as k1,
        v.k2 as k2,
        v.vehicle_id as vehicle_id,
        v.trip_id as trip_id,
        v.stop_id as stop_id
    FROM VehicleStopConnector v
    INNER JOIN StopMapState s ON s.id = v.k1
EMIT CHANGES;
