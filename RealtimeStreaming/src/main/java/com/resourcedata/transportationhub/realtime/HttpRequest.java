package com.resourcedata.transportationhub.realtime;

import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.commons.io.FileUtils;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;
import java.util.concurrent.ExecutionException;

public class HttpRequest {
    public byte[] getResponse() throws URISyntaxException, IOException {
        String vehiclePositionsUrl = "http://developer.trimet.org/ws/gtfs/VehiclePositions";
        String tripUpdatesUrl = "http://developer.trimet.org/ws/V1/TripUpdate";
        String feedSpecAlertsUrl = "http://developer.trimet.org/ws/V1/FeedSpecAlerts";
        HttpGet httpGet = new HttpGet(vehiclePositionsUrl);
        URI uri = new URIBuilder(httpGet.getURI())
                .addParameter("appID", "***REMOVED***")
                .build();
        httpGet.setURI(uri);
        httpGet.setHeader("Content-Type", "application/x-protobuf");
        try (CloseableHttpClient client = HttpClients.createDefault()){
            CloseableHttpResponse response = client.execute(httpGet);
            StatusLine statusLine = response.getStatusLine();
            final int statusCode = statusLine.getStatusCode();
            assert statusCode == HttpStatus.SC_OK;
            return EntityUtils.toByteArray(response.getEntity());
        }
    }
    public static void main(String[] args) throws URISyntaxException, IOException, ExecutionException, InterruptedException {
        HttpRequest request = new HttpRequest();
        byte[] response = request.getResponse();
        FileUtils.writeByteArrayToFile(new File("gtfs-rt-vehicle-positions"), response);
        FeedMessage msg = FeedMessage.parseFrom(response);
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "0.0.0.0:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                "io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer");
        props.put("schema.registry.url", "http://0.0.0.0:8081");
        Producer<String, FeedMessage> producer = new KafkaProducer<>(props);
        ProducerRecord<String, FeedMessage> record
                = new ProducerRecord<>("vehicle-positions", "msg", msg);
        producer.send(record).get();
        producer.close();
    }
}
