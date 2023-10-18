package com.resourcedata.transportationhub.realtime;
import com.google.common.io.Resources;
import com.google.transit.realtime.GtfsRealtime;
import com.google.transit.realtime.ResultSetRoute;
import okhttp3.HttpUrl;
import okhttp3.internal.ws.RealWebSocket;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.MockResponse;
import org.apache.http.ConnectionClosedException;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.HttpHostConnectException;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.apache.http.HttpStatus;
import org.apache.http.impl.client.HttpClients;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.apache.http.client.methods.HttpGet;
import org.mockito.MockitoAnnotations;
import com.google.transit.realtime.ResultSetAlert;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import okio.Okio;
import okio.Buffer;

import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

public class DataGeneratorTest {
    private static MockWebServer server;
    private GtfsStreamer gtfsStreamer;
    final PrintStream originalOut = System.out;
    final PrintStream originalErr = System.err;
    final ByteArrayOutputStream out = new ByteArrayOutputStream();
    final ByteArrayOutputStream err = new ByteArrayOutputStream();
    @BeforeEach
    public void setup() throws IOException {
        server = new MockWebServer();
        server.start();
        gtfsStreamer = new GtfsStreamer();
        gtfsStreamer.url = new GtfsStreamer.URL(server.url("/").toString(), "", "", "");
        gtfsStreamer.dataClass = DataClass.GtfsRealtime;
        out.reset();
        err.reset();
        System.setOut(new PrintStream(out));
        System.setErr(new PrintStream(err));
    }
    @Test
    public void badResponse() throws Exception {
        MockResponse mockResponse = new MockResponse();
        mockResponse.setResponseCode(HttpStatus.SC_BAD_REQUEST);
        server.enqueue(mockResponse);
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
            assertNull(dataGenerator.getHttpResponse());
        }
    }
    @Test
    public void closeConnection() throws Exception {
        server.close();
        MockResponse mockResponse = new MockResponse();
        mockResponse.setResponseCode(HttpStatus.SC_BAD_REQUEST);
        server.enqueue(mockResponse);
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
            var response = dataGenerator.getHttpResponse();
            assertNull(response);
            String errorMessage = err.toString();
            assertFalse(errorMessage.isEmpty());
        }
    }

    @Test
    public void closedConnection() throws Exception {
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)) {
            CloseableHttpClient client = spy(HttpClients.createDefault());
            dataGenerator.closeableHttpClient = client;
            doThrow(ConnectionClosedException.class).when(dataGenerator.closeableHttpClient).execute(dataGenerator.getRequest());
            var response = dataGenerator.getHttpResponse();
            assertNull(response);
            assertNotNull(dataGenerator.closeableHttpClient);
            assertNotSame(client, dataGenerator.closeableHttpClient);
            String errorMessage = err.toString();
            assertFalse(errorMessage.isEmpty());
        }
    }

    @Test
    public void goodResponse() throws Exception {
        String testBody = "{\"hello\": \"world\"}";
        MockResponse mockResponse = new MockResponse();
        mockResponse.setBody(testBody);
        mockResponse.setResponseCode(HttpStatus.SC_OK);
        server.enqueue(mockResponse);
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
            byte[] response = dataGenerator.getHttpResponse();
            String actual = new String(response, StandardCharsets.UTF_8);
            assertEquals(testBody, actual);
        }
    }

    @Test
    public void getProto() throws Exception {
        MockResponse mockResponse = new MockResponse();
        GtfsRealtime.FeedMessage feedMessageIn = GtfsRealtime.FeedMessage.newBuilder().setHeader(
                GtfsRealtime.FeedHeader.newBuilder().setGtfsRealtimeVersion("1").build()
        ).build();
        Buffer result = new Buffer();
        result.write(feedMessageIn.toByteArray());
        mockResponse.setBody(result);
        mockResponse.setResponseCode(HttpStatus.SC_OK);
        server.enqueue(mockResponse);
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
            var message = dataGenerator.generateProto();
            assertEquals(message, feedMessageIn);
        }
    }

    @Test
    public void badProto() throws Exception {
        MockResponse mockResponse = new MockResponse();
        Buffer result = new Buffer();
        mockResponse.setBody("hello");
        mockResponse.setResponseCode(HttpStatus.SC_OK);
        server.enqueue(mockResponse);
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
            assertNull(dataGenerator.generateProto());
            String errorMessage = err.toString();
            assertFalse(errorMessage.isEmpty());
        }
    }
    @Test
    public void getJsonGood() throws Exception {
        gtfsStreamer.dataClass = DataClass.ResultSetAlert;
        MockResponse mockResponse = new MockResponse();
        String expected = Resources.toString(Resources.getResource("sample_alerts.json"), StandardCharsets.UTF_8);
        mockResponse.setBody(expected);
        server.enqueue(mockResponse);
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
           var alert = dataGenerator.generateResultSetAlert();
        }
    }
    @Test
    public void getJsonBad() throws Exception {
        gtfsStreamer.dataClass = DataClass.ResultSetAlert;
        MockResponse mockResponse = new MockResponse();
        String expected = "{\"somefield:\" \"not-a-valid-alert\"}";
        mockResponse.setBody(expected);
        server.enqueue(mockResponse);
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
            assertNull(dataGenerator.generateResultSetAlert());
            String errorMessage = err.toString();
            assertFalse(errorMessage.isEmpty());
        }
    }

    @Test
    public void getRoutes() throws Exception {
        gtfsStreamer.dataClass = DataClass.ResultSetRoute;
        gtfsStreamer.numLoops=1;
        String expected = Resources.toString(Resources.getResource("sample_routes.json"), StandardCharsets.UTF_8);
        MockResponse mockResponse = new MockResponse();
        mockResponse.setBody(expected);
        server.enqueue(mockResponse);
        int routes=0;
        try(DataGenerator dataGenerator = new DataGenerator(gtfsStreamer)){
            ResultSetRoute.RouteSet.Route route = null;
            while(true){
                try {
                    dataGenerator.generateRoute();
                    routes++;
                } catch (DataGenerator.NoMoreDataException e){
                    assertEquals(routes, 87);
                    break;
                }
            }
        }
    }
    @AfterEach
    public void teardown() throws IOException {
        server.shutdown();
        System.setOut(originalOut);
        System.setErr(originalErr);
    }
}
