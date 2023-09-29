CREATE STREAM AlertEntitiesExploded
  WITH (KAFKA_TOPIC='AlertEntitiesExploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT EXPLODE(entity) as entity
        FROM Alerts 
EMIT CHANGES;
