#!/usr/bin/env bash
docker-compose up -d
sleep 80
# setup stop map data
docker exec datastreamer wget https://developer.trimet.org/schedule/gtfs.zip
docker exec datastreamer unzip gtfs.zip -d gtfs
docker cp py/gtfs_script.py datastreamer:/javafiles
docker exec datastreamer sh -c "./gtfs_script.py > /shared-data/stop_data.json"
docker exec broker kafka-topics --create --topic StopMap --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic StopMap --property \"parse.key=true\" < /shared-data/stop_data.json"

docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 0 1000 false -1 &
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 1 1000 false -1 &
docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 2 1000 false -1 &
sleep 10
for f in ksql/*.sql; do
docker cp $f ksqldb-cli:/home/appuser
rawfile=`basename $f`
docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f $rawfile
# for talking during the demo 
sleep 10 
done

docker cp SnowflakeSinkConfig.json connect:/home/appuser
docker exec connect curl -X POST -H "Content-Type: application/json" --data @SnowflakeSinkConfig.json http://localhost:8083/connectors
