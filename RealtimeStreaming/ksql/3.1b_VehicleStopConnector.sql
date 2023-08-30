CREATE STREAM VehicleStopConnector
    WITH (KAFKA_TOPIC='VehicleStopConnector', VALUE_FORMAT='PROTOBUF')
    AS
    SELECT 
        CONCAT(
            entity->vehicle->trip->route_id,
            '_',
            CAST(entity->vehicle->current_stop_sequence AS STRING),
            '_',
            CAST(entity->vehicle->trip->direction_id AS STRING)
        ) as k1,
        CONCAT(
            entity->vehicle->vehicle->id,
            '_',
            entity->vehicle->trip->trip_id,
            '_',
            CAST(entity->vehicle->current_stop_sequence AS STRING),
            '_',
            CAST(entity->vehicle->trip->direction_id AS STRING)

        ) as k2,
        entity->vehicle->trip->route_id as route_id,
        entity->vehicle->current_stop_sequence as current_stop_sequence,
        entity->vehicle->stop_id as stop_id,
        entity->vehicle->trip->direction_id as direction_id,
        entity->id as vehicle_id,
        entity->vehicle->trip->trip_id as trip_id
    FROM VehicleEntitiesExploded 
EMIT CHANGES;
