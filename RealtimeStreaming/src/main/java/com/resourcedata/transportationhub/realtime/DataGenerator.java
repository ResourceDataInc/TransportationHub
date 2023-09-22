package com.resourcedata.transportationhub.realtime;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import com.google.transit.realtime.ResultSetAlert;
import com.google.transit.realtime.ResultSetVehicle;
import com.google.transit.realtime.ResultSetRoute.RouteSet.Route;
import com.google.transit.realtime.ResultSetRoute;
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
import java.util.LinkedList;
import java.util.List;
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
            URIBuilder uriBuilder = new URIBuilder(httpGet.getURI());
            URI uri = null;
            if(requestParams.dataClass.equals("ResultSetRoute")){
                uri = uriBuilder
                        .addParameter("appID", properties.getProperty("appID"))
                        .addParameter("dir","yes")
                        .addParameter("stops","yes")
                        .addParameter("json", "true")
                        .build();
            }
            else {
                uri = uriBuilder
                        .addParameter("appID", properties.getProperty("appID"))
                        .build();
            }
            httpGet.setURI(uri);
        } catch (URISyntaxException e) {
            e.printStackTrace(System.err);
            System.exit(1);
        }
        httpGet.setHeader("Content-Type", "application/x-protobuf");
        byte[] result = null;
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            CloseableHttpResponse response = client.execute(httpGet);
            StatusLine statusLine = response.getStatusLine();
            final int statusCode = statusLine.getStatusCode();
            assert statusCode == HttpStatus.SC_OK;
            result = EntityUtils.toByteArray(response.getEntity());
            return result;
        } catch (ConnectionClosedException err){
            err.printStackTrace(System.err);
        }
        return result;
    }
   private byte[] processResponse(){
        byte[] response = null;
        try {
            response = getHttpResponse(requestParams.link);
            if (requestParams.fileWriteRequested)
                FileUtils.writeByteArrayToFile(new File("gtfs-rt-" + requestParams.name + ".bin"), response);
            Thread.sleep(requestParams.waitTimeMs);
        }
        catch (Exception e){
            e.printStackTrace(System.err);
        }
        return response;
    }
    public FeedMessage generateProto(){
        FeedMessage message = null;
        try {
            byte[] response = processResponse();
            message = FeedMessage.parseFrom(response);
        }
        catch (Exception e){
            e.printStackTrace(System.err);
        }
        return message;
    }
    public ResultSetVehicle generateResultSetVehicle() {
        ResultSetVehicle resultSetVehicle = null;
        try {
            byte[] response = processResponse();
            resultSetVehicle = objectMapper.readValue(response, ResultSetVehicle.class);
        }
        catch(Exception e) {
            e.printStackTrace(System.err);
        }
        return resultSetVehicle;
    }
    public ResultSetAlert generateResultSetAlert() {
        ResultSetAlert resultSetAlert = null;
        try {
            byte[] response = processResponse();
            resultSetAlert = objectMapper.readValue(response, ResultSetAlert.class);
        }
        catch(Exception e) {
            e.printStackTrace(System.err);
        }
        return resultSetAlert;
    }
    private LinkedList<Route> existingRoutes;

    public Route generateRoute(){
        Route route = null;
        if(existingRoutes == null) {
            try {
                byte[] response = processResponse();
                ResultSetRoute resultSetRoute = objectMapper.readValue(response, ResultSetRoute.class);
                existingRoutes = resultSetRoute.resultSet.route;
                route = existingRoutes.pop();
            } catch (Exception e) {
                e.printStackTrace(System.err);
            }
        }
        else if(!existingRoutes.isEmpty()) route = existingRoutes.pop();
        else {
           System.exit(0);
        }
        return route;
    }
}