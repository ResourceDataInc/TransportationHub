#!/usr/bin/env bash
docker-compose up -d
# will need to pause before adding topics
docker exec broker kafka-topics --create --topic VehiclePositions --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic TripUpdates --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic FeedSpecAlerts --bootstrap-server broker:9092 --replication-factor 1 partitions 1
# run containers
SQL_FILE="flow.sql"
docker cp ksql/$SQL_FILE ksqldb-cli:/home/appuser
docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f $SQL_FILE

