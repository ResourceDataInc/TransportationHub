package com.resourcedata.transportationhub.realtime;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import com.google.transit.realtime.ResultSetAlert;
import com.google.transit.realtime.ResultSetVehicle;
import com.google.transit.realtime.ResultSetRoute.RouteSet.Route;
import com.google.transit.realtime.ResultSetRoute;
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

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.Map;
import java.util.Objects;

public class DataGenerator implements AutoCloseable {
    private final GtfsStreamer cli;
    private int numLoops;
    private final HttpGet request;
    private final LinkedList<Route> existingRoutes;
    public CloseableHttpClient closeableHttpClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    public DataGenerator(GtfsStreamer cli){
        this.cli = cli;
        this.numLoops = cli.numLoops;
        this.request = setupRequest();
        this.existingRoutes = new LinkedList<>();
        this.closeableHttpClient = HttpClients.createDefault();
    }
    public HttpGet getRequest(){ return request; }
    private HttpGet setupRequest(){
        HttpGet httpGet = new HttpGet(cli.url.link);
        try {
            URIBuilder uriBuilder = new URIBuilder(httpGet.getURI());
            URI uri = null;
            if(cli.getParameters != null) {
                for (Map.Entry<String, String> entry : cli.getParameters.entrySet()) {
                    uriBuilder = uriBuilder.addParameter(entry.getKey(), entry.getValue());
                }
            }
            uri = uriBuilder.build();
            httpGet.setURI(uri);
        } catch (URISyntaxException e) {
            e.printStackTrace(System.err);
            System.exit(1);
        }
        if(Objects.requireNonNull(cli.dataClass) == DataClass.GtfsRealtime) httpGet.setHeader("Content-Type", "application/x-protobuf");
        else httpGet.setHeader("Content-Type", "application/json");
        return httpGet;
    }
    static class NoMoreDataException extends RuntimeException {
        public NoMoreDataException(String errorMessage){
            super(errorMessage);
        }
    }
    public byte[] getHttpResponse(){
        byte[] result = null;
        try (CloseableHttpResponse response = this.closeableHttpClient.execute(this.request)) {
            if (response != null){
                StatusLine statusLine = response.getStatusLine();
                final int statusCode = statusLine.getStatusCode();
                if(statusCode == HttpStatus.SC_OK) result = EntityUtils.toByteArray(response.getEntity());
            }
            return result;
        }
        catch (ConnectionClosedException err){
            err.printStackTrace(System.err);
            this.closeableHttpClient = HttpClients.createDefault();
        }
        catch (IOException e){
            e.printStackTrace(System.err);
        }
        return result;
    }

    @Override
    public void close() throws Exception {
        this.closeableHttpClient.close();
    }
    private byte[] processResponse() {
        byte[] response = null;
        if(cli.numLoops == -1 || this.numLoops > 0) {
            response = getHttpResponse();
            if (response == null) return null;
            try {
                if (cli.fileWriteRequested)
                    FileUtils.writeByteArrayToFile(new File("gtfs-rt-" + cli.url.service + "-" + this.numLoops + ".bin"), response);
                Thread.sleep(cli.waitTimeMs);
            }
            catch (IOException | InterruptedException e){
                e.printStackTrace(System.err);
            }
            if(cli.numLoops != -1) this.numLoops--;
        } else {
            throw new NoMoreDataException("started out with: "+cli.numLoops+" loops");
        }
        return response;
    }
    public FeedMessage generateProto() {
        FeedMessage message = null;
        try {
            byte[] response = processResponse();
            if (response == null) return null;
            message = FeedMessage.parseFrom(response);
        } catch (InvalidProtocolBufferException e){
            e.printStackTrace(System.err);
        }
        return message;
    }
    public ResultSetVehicle generateResultSetVehicle() {
        ResultSetVehicle resultSetVehicle = null;
        try {
            byte[] response = processResponse();
            if (response == null) return null;
            resultSetVehicle = objectMapper.readValue(response, ResultSetVehicle.class);
        } catch (IOException e){
            e.printStackTrace(System.err);
        }
        return resultSetVehicle;
    }
    public ResultSetAlert generateResultSetAlert() {
        ResultSetAlert resultSetAlert = null;
        try{
            byte[] response = processResponse();
            if (response == null) return null;
            resultSetAlert = objectMapper.readValue(response, ResultSetAlert.class);
        } catch (IOException e){
            e.printStackTrace(System.err);
        }
        return resultSetAlert;
    }

    public Route generateRoute() {
        Route route = null;
        if(existingRoutes.isEmpty()) {
            byte[] response = processResponse();
            if (response == null) return null;
            try {
                ResultSetRoute resultSetRoute = objectMapper.readValue(response, ResultSetRoute.class);
                existingRoutes.addAll(resultSetRoute.resultSet.route);
                route = existingRoutes.pop();
            }
            catch (IOException e){
               e.printStackTrace(System.err);
            }
        }
        else route = existingRoutes.pop();
        return route;
    }
}