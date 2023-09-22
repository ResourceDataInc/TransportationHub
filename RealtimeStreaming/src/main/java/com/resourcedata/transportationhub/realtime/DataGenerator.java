package com.resourcedata.transportationhub.realtime;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Properties;

public class DataGenerator {
    private final Properties properties;
    private final CliArgs cliArgs;
    private int numLoops;
    private final HttpGet request;
    private final LinkedList<Route> existingRoutes;
    private final ObjectMapper objectMapper = new ObjectMapper();
    public DataGenerator(CliArgs cliArgs, Properties properties){
        this.cliArgs = cliArgs;
        this.numLoops = cliArgs.numLoops;
        this.properties = properties;
        this.request = setupRequest();
        this.existingRoutes = new LinkedList<>();
    }
    private HttpGet setupRequest(){
        HttpGet httpGet = new HttpGet(cliArgs.link);
        try {
            URIBuilder uriBuilder = new URIBuilder(httpGet.getURI());
            URI uri = null;
            if(cliArgs.dataClass.equals("ResultSetRoute")){
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
        if(cliArgs.dataClass.equals("GtfsRealtime")) httpGet.setHeader("Content-Type", "application/x-protobuf");
        else httpGet.setHeader("Content-Type", "application/json");
        return httpGet;
    }
    private byte[] getHttpResponse() throws IOException {
        byte[] result = null;
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            CloseableHttpResponse response = client.execute(this.request);
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
            if(cliArgs.numLoops == -1 || this.numLoops > 0) {
                response = getHttpResponse();
                if (cliArgs.fileWriteRequested)
                    FileUtils.writeByteArrayToFile(new File("gtfs-rt-" + cliArgs.name + "-"+ this.numLoops +".bin"), response);
                Thread.sleep(cliArgs.waitTimeMs);
                if(cliArgs.numLoops != -1) this.numLoops--;
            } else {
                System.exit(0);
            }
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

    public Route generateRoute(){
        Route route = null;
        if(existingRoutes.isEmpty()) {
            try {
                byte[] response = processResponse();
                ResultSetRoute resultSetRoute = objectMapper.readValue(response, ResultSetRoute.class);
                existingRoutes.addAll(resultSetRoute.resultSet.route);
                route = existingRoutes.pop();
            } catch (Exception e) {
                e.printStackTrace(System.err);
            }
        }
        else route = existingRoutes.pop();
        return route;
    }
}