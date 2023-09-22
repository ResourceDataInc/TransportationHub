with vehicletypes as (
    select distinct
        v.record_content:VEHICLE:VEHICLEID::number(38,0) as vehicle_id
        ,v.record_content:VEHICLE:TYPE::varchar as vehicle_type
    from {{ source('transport_hub', 'VEHICLESALTEXPLODED') }} v
)
, vehicles as (
    select distinct
        v.value:VEHICLE:VEHICLE:ID::number(38,0) as vehicle_id
    from {{ source('transport_hub', 'VEHICLEENTITIESEXPLODED') }} vp,
    lateral flatten(input => vp.record_content) v
)
, joined_vehicles as (
    select 
        v.vehicle_id
        ,vt.vehicle_type
    from vehicles v
    left join vehicletypes vt on
        v.vehicle_id = vt.vehicle_id
)
select 
    vehicle_id
    ,vehicle_type
from joined_vehicles jv
union
select 
    vehicle_id
    ,vehicle_type
from vehicletypes
;