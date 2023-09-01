package com.resourcedata.transportationhub.realtime;

import com.google.protobuf.InvalidProtocolBufferException;
import com.google.transit.realtime.GtfsRealtime;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer;
import org.apache.commons.io.FileUtils;
import org.apache.http.ConnectionClosedException;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;

public class DataGenerator {
    public Properties properties;
    public RequestParams requestParams;

    public DataGenerator(RequestParams requestParams){
        this.properties = buildProperties();
        this.requestParams = requestParams;

    }
    private static Properties buildProperties(){
        Properties properties = new Properties();
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        try(InputStream input = classLoader.getResourceAsStream("producer.properties")){
            properties.load(input);
        } catch (IOException ioError){
            ioError.printStackTrace(System.err);
            System.exit(1);
        }
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaProtobufSerializer.class);
        return properties;
    }
    public byte[] getHttpResponse(String link) throws IOException {
        HttpGet httpGet = new HttpGet(link);
        try {

            URI uri = new URIBuilder(httpGet.getURI())
                    .addParameter("appID", properties.getProperty("appID"))
                    .build();
            httpGet.setURI(uri);
        } catch (URISyntaxException e) {
            e.printStackTrace(System.err);
            System.exit(1);
        }
        httpGet.setHeader("Content-Type", "application/x-protobuf");
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            CloseableHttpResponse response = client.execute(httpGet);
            StatusLine statusLine = response.getStatusLine();
            final int statusCode = statusLine.getStatusCode();
            assert statusCode == HttpStatus.SC_OK;
            return EntityUtils.toByteArray(response.getEntity());
        }
    }
    public GtfsRealtime.FeedMessage generate(){
        try {
            byte[] response = getHttpResponse(requestParams.link);
            if(response == null) throw new IOException("no response");
            if (requestParams.fileWriteRequested) try {
                FileUtils.writeByteArrayToFile(new File("gtfs-rt-" + requestParams.name + ".bin"), response);
            } catch (IOException io){
                io.printStackTrace(System.err);
            }
            Thread.sleep(requestParams.waitTimeMs);
            return GtfsRealtime.FeedMessage.parseFrom(response);
        }
        catch (ConnectionClosedException err){
            err.printStackTrace(System.err);
            return null;
        }
        catch (IOException | InterruptedException e){
            e.printStackTrace(System.err);
            System.exit(1);
        }
       return null;
    }
}
