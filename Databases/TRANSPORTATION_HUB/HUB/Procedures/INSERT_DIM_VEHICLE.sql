CREATE OR REPLACE PROCEDURE TRANSPORTATION_HUB.HUB.INSERT_DIM_VEHICLE()
RETURNS VARCHAR(16777216)
LANGUAGE SQL
EXECUTE AS OWNER
AS 
'
-- ==========================================
-- AUTHOR:      Brandon Kirlin
-- CREATE DATE: 2023/07/26
-- DESCRIPTION: Inserts vehicle data from `staging.vehicle_staging` into `hub.vehicle`
-- ==========================================

BEGIN
    INSERT INTO TRANSPORTATION_HUB.HUB.VEHICLE (VEHICLE_ID, VEHICLE_TYPE)
    SELECT DISTINCT
          VEHICLEID
        , TYPE
    FROM TRANSPORTATION_HUB.STAGING.VEHICLE_STREAM
    WHERE NOT EXISTS (SELECT VEHICLE_ID FROM TRANSPORTATION_HUB.HUB.VEHICLE WHERE VEHICLE_ID = VEHICLEID);
END;
';