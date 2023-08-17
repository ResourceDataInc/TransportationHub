package com.resourcedata.transportationhub.realtime;

import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

public class HttpRequest {
    public byte[] getResponse() throws URISyntaxException, IOException {
        HttpGet httpGet = new HttpGet("http://developer.trimet.org/ws/gtfs/VehiclePositions");
        URI uri = new URIBuilder(httpGet.getURI())
                .addParameter("appID", "1C3939B80D87BDB332D2D6318")
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
    public static void main(String[] args) throws URISyntaxException, IOException {
        HttpRequest request = new HttpRequest();
        byte[] response = request.getResponse();
    }
}
