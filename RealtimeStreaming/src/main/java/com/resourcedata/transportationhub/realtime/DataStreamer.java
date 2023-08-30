package com.resourcedata.transportationhub.realtime;

import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import org.apache.http.ConnectionClosedException;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.Closeable;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

public class DataStreamer implements Closeable {
    private final RequestParams requestParams;
    private final Producer<String, FeedMessage> producer;
    public static Service getService(int serviceSelect){
        switch (serviceSelect) {
            case 1 -> {
                return new Service("TripUpdate", "ws/V1");
            }
            case 2 -> {
                return new Service("FeedSpecAlerts", "ws/V1");
            }
            default -> {
                return new Service("VehiclePositions", "ws/gtfs");
            }
        }
    }
    public DataStreamer(final Producer<String, FeedMessage> producer, final RequestParams requestParams){
        this.producer = producer;
        this.requestParams = requestParams;
    }
    public void produce(FeedMessage message){
        final ProducerRecord<String, FeedMessage> producerRecord = new ProducerRecord<>(requestParams.name, requestParams.name, message);
        try {
            producer.send(producerRecord, (recordMetadata, exception) -> {

                if(exception != null){
                    System.err.println("An error occured in the producer");
                    exception.printStackTrace(System.err);
                }
            }).get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace(System.err);
            System.exit(1);
        }
    }
    public void close() { producer.close(); }
    public static void main(String[] args){
        int serviceSelect = Integer.parseInt(args[0]);
        int waitTimeMs = Integer.parseInt(args[1]);
        boolean fileWriteRequested = Boolean.parseBoolean(args[2]);
        int numLoops = Integer.parseInt(args[3]);

        Service service = getService(serviceSelect);

        RequestParams requestParams = new RequestParams(service, fileWriteRequested, waitTimeMs);
        DataGenerator dataGenerator = new DataGenerator(requestParams);
        Admin.createTopic(dataGenerator.properties, requestParams.name);
        Stream<FeedMessage> stream = Stream.generate(dataGenerator::generate);
        try(Producer<String, FeedMessage> producer = new KafkaProducer<>(dataGenerator.properties)){
            final DataStreamer dataStreamer = new DataStreamer(producer, requestParams);
            if (numLoops != -1)
                stream = stream.limit(numLoops);
            stream.forEach(dataStreamer::produce);
        }
    }
}
