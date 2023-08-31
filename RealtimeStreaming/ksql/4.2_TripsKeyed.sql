CREATE STREAM TripsKeyed
  WITH (KAFKA_TOPIC='TripsKeyed', VALUE_FORMAT='PROTOBUF')
    AS SELECT
        CONCAT(
            trip_id,
            '_',
            CAST(stop_time_update->stop_sequence AS STRING)
        ) as trip_seq_id,
        vehicle_id,
        stop_time_update,
        ts
    FROM TripEntitiesExplodedStopsExploded
EMIT CHANGES;
