import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import com.google.transit.realtime.*;
import com.google.common.io.Resources;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.Assert.assertEquals;

public class JsonSchemaTest {
    @Test
    public void alerts_serde() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String expected = Resources.toString(Resources.getResource("sample_alerts.json"), StandardCharsets.UTF_8);
        ResultSetAlert resultSetAlert = objectMapper.readValue(expected, ResultSetAlert.class);
        String actual = objectMapper.writeValueAsString(resultSetAlert);
        // Files.writeString(Path.of("src/test/resources/sample_alerts_right.json"), actual);
        assertEquals(expected, actual);
    }
    @Test
    public void routes_serde() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String expected = Resources.toString(Resources.getResource("sample_routes.json"), StandardCharsets.UTF_8);
        ResultSetRoute resultSetRoute = objectMapper.readValue(expected, ResultSetRoute.class);
        String actual = objectMapper.writeValueAsString(resultSetRoute);
        // Files.writeString(Path.of("src/test/resources/sample_routes_right.json"), actual);
        assertEquals(expected, actual);
    }
    @Test
    public void vehicles_serde() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String expected = Resources.toString(Resources.getResource("sample_vehicles.json"), StandardCharsets.UTF_8);
        ResultSetVehicle resultSetVehicle = objectMapper.readValue(expected, ResultSetVehicle.class);
        String actual = objectMapper.writeValueAsString(resultSetVehicle);
        // Files.writeString(Path.of("src/test/resources/sample_vehicles_right.json"), actual);
        assertEquals(expected, actual);
    }
}
