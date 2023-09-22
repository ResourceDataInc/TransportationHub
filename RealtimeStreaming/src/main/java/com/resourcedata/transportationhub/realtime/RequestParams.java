package com.resourcedata.transportationhub.realtime;

public class RequestParams {
    public final String baseUrl;
    public final String ext;
    public final String name;
    public final String dataClass;
    public final int waitTimeMs;
    public final boolean fileWriteRequested;
    public final int numLoops;
    public final String link;
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
