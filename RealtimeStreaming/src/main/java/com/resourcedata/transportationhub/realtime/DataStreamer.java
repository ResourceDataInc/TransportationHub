package com.resourcedata.transportationhub.realtime;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import com.google.transit.realtime.ResultSetAlert;
import com.google.transit.realtime.ResultSetRoute.RouteSet.Route;
import com.google.transit.realtime.ResultSetVehicle;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.Closeable;
import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

public class DataStreamer<T> implements Closeable {
    private final RequestParams requestParams;
    private final Producer<String, T> producer;
    public DataStreamer(final Producer<String, T> producer, final RequestParams requestParams){
        this.producer = producer;
        this.requestParams = requestParams;
    }
    public void produce(T message){
        if(message != null) {
            final ProducerRecord<String, T> producerRecord = new ProducerRecord<>(requestParams.name, requestParams.name, message);
            try {
                producer.send(producerRecord, (recordMetadata, exception) -> {

                    if (exception != null) {
                        System.err.println("An error occured in the producer");
                        exception.printStackTrace(System.err);
                    }
                }).get();
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace(System.err);
                System.exit(1);
            }
        }
    }
    public void close() { producer.close(); }
    public static <T> void streamData(Stream<T> stream, Properties properties, RequestParams requestParams){
        try(Producer<String, T> producer = new KafkaProducer<>(properties)){
            final DataStreamer<T> dataStreamer = new DataStreamer<>(producer, requestParams);
            stream.forEach(dataStreamer::produce);
        }
    }
    public static void main(String[] args){
        String baseUrl = args[0];
        String ext = args[1];
        String name = args[2];
        String dataClass = args[3];
        int waitTimeMs = Integer.parseInt(args[4]);
        boolean fileWriteRequested = Boolean.parseBoolean(args[5]);
        int numLoops = Integer.parseInt(args[6]);

        RequestParams requestParams = new RequestParams(baseUrl, ext, name, dataClass, waitTimeMs, fileWriteRequested, numLoops);
        DataGenerator dataGenerator = new DataGenerator(requestParams);
        Admin.createTopic(dataGenerator.properties, requestParams.name);

        switch(requestParams.dataClass){
            case "GtfsRealtime":
                Stream<FeedMessage> protoStream = Stream.generate(dataGenerator::generateProto);
                streamData(protoStream, dataGenerator.properties, requestParams);
                break;
            case "ResultSetVehicle":
                Stream<ResultSetVehicle> jsonVehicleStream = Stream.generate(dataGenerator::generateResultSetVehicle);
                streamData(jsonVehicleStream, dataGenerator.properties, requestParams);
                break;
            case "ResultSetAlert":
                Stream<ResultSetAlert> jsonAlertStream = Stream.generate(dataGenerator::generateResultSetAlert);
                streamData(jsonAlertStream, dataGenerator.properties, requestParams);
                break;
            case "ResultSetRoute":
                Stream<Route> jsonRouteStream = Stream.generate(dataGenerator::generateRoute);
                streamData(jsonRouteStream, dataGenerator.properties, requestParams);
                break;
            default:
                System.err.println("No such class "+requestParams.dataClass+" defined");
                break;
        }
    }
}
