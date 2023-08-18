#!/usr/bin/env bash
docker exec broker kafka-topics --create --topic vehicle-positions --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic trip-updates --bootstrap-server broker:9092 --replication-factor 1 partitions 1
docker exec broker kafka-topics --create --topic feed-spec-alerts --bootstrap-server broker:9092 --replication-factor 1 partitions 1
