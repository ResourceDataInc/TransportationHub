CREATE OR REPLACE TASK TRANSPORTATION_HUB.HUB.STAGING_TO_ROUTE
	WAREHOUSE=COMPUTE_WH
	SCHEDULE='60 MINUTE'
	WHEN SYSTEM$STREAM_HAS_DATA('STAGING.ROUTE_STREAM')
	AS
    CALL TRANSPORTATION_HUB.HUB.INSERT_DIM_ROUTE();