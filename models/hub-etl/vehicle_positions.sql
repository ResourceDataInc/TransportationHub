select distinct
    to_timestamp(v.value:VEHICLE:TIMESTAMP) as timestamp
    ,v.value:ID::number(38,0) as vehicle_id
    ,v.value:VEHICLE:POSITION:LATITUDE::number(15,12) as latitude
    ,v.value:VEHICLE:POSITION:LONGITUDE::number(15,12) as longitude
    ,v.value:VEHICLE:POSITION:BEARING::number(38,0) as bearing
    ,v.value:VEHICLE:POSITION:SPEED::number(38,0) as speed
    ,v.value:VEHICLE:TRIP:TRIP_ID::number(38,0) as trip_id
    ,v.value:VEHICLE:TRIP:ROUTE_ID::number(38,0) as route_id
    ,case when v.value:VEHICLE:STOP_ID = '' THEN NULL
     when v.value:VEHICLE:STOP_ID != '' THEN v.value:VEHICLE:STOP_ID::number(38,0) 
     END as stop_id
    ,v.value:VEHICLE:CURRENT_STATUS::varchar as current_status
from staging.VEHICLEENTITIESEXPLODED vp
,lateral flatten(input => vp.record_content) v
where trip_id is not null