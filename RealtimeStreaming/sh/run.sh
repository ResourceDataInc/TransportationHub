#!/usr/bin/env bash
docker-compose up -d
sleep 80
docker exec broker kafka-topics --create --topic VehiclePositions --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic TripUpdate --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic FeedSpecAlerts --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 0 1000 false 1
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 1 1000 false 1
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 2 1000 false 1
# run containers
for f in ksql/*.sql; do
docker cp $f ksqldb-cli:/home/appuser
rawfile=`basename $f`
docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f $rawfile
done

docker cp SnowflakeSinkConfig.json connect:/home/appuser
docker exec connect curl -X POST -H "Content-Type: application/json" --data @SnowflakeSinkConfig.json http://localhost:8083/connectors
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 0 1000 false 11 &
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 1 1000 false 11 & 
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 2 1000 false 11 & 
