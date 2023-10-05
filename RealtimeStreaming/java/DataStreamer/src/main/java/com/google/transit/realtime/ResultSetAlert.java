package com.google.transit.realtime;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

import java.math.BigInteger;
import java.util.List;


@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
public class ResultSetAlert {
    @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
    static class AlertSet {
        @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
        static class Alert {
            @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
            static class Location {
                Double lng;
                Boolean no_service_flag;
                String passengerCode;
                BigInteger id;
                String dir;
                Double lat;
                String desc;
            }
            @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
            static class Route {
                String routeColor;
                Boolean frequentService;
                Integer route;
                Boolean no_service_flag;
                String routeSubType;
                Integer id;
                String type;
                String desc;
                BigInteger routeSortOrder;
            }

            List<Route> route;
            String info_link_url;
            BigInteger end;
            Boolean system_wide_flag;
            List<Location> location;
            BigInteger id;
            String header_text;
            BigInteger begin;
            String desc;
        }
        List<Alert> alert;
        BigInteger queryTime;
    }
    AlertSet resultSet;
}
