CREATE STREAM TripEntitiesExploded
  WITH (KAFKA_TOPIC='TripEntitiesExploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT EXPLODE(entity) as entity
        FROM Trips 
EMIT CHANGES;
