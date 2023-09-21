package com.google.transit.realtime;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import java.util.List;
import java.math.BigInteger;


@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
public class ResultSetRoute {
    @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
    static class RouteSet {
        @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
        static class Route {
            @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
            static class Direction {
                @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
                static class Stop {
                    Double lng;
                    Boolean tp;
                    String dir;
                    BigInteger locid;
                    Integer seq;
                    Double lat;
                    String desc;
                }
                List<Stop> stop;
                Integer dir;
                String desc;
            }
            String routeColor;
            Boolean frequentService;
            Integer route;
            Boolean detour;
            String routeSubType;
            BigInteger id;
            String type;
            List<Direction> dir;
            String desc;
            BigInteger routeSortOrder;
        }
        List<Route> route;
    }
    RouteSet resultSet;
}
