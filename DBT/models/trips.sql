with ve as (
    select distinct
        try_to_number(ve.value:VEHICLE:TRIP:TRIP_ID::text) as trip_id
        ,try_to_number(ve.value:VEHICLE:TRIP:ROUTE_ID::text) as route_id
    from {{ source('transport_hub', 'VEHICLEENTITIESEXPLODED') }} v
    ,lateral flatten(input => record_content) ve
)
, va as (
    select distinct
        try_to_number(va.record_content:VEHICLE:TRIPID::text) as trip_id
        ,try_to_number(va.record_content:VEHICLE:ROUTENUMBER::text) as route_id
        ,try_to_number(va.record_content:VEHICLE:DIRECTION::text) as direction_id
    from {{ source('transport_hub', 'VEHICLESALTEXPLODED') }} va
)
select distinct
    ve.trip_id
    ,ve.route_id
    ,case
        when va.direction_id = 0 then 'Outbound'
        when va.direction_id = 1 then 'Inbound'
    end as route_direction
from ve
join va on
    ve.trip_id = va.trip_id
    and ve.route_id = va.route_id