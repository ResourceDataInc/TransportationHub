#!/usr/bin/env bash

BOOTSTRAP_SERVERS=broker:29092
SCHEMA_REGISTRY=http://schema-registry:8081
KSQL_DIR=ksql/community_transit

function startup_containers(){
    docker compose up -d
}

function set_short_term_broker_data_retention(){
    docker exec broker kafka-configs --bootstrap-server broker:9092 -entity-type brokers --entity-default --alter --add-config log.retention.ms=36000000
}

function post_static_data(){ 
    docker exec datastreamer wget https://www.communitytransit.org/docs/default-source/open-data/gtfs/current.zip?sfvrsn=988306d7_30 -O gtfs.zip
    docker exec datastreamer unzip gtfs.zip -d gtfs
    docker cp py/gtfs_script.py datastreamer:/javafiles
    docker exec datastreamer sh -c "./gtfs_script.py"
    docker exec datastreamer sh -c " mv *.kafka.txt /shared-data"
    docker exec broker kafka-topics --create --topic Stops --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic Calendar --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic CalendarDates --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic Shapes --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic Trips --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker kafka-topics --create --topic Routes --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Stops --property \"parse.key=true\" < /shared-data/stops.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Calendar --property \"parse.key=true\" < /shared-data/calendar.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic CalendarDates --property \"parse.key=true\" < /shared-data/calendar_dates.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Shapes --property \"parse.key=true\" < /shared-data/shapes.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Trips --property \"parse.key=true\" < /shared-data/trips.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Routes --property \"parse.key=true\" < /shared-data/routes.kafka.txt"
}

function stream_dynamic_data {
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url http://s3.amazonaws.com/commtrans-realtime-prod/vehiclepositions.pb --data-class GtfsRealtime  --topic VehiclePositions & 
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url http://s3.amazonaws.com/commtrans-realtime-prod/tripupdates.pb --data-class GtfsRealtime --topic TripUpdate & 
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url http://s3.amazonaws.com/commtrans-realtime-prod/alerts.pb --data-class GtfsRealtime --topic FeedSpecAlerts & 
}

alias ksql="docker exec -it ksqldb-cli ksql http://ksqldb-server:8088"

function setup_ksql(){
    for f in ${KSQL_DIR}/*.sql; do
    docker cp -L $f ksqldb-cli:/home/appuser
    rawfile=`basename $f`
    docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f $rawfile
    done
}

function connect_snowflake_continuous(){
    docker cp SnowflakeSinkConfig.json connect:/home/appuser
    docker exec connect curl -X POST -H "Content-Type: application/json" --data @SnowflakeSinkConfig.json http://localhost:8083/connectors
}

function connect_snowflake_oneshot(){
    docker cp SnowflakeSingleSinkConfig.json connect:/home/appuser
    docker exec connect curl -X POST -H "Content-Type: application/json" --data @SnowflakeSingleSinkConfig.json http://localhost:8083/connectors
}

function connect_s3(){
    docker cp S3SinkConfig.json connect:/home/appuser
    docker exec connect curl -X POST -H "Content-Type: application/json" --data @S3SinkConfig.json http://localhost:8083/connectors
}

function do_all(){
    startup_containers
    sleep 80
    post_static_data
    stream_dynamic_data
    sleep 10
    setup_ksql
}
