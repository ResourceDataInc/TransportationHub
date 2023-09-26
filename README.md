# Transportation Hub

The Transportation Hub is RDI's internal data streaming and data warehousing project to test new tools and functionalities in those tools.  Several technologies are used here including:

* Docker Compose - bringing up multiple containers on the same local network
* WSL - linux on Windows
* Shell Scripts - running commands on containers
* Python - small text file dataframe operations
* Java - data requests on trimet API and data writes to kafka broker 
* Confluent
  * Kafka Broker - durable queues and stream processing
  * Schema Registry - track schema's for data inputs, also used for serializing and deserializing binary data 
  * Control Center - viewing all streaming operations 
  * Ksqldb - streaming ETL
  * Connect - configuring output data destinations
* React - javascript web development framework
* React Leaflet - react components for leaflet maps
* Snowflake - data warehouse operations
* DBT - framework for writing ETL operations in Snowflake
* AWS 
  * S3 - storing data on the cloud
  * Glue - data catalogs and ETL jobs
  * Athena - moderate sized queries

# Table of Contents
1. [Running](#topic-1)
2. [Overview](#overview)
3. Components
   1. [Trimet API](#trimet-api)
   2. [datastreamer](#datastreamer)
   3. [broker/schema-registry](#broker-schema-registry)
   4. [realtime-visualizer](#realtime-visualizer)
   5. [ksqldb-server](#ksqldb-server)
   6. [ksqldb-cli](#ksqldb-cli)
   7. [control-center](#control-center)
   8. [connect](#connect)
   9. [snowflake](#snowflake)
   10. [aws](#aws)

## Running

1. An appid is required from trimet.  [Register](https://developer.trimet.org/appid/registration/) your contact information to get one.  They will send the appid in an email.
2. Enter the appid obtained in `src/main/resources/producer.properties`.
3. An ssh key must be generated for communicating with snowflake. For directions on setting this up, consult the snowflake [reference](https://docs.snowflake.com/en/user-guide/key-pair-auth).  Note, the `ALTER USER` step must be performed by someone with `ACCOUNTADMIN` credentials.  The ssh key will factor into correct settings for the various snowflake connect configurations (SnowflakeSinkConfig.json, SnowflakeSingleSinkConfig.json).  Additionally, to configure the S3 connector for kafka (S3SinkConfig.json), aws access credentials, namely `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` must be obtained. 
4. The main requirement for running the realtime pipeline is [docker desktop](https://www.docker.com/products/docker-desktop/) with [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) to run it from linux assuming a windows workstation. 
 
The realtime component of the pipeline is launched from a linux shell prompt as follows:
```
cd RealtimeStreaming
source sh/run.sh
do_all
```
If you want to run select sections of the startup sequence, look in `sh/run.sh`.
This shell script will do the following:

1. Deploy all containers using docker according to the `docker-compose.yml` file.
2. Add static data sets.
3. Setup kafka topics.
4. Initialize feeds to broker and schema registry.
5. Deploy ksql ETL transformations in lexicographic order of file name.
6. Deploy the Snowflake kafka connect sink for continuous feeds.
7. Deploy the Snowflake kafka connect sink for one time feeds.
8. Deploy the S3 kafka connect sink.

The containers can be stopped and associated data deleted with
```
./sh/stop.sh
```

## Overview

The architecture of the pipeline is as follows, descriptions for all components pictured follow:
![architecture](./Documentation/imgs/transportation_hub_v2.png)  Most discussion here will relate to files found in the `RealtimeStreaming` directory.

### Trimet API

The Transportation Hub warehouses data for Portland's local transit system, TriMet.  The starting point for data is the [GTFS api](https://developer.trimet.org/GTFS.shtml).  [json](https://developer.trimet.org/ws_docs/) and [protobuf](https://www.transit.land/feeds/f-trimet~rt/) are streamed and buffered in this project.  

The various locally deployed docker containers are depicted as squares.  The components that are deployed on Snowflake are shown in blue.  Containers that have visual components that can be accessed in the browser are shown in red.  The yellow elements are in AWS.

### datastreamer

All the custom code written is in the `com.resourcedata.transportationhub.realtime` package.  The `com.google.transit.realtime` package contains POJO's that are used to send Json with JsonSchema. Generated sources are produced from protobuf using the respective maven plugin.  The custom java application was written to consume data from the selected trimet api feed and push to kafka. The application is driven by command line arguments.

The java code first gets a json or protobuf data object using a supplied `appID` request parameter in its http request.  The returned payload is returned as an array of bytes. If the user requests to write the payload to a file, it will be written.  Thereafter, the message is deserialized as a `FeedMessage` type object in the protobuf case defined in the gtfs protobuf [specification](https://developers.google.com/transit/gtfs-realtime/reference).  In the json case, the message is deserialized using the various classes defined in `com.google.transit.realtime`.
Once the protobuf payload has been deserialized, it is then pushed by the `Producer` to kafka.  Note the configuration parameters `BOOTSTRAP_SERVERS_CONFIG` and `schema.registry.url` in `producer.properties`.  These are the locations of the broker and schema registry.  The port for the broker is set to the listener port `29092` which is different than the host network port `9092`.  If `9092` is used, communication with the broker will not occur.  
The preset command given in the `dockerfile_datastreamer` ensures that the container stays open indefinitely.  Normally containers terminate if there is not an active command in process.
```
command: ["tail", "-f", "/dev/null"]
```
The datastreamer is written as a maven package and is made to deploy into an Ubuntu java docker container that contains both java runtimes and the sdk.  For more information, consult the `dockerfile_datastreamer` file.

### broker/schema-registry

The broker is the data storage layer of kafka.  Each separate data stream is stored in a durable queue.  When using structured data such as json schema, protobuf, or avro, a schema registry is necessary to assist with serializing/deserializing data as well as evolving schema. The schema registry and broker work together to handle all read and write requests.  Each separate data queue is organized by topic.  The datastreamer container from above is a producer of data to kafka.  

### realtime-visualizer

The realtime-visualizer provides a user interface for displaying realtime data. The realtime-visualizer consists of a React.js application that makes requests to the ksqldb-server, and plots returned information in a Leaflet.js map.  The `ksqldb-server` and ultimately the kafka broker backing it provides data to the realtime visaulizer. In a locally deployed version, it can be seen on `https://localhost:8090`.

### ksqldb-server

ksql is kafka's most accessible, realtime ETL language. The ksqldb-server handles all ETL requests. 

![streaming ETL](./Documentation/imgs/transportation_hub_streaming_etl.png)

### ksqldb-cli
The ksqldb-cli provides a cli for issuing ksql requests. 

### control-center
The control center provides a user interface for viewing everything happening in the kafka containers as well a way to supply ad-hoc configuration and ETL requests.  The control center can be accessed on a local container deployment at `https://localhost:9021`.

![control center](./Documentation/imgs/control_center.png)

### connect
The kafka connect plugin is a suite of tools for connecting outside data sources as sinks and sources, places for sending and getting data respectively.  In our case, we are sending the data to snowflake and S3.  The only customization we make to the regular kafka connect container is to install the snowflake connector by copying the jar file for snowflake connect app along with bouncycastle, which is needed for decrypting ssh passphrases.  The snowflake sink connector is configured using `SnowflakeSinkConfig.json`.

### snowflake
Select topics, specified in the "topics" field of the `SnowflakeSinkConfig.json` file are sent to snowflake staging tables.  S3 data can also be used as inputs for Snowflake data.  A range of ETL jobs than transforms that input data to a form that is appropriate for BI reporting in the hub tables.  The ETL sql code for Snowflake is defined in the `DBT` directory.

### aws

The second destination we will sending data is S3 on AWS.  We will be using S3 as a data lake.  What differentiates a data lake from a data warehouse such as snowflake is transparent use of data on S3, allowing for heterogenous data sources natively.  Data lakes, do not out of the box provide ACID transactions, but in a append only/write only scenario this is not a major downside (Further technologies such as Delta Lake and Apache Iceberg can be leveraged for these purposes).  A further advantage for a data lake is usually less cost as the management of data is less.  In our case, data is buffered into S3 using the S3SinkConnector provided by confluent.  The settings for buffering are controlled in `S3SinkConfig.json`.  In order to surface data for use in analytics and ETL jobs, the AWS Glue crawler must be run over S3 periodically.  Initially, the crawler will import the schema from parquet files, and infer a schema from csv files.  The crawler will add data as tables to the Glue database.  Additionally, as new partitions are added, the crawler will add those additional partitions.  Up to a moderate level of complexity, Athena is a good tool of choice for running queries over this table data.  Once materialization of transformations is desired for much more complicated usecases, a Glue ETL job can be run with code written in Spark. 
