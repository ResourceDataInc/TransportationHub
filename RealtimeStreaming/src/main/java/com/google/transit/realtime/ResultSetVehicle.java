package com.google.transit.realtime;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.math.BigInteger;
import java.io.File;
import java.util.List;

class Vehicle {
    @JsonProperty
    public String routeColor;
    @JsonProperty
    public BigInteger expires;
    @JsonProperty
    public String signMessage;
    @JsonProperty
    public BigInteger serviceDate;
    @JsonProperty
    public Integer loadPercentage;
    @JsonProperty
    public Double latitude;
    @JsonProperty
    public Integer nextStopSeq;
    @JsonProperty
    public String source;
    @JsonProperty
    public String type;
    @JsonProperty
    public BigInteger blockID;
    @JsonProperty
    public String signMessageLong;
    @JsonProperty
    public BigInteger lastLocID;
    @JsonProperty
    public BigInteger nextLocID;
    @JsonProperty
    public BigInteger locationInScheduleDay;
    @JsonProperty
    public String routeSubType;
    @JsonProperty
    public Boolean newTrip;
    @JsonProperty
    public Double longitude;
    @JsonProperty
    public Integer direction;
    @JsonProperty
    public Boolean inCongestion;
    @JsonProperty
    public Integer routeNumber;
    @JsonProperty
    public Integer bearing;
    @JsonProperty
    public String garage;
    @JsonProperty
    public String tripID;
    @JsonProperty
    public Integer delay;
    @JsonProperty
    public BigInteger extraBlockID;
    @JsonProperty
    public BigInteger messageCode;
    @JsonProperty
    public BigInteger lastStopSeq;
    @JsonProperty
    public BigInteger vehicleID;
    @JsonProperty
    public BigInteger time;
    @JsonProperty
    public Boolean offRoute;
}
class VehicleSet {
    @JsonProperty
    public BigInteger queryTime;
    @JsonProperty
    public List<Vehicle> vehicle;
}
public class ResultSetVehicle {
    @JsonProperty
    VehicleSet resultSet;
}
