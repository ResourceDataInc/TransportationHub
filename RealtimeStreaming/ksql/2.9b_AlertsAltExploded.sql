CREATE STREAM AlertsAltExploded
  WITH (KAFKA_TOPIC='AlertsAltExploded', VALUE_FORMAT='PROTOBUF')
    AS SELECT EXPLODE(resultSet->alert) as alert 
        FROM AlertsAlt
EMIT CHANGES;
