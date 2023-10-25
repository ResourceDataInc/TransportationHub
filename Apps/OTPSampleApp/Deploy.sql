
// Create application files including setup script, readme, manifest
// https://docs.snowflake.com/en/developer-guide/native-apps/tutorials/getting-started-tutorial#create-the-application-files
// https://docs.snowflake.com/en/developer-guide/native-apps/preparing-data-content

use ROLE ACCOUNTADMIN;

// The following is necessary if using a role other than accountadmin to publish the app
// GRANT CREATE APPLICATION PACKAGE ON ACCOUNT TO ROLE ACCOUNTADMIN;

CREATE APPLICATION PACKAGE OTPSampleAppPkg;

show application packages;

grant all on application package OTPSampleAppPkg to role DEVELOPER;

use application package OTPSampleAppPkg;

create or replace schema stage_content;

create or replace stage otpsampleapppkg.stage_content.otpsampleapppkg_stage 
    file_format = (TYPE = 'CSV' FIELD_DELIMITER = '|' SKIP_HEADER = 1);

show stages;

// grant access to data external to the application
use role sysadmin;

grant reference_usage on database transportation_hub
    to share in application package OTPSampleAppPkg;

use role ACCOUNTADMIN;
create or replace view OTPSampleAppPkg.stage_content.V_VESSEL_STOP_TIME_POSITIONS AS
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
from TRANSPORTATION_HUB.HUB.VESSEL_STOP_TIME_POSITIONS;

grant usage on schema OTPSAMPLEAPPPKG.STAGE_CONTENT
    TO SHARE IN APPLICATION PACKAGE OTPSAMPLEAPPPKG;

grant select on view OTPSAMPLEAPPPKG.STAGE_CONTENT.V_VESSEL_STOP_TIME_POSITIONS
    TO SHARE IN APPLICATION PACKAGE OTPSAMPLEAPPPKG;
    
// in snowsql:
//put file:///<root_folder>/src/manifest.yml @OTPSAMPLEAPPPKG.STAGE_CONTENT.OTPSAMPLEAPPPKG_STAGE overwrite=true auto_compress=false;
//put file:///<root_folder>/src/scripts/setup.sql @OTPSAMPLEAPPPKG.STAGE_CONTENT.OTPSAMPLEAPPPKG_STAGE/scripts overwrite=true auto_compress=false;
//put file:///<root_folder>/src/readme.md @OTPSAMPLEAPPPKG.STAGE_CONTENT.OTPSAMPLEAPPPKG_STAGE overwrite=true auto_compress=false;
//put file:///<root_folder>/src/OTPSampleApp.py @OTPSAMPLEAPPPKG.STAGE_CONTENT.OTPSAMPLEAPPPKG_STAGE/src overwrite=true auto_compress=false;
// syntax to remove a file:
//remove @otpsampleapppkg.stage_content.otpsampleapppkg_stage setup.sql;

// Although the above uses a named stage within the application package, this is not a requirement. 
// You can also use a named stage that exists in a database and schema outside the application package.

list @otpsampleapppkg.stage_content.otpsampleapppkg_stage;

show schemas;
show views;

drop application OTPSampleApp;

CREATE APPLICATION OtpSampleApp
    from application package OTPSAMPLEAPPPKG
    USING '@otpsampleapppkg.stage_content.otpsampleapppkg_stage';

show applications;

call core.hello_world();

select * from CORE.V_VESSEL_STOP_TIME_POSITIONS;

