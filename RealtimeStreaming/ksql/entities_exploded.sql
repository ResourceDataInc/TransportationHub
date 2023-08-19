CREATE STREAM entities_exploded
  WITH (KAFKA_TOPIC='entities_exploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT EXPLODE(entity) as entity
        FROM vehicles
EMIT CHANGES;