CREATE TABLE VehiclesLatest
  WITH (KAFKA_TOPIC='VehiclesLatest', VALUE_FORMAT='PROTOBUF')
    AS SELECT
                entity->vehicle->vehicle->id as vehicle_id,
                LATEST_BY_OFFSET(entity->vehicle->position->latitude) as latitude,
                LATEST_BY_OFFSET(entity->vehicle->position->longitude) as longitude,
                LATEST_BY_OFFSET(entity->vehicle->current_status) as current_status,
                LATEST_BY_OFFSET(entity->vehicle->current_stop_sequence) as current_stop_sequence,
                LATEST_BY_OFFSET(entity->vehicle->stop_id) as stop_id,
                LATEST_BY_OFFSET(t.route_id) as route_id,
                LATEST_BY_OFFSET(t.direction_id) as direction_id,
                LATEST_BY_OFFSET(entity->vehicle->timestamp) as timestamp,
                LATEST_BY_OFFSET(entity->vehicle->position->bearing) as bearing,
                LATEST_BY_OFFSET(entity->vehicle->position->speed) as speed,
                LATEST_BY_OFFSET(t.trip_id) as trip_id
        FROM VehicleEntitiesExploded v
        JOIN TripsTable t ON t.trip_id = v.entity->vehicle->trip->trip_id 
        GROUP BY entity->vehicle->vehicle->id 
EMIT CHANGES;
