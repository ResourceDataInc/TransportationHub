CREATE STREAM VehiclesAltExploded
  WITH (KAFKA_TOPIC='VehiclesAltExploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT EXPLODE(resultSet->vehicle) as vehicle
        FROM VehiclesAlt
EMIT CHANGES;
