select distinct
    v.value:VEHICLE:TRIP:TRIP_ID::number(38,0) as trip_id
    ,v.value:VEHICLE:TRIP:ROUTE_ID::number(38,0) as route_id
    ,CASE WHEN v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 0 THEN 'Outbound'
         WHEN v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 1 THEN 'Inbound'
    END as route_direction
from staging.VEHICLEENTITIESEXPLODED vp
,lateral flatten(input => vp.record_content) v
where trip_id is not null