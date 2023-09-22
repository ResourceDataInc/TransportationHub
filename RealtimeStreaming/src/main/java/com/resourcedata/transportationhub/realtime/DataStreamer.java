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
    private final CliParams cliParams;
    private final Producer<String, T> producer;
    public DataStreamer(final Producer<String, T> producer, final CliParams cliParams){
        this.producer = producer;
        this.cliParams = cliParams;
    }
    public void produce(T message){
        if(message != null) {
            final ProducerRecord<String, T> producerRecord = new ProducerRecord<>(cliParams.name, cliParams.name, message);
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
    public static <T> void streamData(Stream<T> stream, Properties properties, CliParams cliParams){
        try(Producer<String, T> producer = new KafkaProducer<>(properties)){
            final DataStreamer<T> dataStreamer = new DataStreamer<>(producer, cliParams);
            stream.forEach(dataStreamer::produce);
        }
    }
    public static void main(String[] args){
        CliParams cliArgs = new CliParams();
        cliArgs.baseUrl = args[0];
        cliArgs.ext = args[1];
        cliArgs.name = args[2];
        cliArgs.dataClass = args[3];
        cliArgs.waitTimeMs = Integer.parseInt(args[4]);
        cliArgs.fileWriteRequested = Boolean.parseBoolean(args[5]);
        cliArgs.numLoops = Integer.parseInt(args[6]);
        cliArgs.makeLink();

        Properties properties = Admin.buildProperties(cliArgs);
        DataGenerator dataGenerator = new DataGenerator(cliArgs, properties);
        Admin.createTopic(properties, cliArgs.name);

        switch(cliArgs.dataClass){
            case "GtfsRealtime":
                Stream<FeedMessage> protoStream = Stream.generate(dataGenerator::generateProto);
                streamData(protoStream, properties, cliArgs);
                break;
            case "ResultSetVehicle":
                Stream<ResultSetVehicle> jsonVehicleStream = Stream.generate(dataGenerator::generateResultSetVehicle);
                streamData(jsonVehicleStream, properties, cliArgs);
                break;
            case "ResultSetAlert":
                Stream<ResultSetAlert> jsonAlertStream = Stream.generate(dataGenerator::generateResultSetAlert);
                streamData(jsonAlertStream, properties, cliArgs);
                break;
            case "ResultSetRoute":
                Stream<Route> jsonRouteStream = Stream.generate(dataGenerator::generateRoute);
                streamData(jsonRouteStream, properties, cliArgs);
                break;
            default:
                System.err.println("No such class "+cliArgs.dataClass+" defined");
                break;
        }
    }
}
