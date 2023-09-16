#!/usr/bin/env bash

function startup_containers(){
    docker-compose up -d
}

function post_static_data(){ 
    docker exec datastreamer wget https://developer.trimet.org/schedule/gtfs.zip
    docker exec datastreamer unzip gtfs.zip -d gtfs
    docker cp py/gtfs_script.py datastreamer:/javafiles
    docker exec datastreamer sh -c "./gtfs_script.py"
    docker exec datastreamer sh -c " mv *.kafka.txt /shared-data"
    docker exec broker kafka-topics --create --topic Stops --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic Calendar --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic CalendarDates --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic Shapes --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic Trips --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Stops --property \"parse.key=true\" < /shared-data/stops.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Calendar --property \"parse.key=true\" < /shared-data/calendar.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic CalendarDates --property \"parse.key=true\" < /shared-data/calendar_dates.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Shapes --property \"parse.key=true\" < /shared-data/shapes.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Trips --property \"parse.key=true\" < /shared-data/trips.kafka.txt"
}


function stream_dynamic_data(){
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 0 1000 false -1 &
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 1 1000 false -1 &
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar 2 1000 false -1 &
}

function setup_ksql(){
    for f in ksql/*.sql; do
    docker cp $f ksqldb-cli:/home/appuser
    rawfile=`basename $f`
    docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f $rawfile
    done
}

function connect_snowflake(){
    docker cp SnowflakeSinkConfig.json connect:/home/appuser
    docker exec connect curl -X POST -H "Content-Type: application/json" --data @SnowflakeSinkConfig.json http://localhost:8083/connectors
}

function connect_s3(){
    docker cp S3SinkConfig.json connect:/home/appuser
    docker exec connect curl -X POST -H "Content-Type: application/json" --data @S3SinkConfig.json http://localhost:8083/connectors
}

startup_containers
sleep 80
post_static_data
stream_dynamic_data
sleep 10
setup_ksql
connect_snowflake
connect_s3

