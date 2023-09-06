select distinct
    to_timestamp(v.value:vehicle:timestamp) as timestamp
    ,v.value:id::number(38,0) as vehicle_id
    ,v.value:vehicle:position:latitude::number(15,12) as latitude
    ,v.value:vehicle:position:longitude::number(15,12) as longitude
    ,v.value:vehicle:position:bearing::number(38,0) as bearing
    ,v.value:vehicle:position:speed::number(38,0) as speed
    ,v.value:vehicle:trip:trip_id::number(38,0) as trip_id
    ,v.value:vehicle:trip:route_id::number(38,0) as route_id
    ,case when v.value:vehicle:stop_id = '' THEN NULL
     when v.value:vehicle:stop_id != '' THEN v.value:vehicle:stop_id::number(38,0) 
     END as stop_id
    ,v.value:vehicle:current_status::varchar as current_status
from staging.vehiclepositions vp
,lateral flatten(input => vp.record_content:entity) v