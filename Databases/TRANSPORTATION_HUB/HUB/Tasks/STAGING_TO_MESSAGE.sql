CREATE OR REPLACE TASK TRANSPORTATION_HUB.HUB.STAGING_TO_MESSAGE
	WAREHOUSE=COMPUTE_WH
	SCHEDULE='1 MINUTE'
	WHEN SYSTEM$STREAM_HAS_DATA('STAGING.MESSAGE_stream')
	AS 
    CALL TRANSPORTATION_HUB.HUB.INSERT_DIM_MESSAGE();