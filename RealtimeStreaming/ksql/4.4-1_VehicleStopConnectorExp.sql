CREATE STREAM VehicleStopConnectorExp 
    WITH (KAFKA_TOPIC='VehicleStopConnectorExp', VALUE_FORMAT='PROTOBUF')
    AS 
    SELECT 
        s.stop_id as stop_id,
        concat(v.entity->vehicle->trip->trip_id,'_',cast(s.stop_sequence as string)) as trip_seq_id,
        s.stop_lat as stop_lat,
        s.stop_lon as stop_lon,
        s.stop_name as stop_name
    FROM VehicleEntitiesExploded v
    JOIN StopMapState s ON s.stop_id = v.entity->vehicle->stop_id
EMIT CHANGES;
