package com.resourcedata.transportationhub.realtime;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.Closeable;
import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

public class DataStreamer<T> implements Closeable {
    private final String topic;
    private final Producer<String, T> producer;
    public DataStreamer(final Producer<String, T> producer, final String topic){
        this.producer = producer;
        this.topic = topic;
    }
    public void produce(T message){
        if(message != null) {
            final ProducerRecord<String, T> producerRecord = new ProducerRecord<>(topic, topic, message);
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
    public static <T> void streamData(Stream<T> stream, Properties properties, String topic){
        try(Producer<String, T> producer = new KafkaProducer<>(properties)){
            final DataStreamer<T> dataStreamer = new DataStreamer<>(producer, topic);
            stream.forEach(dataStreamer::produce);
        }
    }

}
