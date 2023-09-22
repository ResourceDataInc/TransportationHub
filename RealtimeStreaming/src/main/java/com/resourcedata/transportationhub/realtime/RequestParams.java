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
    public void makeLink(){ this.link = baseUrl+"/"+ext+"/"+name; }
}
