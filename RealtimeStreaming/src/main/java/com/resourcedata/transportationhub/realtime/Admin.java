package com.resourcedata.transportationhub.realtime;

import io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializer;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.ListTopicsResult;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ExecutionException;

public class Admin {
    public static void createTopic(final Properties allProps, String topic) {
        try (final AdminClient client = AdminClient.create(allProps)) {
            ListTopicsResult listTopicsResult = client.listTopics();
            Set<String> existingTopics = listTopicsResult.names().get();
            if (!existingTopics.contains(topic)) {
                List<NewTopic> singleTopic = List.of(new NewTopic(topic, Optional.empty(), Optional.empty()));
                client.createTopics(singleTopic).values().forEach((t, future) -> {
                    try {
                        future.get();
                    } catch (InterruptedException | ExecutionException e) {
                        e.printStackTrace(System.err);
                        System.exit(1);
                    }
                });
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace(System.err);
        }
    }
    public static Properties buildProperties(CliArgs cliArgs){
        Properties properties = new Properties();
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        try(InputStream input = classLoader.getResourceAsStream("producer.properties")){
            properties.load(input);
        } catch (IOException ioError){
            ioError.printStackTrace(System.err);
            System.exit(1);
        }
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        if(cliArgs.dataClass.equals("GtfsRealtime")) {
            properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaProtobufSerializer.class);
        } else {
            properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaJsonSchemaSerializer.class);
        }
        return properties;
    }
}