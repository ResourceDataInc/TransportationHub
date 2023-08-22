CREATE TABLE VehiclesLatest
  WITH (KAFKA_TOPIC='VehiclesLatest', VALUE_FORMAT='PROTOBUF')
    AS SELECT
                entity->id,
                LATEST_BY_OFFSET(entity->vehicle->position->latitude) as latitude,
                LATEST_BY_OFFSET(entity->vehicle->position->longitude) as longitude
        FROM VehicleEntitiesExploded 
        GROUP BY entity->id
EMIT CHANGES;
