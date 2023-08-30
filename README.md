# Transportation Hub

The Transportation Hub is RDI's internal data streaming and data warehousing project to test new tools and functionalities in those tools.  The main data streaming tool is Confluent Kafka and the main data warehousing tool is Snowflake.

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
   9. [staging tables](#staging-tables)

## Running

First an appid is required from trimet.  [Register](https://developer.trimet.org/appid/registration/) your contact information to get one.

Secondly an ssh key must be generated for communicating with snowflake. For directions on setting this up, consult the snowflake [reference](https://docs.snowflake.com/en/user-guide/key-pair-auth).  Note, the `ALTER USER` step must be performed by someone with `ACCOUNTADMIN` credentials. 

The main requirement for running the realtime pipeline is [docker desktop](https://www.docker.com/products/docker-desktop/) with [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) to run it from linux assuming a windows workstation. 
 
The realtime component of the pipeline is launched from a linux shell prompt as follows:
```
cd RealtimeStreaming
./sh/run.sh
```
This shell script will do the following:

1. Deploy all containers using docker compose and the `docker-compose.yml` file.
2. Setup kafka topics.
3. Initialize feeds to broker and schema registry.
4. Deploy ksql ETL transformations in lexicographic order of file name.
5. Deploy the Snowflake kafka connect sink.
6. Continuously run the datastreamer for each data feed.

## Overview

The architecture of the pipeline is as follows, descriptions for all components pictured follow:
![architecture](./imgs/transportation_hub_v2.png)

### Trimet API

The Transportation Hub warehouses data for Portland's local transit system, TriMet.  The starting point for data is the [GTFS api](https://developer.trimet.org/GTFS.shtml).  JSON/XML [endpoints](https://developer.trimet.org/ws_docs/) are listed on the api website.  A realtime [protobuf](https://www.transit.land/feeds/f-trimet~rt/) endpoint was chosen for the advantages of using a structured data format, and for ease of use in both downstream ETL and future evolution of this project.

The various locally deployed docker containers are depicted as squares.  The components that are deployed on Snowflake are shown in <span style="color:LightSkyBlue">blue</span>.  Objects that have visual components that can be accessed in the browser are shown in <span style="color:LightCoral">red</span>. 

### datastreamer

All the code written is [HttpRequest.java](RealtimeStreaming/src/main/java/com/resourcedata/transportationhub/realtime/HttpRequest.java).  The `com.google.transit.realtime` package contains generated code from the protobuf compiler.  The custom java application was written to consume data from the selected trimet api feed and push to kafka. The application is driven by command line arguments:

1. data feed (0,1, or 2) - Select which trimet feed is desired.
  * 0 - VehiclePositions
  * 1 - TripUpdate
  * 2 - FeedSpecAlerts
2. wait time in ms (integer) - enter the amount of time to wait between consecutive data requests.
3. write to file (boolean) - choose to write the protobuf binary to disk so that a sample can be obtained.  If there is more than one loop, each binary will be written and the last written binary will be saved.
4. number of loops (integer) - enter the number of data objects to grab, when `-1` is entered the program will run indefinitely. 

The java code first gets a protobuf data object using a supplied `appID` request parameter in its http request.  The returned payload is returned as an array of bytes. If the user requests to write the payload to a file, it will be written.  Thereafter, the message is deserialized as a `FeedMessage` type object, which is defined in the gtfs protobuf [specification](https://developers.google.com/transit/gtfs-realtime/reference).  Note that the generated Java code for the gtfs protobuf type is included and essential to deserializing.  If that java code must be re-generated, the latest Java SDK, latest version of `protoc` for linux and latest version of protobuf schema are all necessary.  The command for compiling protobuf in linux is 
```
protoc --java_out=$DST_DIR $SRC_DIR/<path to schema.proto>
```
Once the protobuf payload has been deserialized, it is then pushed by the `Producer` to kafka.  Note the configuration parameters `BOOTSTRAP_SERVERS_CONFIG` and `schema.registry.url`.  These are the locations of the broker and schema registry.  Currently this container is configured to be run in the host network.  That way it is able to access ports on the host.  That is why there is the following entry in the `docker-compose.yml` file:
```
network_mode: "host"
```
The preset command also given in the same file ensures that the container stays open indefinitely.  Normally containers terminate if there is not an active command in process.
```
command: ["tail", "-f", "/dev/null"]
```
The datastreamer is written as a maven package and is made to deploy into an alpine java docker container that contains both java runtimes and the sdk.  For more information, consult the `dockerfile_datastreamer` file.

### broker/schema-registry

The broker is the data storage layer of kafka.  Each separate data stream is stored in a durable queue.  When using structured data such as protobuf or avro, a schema registry is necessary to assist with serializing/deserializing data as well as evolving schema. The schema registry and broker work together to handle all read and write requests.  Each separate data queue is organized by topic.  The datastreamer container from above is a producer of data to kafka.  

### realtime-visualizer

The realtime-visualizer provides a user interface for displaying realtime data. The realtime-visualizer consists a React.js application which makes requests to the ksqldb-server, and plots returned information a Leaflet.js map. 

### ksqldb-server

ksql is kafka's most accessible, realtime ETL language. The ksqldb-server handles all ETL requests. 

### ksqldb-cli
The ksqldb-cli provides a cli for issuing ksql requests. 

### control-center
The control center provides a user interface for viewing everything happening in the kafka containers as well a way to supply ad-hoc configuration and ETL requests.

### connect
The kafka connect plugin is a suite of tools for connecting outside data sources as sinks and sources, places for sending and getting data respectively.  In our case, we are sending the data to snowflake.  The only customization we make to the regular kafka connect container is to install the snowflake connector by copying the jar file for snowflake connect app along with bouncycastle, which is needed for decrypting ssh passphrases.  The snowflake sink connector is configured using `SnowflakeSinkConfig.json`.

### staging tables
Select topics, specified in the "topics" field of the `SnowflakeSinkConfig.json` file are sent to snowflake staging tables.  A range of ETL jobs than transforms that input data to a form that is appropriate for BI reporting in the hub tables.

