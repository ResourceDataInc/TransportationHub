#!/usr/bin/env bash
docker-compose up -d
sleep 80
docker exec broker kafka-topics --create --topic VehiclePositions --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic TripUpdates --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic FeedSpecAlerts --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 0 1000 false 200
# run containers
docker cp ksql/vehicles.sql ksqldb-cli:/home/appuser
docker cp ksql/entities_exploded.sql ksqldb-cli:/home/appuser
docker cp ksql/vehicles_latest.sql ksqldb-cli:/home/appuser
docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f vehicles.sql 
docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f entities_exploded.sql 
docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f vehicles_latest.sql 

