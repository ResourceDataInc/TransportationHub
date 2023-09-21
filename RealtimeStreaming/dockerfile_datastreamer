FROM ubuntu:23.10
RUN mkdir /javafiles
WORKDIR /javafiles
RUN apt update
RUN apt install maven openjdk-20-jdk python3 wget zip python3-pip python3-pandas iputils-ping -y
COPY pom.xml /javafiles/pom.xml
COPY src/ /javafiles/src/
RUN wget https://github.com/protocolbuffers/protobuf/releases/download/v24.3/protoc-24.3-linux-x86_64.zip
RUN unzip protoc-24.3-linux-x86_64.zip -d /usr/local
RUN wget -P /javafiles/src/main/resources https://raw.githubusercontent.com/google/transit/master/gtfs-realtime/proto/gtfs-realtime.proto
RUN mvn clean test generate-sources package
RUN chmod 755 target/RealtimeStreaming-jar-with-dependencies.jar
RUN mkdir gtfs
