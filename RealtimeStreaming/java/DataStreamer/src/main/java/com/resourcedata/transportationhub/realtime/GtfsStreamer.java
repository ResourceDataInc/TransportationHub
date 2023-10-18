package com.resourcedata.transportationhub.realtime;
import com.google.transit.realtime.GtfsRealtime;
import com.google.transit.realtime.ResultSetAlert;
import com.google.transit.realtime.ResultSetRoute;
import com.google.transit.realtime.ResultSetVehicle;
import net.snowflake.ingest.internal.apache.parquet.filter2.predicate.Operators;
import org.apache.http.impl.client.HttpClients;
import picocli.CommandLine.Command;
import picocli.CommandLine;
import picocli.CommandLine.ITypeConverter;
import picocli.CommandLine.Option;

import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.Callable;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
@Command(name="gtfs-streamer", mixinStandardHelpOptions = true, version = "gtfs-streamer 4.0",
        description = "streams gtfs realtime data to a confluent kafka broker and schema registry"
)
public class GtfsStreamer implements Callable<Integer> {

    @Option(names = {"-b", "--bootstrap-servers"}, required = true, description = "hostname:port")
    String bootstrapServers;
    @Option(names = {"-r", "--schema-registry"}, required = true, description = "http://hostname:port")
    String schemaRegistry;
    @Option(names = {"-u", "--url"}, required = true, description = "url https://<hostname>/<ext>/<servicename>", converter = URLConverter.class)
    URL url;
    @Option(names = {"-p", "--get-parameters"}, description = "additional parameters for the get request in form key1=value1,key2=value2,...", split = ",")
    Map<String, String> getParameters;

    @Option(names = {"-d", "--data-class"}, required = true, description = "Valid values: ${COMPLETION-CANDIDATES}")
    DataClass dataClass;

    @Option(names = {"-w", "--wait-time"}, description = "wait time in ms between successive get requests, default (1000)")
    int waitTimeMs = 1000;

    @Option(names = "-f", description = "file writes of each request payload requested, default is false")
    boolean fileWriteRequested = false;
    @Option(names = "-n", description = "number of get requests to make, -1 (default) for infinite (stream)")
    int numLoops = -1;

    @Option(names = {"-t", "--topic"}, required = true, description = "topic to stream data to")
    String topic;

    public static class URL {
        String baseUrl;
        String ext;
        String service;
        String link;

        public URL(String link, String baseUrl, String ext, String service) {
            this.link = link;
            this.baseUrl = baseUrl;
            this.ext = ext;
            this.service = service;
        }
    }

    static class URLConverter implements ITypeConverter<URL> {
        public URL convert(String urlInput) throws Exception {
            URL url;
            Pattern pattern = Pattern.compile("(https?://[^/]+?)/(.+)/(.+)");
            Matcher matcher = pattern.matcher(urlInput);
           if (matcher.find()) {
               String baseUrl = matcher.group(1);
               String ext = matcher.group(2);
               String service = matcher.group(3);
               url = new URL(urlInput, baseUrl, ext, service);
            }
            else throw new Exception("url: " + urlInput + " does not fit url pattern");
            return url;
        }
    }
    public Integer call() throws Exception {
        Properties properties = Admin.buildProperties(this);
        try(DataGenerator dataGenerator = new DataGenerator(this)) {
            Admin.createTopic(properties, topic);
            switch (dataClass) {
                case GtfsRealtime:
                    Stream<GtfsRealtime.FeedMessage> protoStream = Stream.generate(dataGenerator::generateProto);
                    DataStreamer.streamData(protoStream, properties, topic);
                    break;
                case ResultSetVehicle:
                    Stream<ResultSetVehicle> jsonVehicleStream = Stream.generate(dataGenerator::generateResultSetVehicle);
                    DataStreamer.streamData(jsonVehicleStream, properties, topic);
                    break;
                case ResultSetAlert:
                    Stream<ResultSetAlert> jsonAlertStream = Stream.generate(dataGenerator::generateResultSetAlert);
                    DataStreamer.streamData(jsonAlertStream, properties, topic);
                    break;
                case ResultSetRoute:
                    Stream<ResultSetRoute.RouteSet.Route> jsonRouteStream = Stream.generate(dataGenerator::generateRoute);
                    DataStreamer.streamData(jsonRouteStream, properties, topic);
                    break;
                default:
                    throw new IllegalStateException("Unexpected value: " + dataClass);
            }
        }
        catch (DataGenerator.NoMoreDataException e){
           return 0;
        }
        return 0;
    }

    public static void main(String... args) {
        int exitCode = new CommandLine(new GtfsStreamer()).execute(args);
        System.exit(exitCode);
    }

}
