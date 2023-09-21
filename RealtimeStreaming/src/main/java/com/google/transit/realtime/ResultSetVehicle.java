package com.google.transit.realtime;
import com.fasterxml.jackson.annotation.JsonAutoDetect;

import java.math.BigInteger;
import java.util.List;


@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
public class ResultSetVehicle {
    @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
    static class VehicleSet {
        @JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.ANY)
        static class Vehicle {
            String routeColor;
            BigInteger expires;
            String signMessage;
            BigInteger serviceDate;
            Integer loadPercentage;
            Double latitude;
            Integer nextStopSeq;
            String source;
            String type;
            BigInteger blockID;
            String signMessageLong;
            BigInteger lastLocID;
            BigInteger nextLocID;
            BigInteger locationInScheduleDay;
            String routeSubType;
            Boolean newTrip;
            Double longitude;
            Integer direction;
            Boolean inCongestion;
            Integer routeNumber;
            Integer bearing;
            String garage;
            String tripID;
            Integer delay;
            BigInteger extraBlockID;
            BigInteger messageCode;
            BigInteger lastStopSeq;
            BigInteger vehicleID;
            BigInteger time;
            Boolean offRoute;
        }
        BigInteger queryTime;
        List<Vehicle> vehicle;
    }
    VehicleSet resultSet;
}
