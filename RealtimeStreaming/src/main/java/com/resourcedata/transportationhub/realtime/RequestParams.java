package com.resourcedata.transportationhub.realtime;

public class RequestParams {
    public String baseUrl;
    public String ext;
    public String name;
    public String dataClass;
    public int waitTimeMs;
    public boolean fileWriteRequested;
    public int numLoops;
    public String link;
    public RequestParams(String baseUrl,
                         String ext,
                         String name,
                         String dataClass,
                         int waitTimeMs,
                         boolean fileWriteRequested,
                         int numLoops) {
        this.baseUrl = baseUrl;
        this.ext = ext;
        this.name = name;
        this.dataClass = dataClass;
        this.link = baseUrl+"/"+ext+"/"+name;
        this.fileWriteRequested = fileWriteRequested;
        this.waitTimeMs = waitTimeMs;
        this.numLoops = numLoops;
    }
}
