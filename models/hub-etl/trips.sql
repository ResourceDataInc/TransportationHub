select distinct
    v.value:vehicle:trip:trip_id::number(38,0) as trip_id
    ,v.value:vehicle:trip:route_id::number(38,0) as route_id
    ,CASE WHEN v.value:vehicle:trip:direction_id::number(38,0) = 0 THEN 'Outbound'
         WHEN v.value:vehicle:trip:direction_id::number(38,0) = 1 THEN 'Inbound'
    END as route_direction
from staging.vehiclepositions vp
,lateral flatten(input => vp.record_content:entity) v
where trip_id is not null