CREATE TABLE VehiclesLatest
  WITH (KAFKA_TOPIC='VehiclesLatest', VALUE_FORMAT='PROTOBUF')
    AS SELECT
                entity->id as vehicle_id,
                LATEST_BY_OFFSET(entity->vehicle->position->latitude) as latitude,
                LATEST_BY_OFFSET(entity->vehicle->position->longitude) as longitude,
                LATEST_BY_OFFSET(entity->vehicle->current_status) as current_status,
                LATEST_BY_OFFSET(entity->vehicle->current_stop_sequence) as current_stop_sequence,
                LATEST_BY_OFFSET(entity->vehicle->stop_id) as stop_id,
                LATEST_BY_OFFSET(entity->vehicle->trip->route_id) as route_id,
                LATEST_BY_OFFSET(entity->vehicle->timestamp) as timestmp 
        FROM VehicleEntitiesExploded 
        GROUP BY entity->id 
EMIT CHANGES;
