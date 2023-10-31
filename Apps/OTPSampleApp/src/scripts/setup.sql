-- setup script for Transportation Hub Sample App

create application role app_public;
create or alter versioned schema core;
grant usage on schema core to application role app_public;

create or replace procedure core.hello_world()
    returns STRING
    LANGUAGE SQL
    EXECUTE AS OWNER
    AS
    BEGIN
        RETURN 'Hello World';
    END;

grant usage on procedure core.hello_world() to APPLICATION ROLE app_public;

create or replace view CORE.V_VESSEL_STOP_TIME_POSITIONS AS
    select VEHICLE_ID,
	VEHICLE_TYPE,
	LOCAL_TIMESTAMP,
	UTC_TIME,
	LOCAL_DATE,
	UTC_DATE,
	LATITUDE,
	LONGITUDE,
	BEARING,
	SPEED,
	TRIP_ID,
	TRIP_ROUTE_ID,
	TRIP_ROUTE_DIRECTION,
	ROUTE_ID,
	ROUTE_TYPE,
	ROUTE_SUBTYPE,
	ROUTE_DESC,
	STOP_LOCATION_ID,
	STOP_DESC,
	ROUTE_DIRECTION,
	STOP_SEQUENCE,
	TIME_POINT,
	CURRENT_STATUS,
	SCHEDULED_ARRIVAL_TIME,
	SCHEDULED_DEPTARTURE_TIME,
	ARRIVAL_TIME_AS_TIMESTAMP,
	TIMESTAMP_DELAY,
	AVG_DELAY,
	PROOF_ARRIVAL_TIME
from OTPSAMPLEAPPPKG.STAGE_CONTENT.V_VESSEL_STOP_TIME_POSITIONS;

grant select on view CORE.V_VESSEL_STOP_TIME_POSITIONS to APPLICATION ROLE app_public;

CREATE STREAMLIT core.OTPSampleApp
    FROM '/src'
    MAIN_FILE = '/OTPSampleApp.py'
;

grant usage on streamlit core.OTPSampleApp to application role app_public;


