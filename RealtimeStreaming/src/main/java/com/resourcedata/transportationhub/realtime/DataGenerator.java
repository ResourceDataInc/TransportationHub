package com.resourcedata.transportationhub.realtime;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import com.google.transit.realtime.ResultSetAlert;
import com.google.transit.realtime.ResultSetVehicle;
import io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializer;
import io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializer;
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
    public ObjectMapper objectMapper = new ObjectMapper();
    public DataGenerator(RequestParams requestParams){
        this.requestParams = requestParams;
        this.properties = buildProperties();
    }
    private Properties buildProperties(){
        Properties properties = new Properties();
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        try(InputStream input = classLoader.getResourceAsStream("producer.properties")){
            properties.load(input);
        } catch (IOException ioError){
            ioError.printStackTrace(System.err);
            System.exit(1);
        }
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        if(requestParams.dataClass.equals("GtfsRealtime")) {
            properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaProtobufSerializer.class);
        } else {
            properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaJsonSchemaSerializer.class);
        }
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
            byte[] result = EntityUtils.toByteArray(response.getEntity());
            return result;
        } catch (ConnectionClosedException err){
            err.printStackTrace(System.err);
            return null;
        }
    }
   private byte[] processResponse(){
        try {
            byte[] response = getHttpResponse(requestParams.link);
            if(response == null) return null;
            if (requestParams.fileWriteRequested) try {
                FileUtils.writeByteArrayToFile(new File("gtfs-rt-" + requestParams.name + ".bin"), response);
            } catch (IOException io){
                io.printStackTrace(System.err);
            }
            Thread.sleep(requestParams.waitTimeMs);
            return response;
        }
        catch (InvalidProtocolBufferException e){
            e.printStackTrace(System.err);
            return null;
        }
        catch (IOException | InterruptedException e){
            e.printStackTrace(System.err);
            System.exit(1);
        }
        return null;
    }
    public FeedMessage generateProto(){
        byte[] response = processResponse();
        try {
            return FeedMessage.parseFrom(response);
        }
        catch (InvalidProtocolBufferException e){
            e.printStackTrace(System.err);
        }
        return null;
    }
    public ResultSetVehicle generateResultSetVehicle() {
        byte[] response = processResponse();
        try {
            return objectMapper.readValue(response, ResultSetVehicle.class);
        }
        catch(IOException e) {
            e.printStackTrace(System.err);
        }
        return null;
    }
    public ResultSetAlert generateResultSetAlert() {
        byte[] response = processResponse();
        try {
            return objectMapper.readValue(response, ResultSetAlert.class);
        }
        catch(IOException e) {
            e.printStackTrace(System.err);
        }
        return null;
    }
}