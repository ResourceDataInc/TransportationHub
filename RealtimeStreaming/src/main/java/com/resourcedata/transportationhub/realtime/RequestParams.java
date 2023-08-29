package com.resourcedata.transportationhub.realtime;

public class RequestParams {
    public String name;
    public String link;
    public boolean fileWriteRequested;
    public int waitTimeMs;
    public RequestParams(Service service, boolean fileWriteRequested, int waitTimeMs) {
        this.name = service.name;
        this.link = "http://developer.trimet.org/"+service.ext+"/"+name;
        this.fileWriteRequested = fileWriteRequested;
        this.waitTimeMs = waitTimeMs;
    }
}
