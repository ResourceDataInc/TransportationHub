CREATE STREAM VehicleEntitiesExploded
  WITH (KAFKA_TOPIC='VehicleEntitiesExploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT EXPLODE(entity) as entity
        FROM Vehicles
EMIT CHANGES;
