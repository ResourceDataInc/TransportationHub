CREATE OR REPLACE TASK TRANSPORTATION_HUB.HUB.STAGING_TO_VEHICLE
	WAREHOUSE=COMPUTE_WH
	SCHEDULE='1 MINUTE'
	WHEN SYSTEM$STREAM_HAS_DATA('STAGING.VEHICLE_STREAM')
	AS
    CALL HUB.INSERT_DIM_VEHICLE();