package com.resourcedata.transportationhub.realtime.snowflake;
import java.sql.Connection;

public class Push {
    private static String account = "s3testaccount";
    private static String user = "snowman";
    private static String host = "s3testaccount.snowflakecomputing.com";
    private static String scheme = "https";
    private static String password = "****";
    private static int port = 8080;
    // Details for the pipe which we are going to use
    // the name of our target DB
    private static String database = "testdb";
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
