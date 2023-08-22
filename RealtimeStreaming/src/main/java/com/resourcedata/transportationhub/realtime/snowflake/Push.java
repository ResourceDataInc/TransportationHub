package com.resourcedata.transportationhub.realtime.snowflake;
import java.sql.Connection;

public class Push {
    private static String account = "szb57928";
    private static String user = "snowman";
    private static String host = "szb57928.prod3.us-west-2.aws.snowflakecomputing.com";
    private static String scheme = "https";
    private static String password = "taE86tyfXB9szv";
    private static int port = 8080;
    // Details for the pipe which we are going to use
    // the name of our target DB
    private static String database = "TRANSPORTATION_HUB";
    // the name of our target schema
    private static String schema = "public";
    // the name of our stage
    private static String stage = "ingest_stage";
    // the name of our target table
    private static String table = "ingest_table";
    // the name of our pipe
    private static String pipe = "ingest_pipe";

    // the connection we will use for queries
    private static Connection conn;
}
