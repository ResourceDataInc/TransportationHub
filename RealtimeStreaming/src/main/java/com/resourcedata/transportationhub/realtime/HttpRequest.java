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
import java.util.Map;
import java.util.HashMap;
class Service {
    public String name;
    public String link;
    public Service(String name, String link) {
        this.name = name;
        this.link = "http://developer.trimet.org/"+link+"/"+name;
    }
}
public class HttpRequest {
    public Map<Integer, Service> services;
    public HttpRequest() {
        services = new HashMap<>();
        services.put(0, new Service("VehiclePositions", "ws/gtfs"));
        services.put(1, new Service("TripUpdate", "ws/V1"));
        services.put(2, new Service("FeedSpecAlerts", "ws/V1"));
    }
    public byte[] getResponse(String link) throws URISyntaxException, IOException {
        HttpGet httpGet = new HttpGet(link);
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
    public static void main(String[] args) throws ExecutionException, InterruptedException {

        int waitTimeMs = Integer.parseInt(args[1]);
        boolean write_to_file = Boolean.parseBoolean(args[2]);
        int numLoops = Integer.parseInt(args[3]);
        if(numLoops == -1) numLoops = Integer.MAX_VALUE;
        HttpRequest request = new HttpRequest();
        Service service = request.services.get(Integer.parseInt(args[0]));

        //run ten times, then stop
        for(int i=0; i < numLoops; i++){
            // get data
            try {
                byte[] response = request.getResponse(service.link);
                if (write_to_file) FileUtils.writeByteArrayToFile(new File("gtfs-rt-" + service.name + ".bin"), response);

                //serialize data
                FeedMessage msg = FeedMessage.parseFrom(response);

                // set kafka producer configs
                Properties props = new Properties();
                props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
                props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                        "org.apache.kafka.common.serialization.StringSerializer");
                props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                        "io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer");
                props.put("schema.registry.url", "http://127.0.0.1:8081");

                Producer<String, FeedMessage> producer = new KafkaProducer<>(props);
                ProducerRecord<String, FeedMessage> record
                        = new ProducerRecord<>(service.name, service.name, msg);
                producer.send(record).get();
                producer.close();
                // wait until going again
                Thread.sleep(waitTimeMs);
            } catch (Exception e){
                System.out.println(e);
            }
        }
    }
}
