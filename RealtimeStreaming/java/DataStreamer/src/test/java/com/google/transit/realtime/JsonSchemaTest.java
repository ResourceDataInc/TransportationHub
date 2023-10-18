package com.google.transit.realtime;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import com.google.common.io.Resources;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class JsonSchemaTest {
    @Test
    public void alertsSerde() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String expected = Resources.toString(Resources.getResource("sample_alerts.json"), StandardCharsets.UTF_8);
        ResultSetAlert resultSetAlert = objectMapper.readValue(expected, ResultSetAlert.class);
        String actual = objectMapper.writeValueAsString(resultSetAlert);
        // Files.writeString(Path.of("src/test/resources/sample_alerts_right.json"), actual);
        assertEquals(expected, actual);
    }
    @Test
    public void routesSerde() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String expected = Resources.toString(Resources.getResource("sample_routes.json"), StandardCharsets.UTF_8);
        ResultSetRoute resultSetRoute = objectMapper.readValue(expected, ResultSetRoute.class);
        String actual = objectMapper.writeValueAsString(resultSetRoute);
        // Files.writeString(Path.of("src/test/resources/sample_routes_right.json"), actual);
        assertEquals(expected, actual);
    }
    @Test
    public void vehiclesSerde() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String expected = Resources.toString(Resources.getResource("sample_vehicles.json"), StandardCharsets.UTF_8);
        ResultSetVehicle resultSetVehicle = objectMapper.readValue(expected, ResultSetVehicle.class);
        String actual = objectMapper.writeValueAsString(resultSetVehicle);
        // Files.writeString(Path.of("src/test/resources/sample_vehicles_right.json"), actual);
        assertEquals(expected, actual);
    }
}
