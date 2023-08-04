CREATE OR REPLACE STAGE trimet_s3_stage
    STORAGE_INTEGRATION = trimet_s3_integration
    URL = "s3://trimet-vehicle-data"
    FILE_FORMAT = (TYPE = "JSON", STRIP_OUTER_ARRAY = TRUE);