CREATE STREAM TripEntitiesExplodedStopsExploded 
  WITH (KAFKA_TOPIC='TripEntitiesExplodedStopsExploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT
        entity->trip_update->trip->trip_id as trip_id,
        entity->trip_update->vehicle->id as vehicle_id,
        EXPLODE(entity->trip_update->stop_time_update) as stop_time_update,
        entity->trip_update->timestamp as ts
    FROM TripEntitiesExploded
EMIT CHANGES;
