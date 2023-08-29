CREATE STREAM TripsKeyed 
  WITH (KAFKA_TOPIC='TripsKeyed', VALUE_FORMAT='PROTOBUF')
    AS SELECT
        CONCAT(
            vehicle_id,
            '_',
            trip_id,
            '_',
            CAST(stop_time_update->stop_sequence AS STRING),
            '_',
            CAST(direction_id AS STRING)
        ) as k2,
        stop_time_update,
        ts
    FROM TripEntitiesExplodedStopsExploded 
EMIT CHANGES;
