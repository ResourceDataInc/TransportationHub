#!/usr/bin/env bash

APPID=<enter your app id here>
BOOTSTRAP_SERVERS=broker:29092
SCHEMA_REGISTRY=http://schema-registry:8081
KSQL_DIR=ksql/trimet

function startup_containers(){
    docker compose up -d
}

function set_short_term_broker_data_retention(){
    docker exec broker kafka-configs --bootstrap-server broker:9092 -entity-type brokers --entity-default --alter --add-config log.retention.ms=36000000
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
    docker exec broker kafka-topics --create --topic Routes --bootstrap-server broker:9092 --replication-factor 1 partitions 1
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Stops --property \"parse.key=true\" < /shared-data/stops.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Calendar --property \"parse.key=true\" < /shared-data/calendar.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic CalendarDates --property \"parse.key=true\" < /shared-data/calendar_dates.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Shapes --property \"parse.key=true\" < /shared-data/shapes.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Trips --property \"parse.key=true\" < /shared-data/trips.kafka.txt"
    docker exec broker bash -c "kafka-console-producer --bootstrap-server broker:9092 --topic Routes --property \"parse.key=true\" < /shared-data/routes.kafka.txt"
}


function stream_dynamic_data {
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url https://developer.trimet.org/ws/gtfs/VehiclePositions --get-parameters appID=$APPID --data-class GtfsRealtime --topic VehiclePositions &
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url https://developer.trimet.org/ws/V1/TripUpdate --get-parameters appID=$APPID --data-class GtfsRealtime  --topic TripUpdate &
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url https://developer.trimet.org/ws/V1/FeedSpecAlerts --get-parameters appID=$APPID --data-class GtfsRealtime --topic FeedSpecAlerts &
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url https://developer.trimet.org/ws/v2/vehicles --get-parameters appID=$APPID --data-class ResultSetVehicle --topic vehicles &
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url https://developer.trimet.org/ws/v2/alerts --get-parameters appID=$APPID --data-class ResultSetAlert --topic alerts &
    docker exec datastreamer java -jar /javafiles/target/RealtimeStreaming-jar-with-dependencies.jar --bootstrap-servers broker:29092 --schema-registry http://schema-registry:8081 --url https://developer.trimet.org/ws/V1/routeConfig --get-parameters appID=${APPID},dir=yes,stops=yes,json=true --data-class ResultSetRoute -n 1 --topic routeConfig
}


function setup_ksql(){
    for f in ${KSQL_DIR}/*.sql; do
    docker cp $f ksqldb-cli:/home/appuser
    rawfile=`basename $f`
    docker exec ksqldb-cli ksql http://ksqldb-server:8088 -f $rawfile
    done
}

alias ksql="docker exec -it ksqldb-cli ksql http://ksqldb-server:8088"

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
