CREATE STORAGE INTEGRATION IF NOT EXISTS trimet_s3_integration
    TYPE = EXTERNAL_STAGE
    STORAGE_PROVIDER = "S3"
    ENABLED = TRUE
    STORAGE_AWS_ROLE_ARN = "arn:aws:iam::071220964300:role/trimet-snowflake-role"
    STORAGE_ALLOWED_LOCATIONS = ("s3://trimet-vehicle-data/");