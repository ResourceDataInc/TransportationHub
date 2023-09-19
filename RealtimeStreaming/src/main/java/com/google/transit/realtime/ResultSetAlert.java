package com.google.transit.realtime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
class Route {
    @JsonProperty
    public String routeColor;
    @JsonProperty
    public Boolean frequentService;
    @JsonProperty
    public Integer route;
    @JsonProperty
    public Boolean no_service_flag;
    @JsonProperty
    public String routeSubType;
    @JsonProperty
    public Integer id;
    @JsonProperty
    public String type;
    @JsonProperty
    public String desc;
    @JsonProperty
    public BigInteger routeSortOrder;
}
class Location {
    @JsonProperty
    public Double lng;
    @JsonProperty
    public Boolean no_service_flag;
    @JsonProperty
    public String passengerCode;
    @JsonProperty
    public BigInteger id;
    @JsonProperty
    public String dir;
    @JsonProperty
    public Double lat;
    @JsonProperty
    public String desc;
}
class Alert {
    @JsonProperty
    public List<Route> route;
    @JsonProperty
    public String info_link_url;
    @JsonProperty
    public BigInteger end;
    @JsonProperty
    public Boolean system_wide_flag;
    @JsonProperty
    public List<Location> location;
    @JsonProperty
    public BigInteger id;
    @JsonProperty
    public String header_text;
    @JsonProperty
    public BigInteger begin;
    @JsonProperty
    public String desc;
}
class AlertSet {
    @JsonProperty
    public List<Alert> alert;
    @JsonProperty
    public BigInteger queryTime;
}
public class ResultSetAlert {
    @JsonProperty
    AlertSet resultSet;
}
