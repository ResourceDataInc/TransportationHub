CREATE TABLE vehicles_latest
  WITH (KAFKA_TOPIC='vehicles_latest', VALUE_FORMAT='PROTOBUF')
    AS SELECT
                entity->id,
                LATEST_BY_OFFSET(entity->vehicle->position->latitude) as latitude,
                LATEST_BY_OFFSET(entity->vehicle->position->longitude) as longitude
        FROM entities_exploded
        GROUP BY entity->id
EMIT CHANGES;