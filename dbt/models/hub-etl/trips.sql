select distinct
    v.value:VEHICLE:TRIP:TRIP_ID::number(38,0) as trip_id
    ,v.value:VEHICLE:TRIP:ROUTE_ID::number(38,0) as route_id
    ,case when v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 0 then 'Outbound'
         when v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 1 then 'Inbound'
    end as route_direction
from staging.VEHICLEENTITIESEXPLODED vp
,lateral flatten(input => vp.record_content) v
where trip_id is not null