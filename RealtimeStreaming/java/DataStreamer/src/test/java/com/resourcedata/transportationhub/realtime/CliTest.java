package com.resourcedata.transportationhub.realtime;

import org.junit.jupiter.api.Test;
import picocli.CommandLine;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

class UrlTest {
    final GtfsStreamer.URLConverter urlConverter = new GtfsStreamer.URLConverter();
    @Test
    public void parseUrl() {
        assertThrows(Exception.class, () -> urlConverter.convert("not-a-url"));
        assertThrows(Exception.class, () -> urlConverter.convert("www.google.com"));
        assertThrows(Exception.class, () -> urlConverter.convert("http://www.google.com/tooshort"));
        assertDoesNotThrow(() -> {
            String baseUrl = "http://www.google.com", ext = "this/is/a/path", service="app";
            String link = String.join("/", baseUrl, ext, service);
            GtfsStreamer.URL url = urlConverter.convert(link);
            assertEquals(url.link,link);
            assertEquals(url.baseUrl, baseUrl);
            assertEquals(url.ext,ext);
            assertEquals(url.service,service);
        });
    }

}
public class CliTest {
    final PrintStream originalOut = System.out;
    final PrintStream originalErr = System.err;
    final ByteArrayOutputStream out = new ByteArrayOutputStream();
    final ByteArrayOutputStream err = new ByteArrayOutputStream();

    final GtfsStreamer gtfsStreamer = Mockito.spy(new GtfsStreamer());
    @BeforeEach
    public void setUp() throws Exception {
        out.reset();
        err.reset();
        System.setOut(new PrintStream(out));
        System.setErr(new PrintStream(err));
        // mock call, we just want to test cli
        Mockito.doReturn(0).when(gtfsStreamer).call();
    }

    @AfterEach
    public void restoreStreams() {
        System.setOut(originalOut);
        System.setErr(originalErr);
    }
   @Test
    public void parseBadParameters(){
        new CommandLine(gtfsStreamer).execute("--bootstrap-servers", "broker:29092",
                "--schema-registry","http://schema-registry:8081",
                "--url","https://developer.trimet.org/ws/V1/routeConfig",
                "--get-parameters","appID;${APPID},dir=yes,stops=yes,json=true",
                "--data-class","ResultSetRoute",
                "-n","1",
                "--topic","routeConfig");
        String errorMessage = err.toString();
        assertTrue(!errorMessage.isEmpty());
        assertTrue(errorMessage.contains("Usage"));
    }
    @Test
    public void parseGoodParameters(){
        new CommandLine(gtfsStreamer).execute("--bootstrap-servers", "broker:29092",
                "--schema-registry","http://schema-registry:8081",
                "--url","https://developer.trimet.org/ws/V1/routeConfig",
                "--get-parameters","appID=${APPID},dir=yes,stops=yes,json=true",
                "--data-class","ResultSetRoute",
                "-n","1",
                "--topic","routeConfig"
        );
        String error = err.toString();
        assertTrue(error.isEmpty(), error);
    }
}
