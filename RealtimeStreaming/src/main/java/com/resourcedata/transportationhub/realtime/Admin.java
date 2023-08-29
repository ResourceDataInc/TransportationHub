package com.resourcedata.transportationhub.realtime;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.ListTopicsResult;
import org.apache.kafka.clients.admin.NewTopic;

import java.util.*;
import java.util.concurrent.ExecutionException;

public class Admin {
    public static void createTopic(final Properties allProps, String topic) {
        try (final AdminClient client = AdminClient.create(allProps)) {
            ListTopicsResult listTopicsResult = client.listTopics();
            Set<String> existingTopics = listTopicsResult.names().get();
            if (!existingTopics.contains(topic)) {
                List<NewTopic> singleTopic = Arrays.asList(new NewTopic(topic, Optional.empty(), Optional.empty()));
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
}