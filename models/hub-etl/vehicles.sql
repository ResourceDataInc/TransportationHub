with cte_vp as (
    select distinct
         v.value:VEHICLE:VEHICLE:ID::number(38,0) as vehicle_id
        ,nullif(v.value:VEHICLE:VEHICLE:LICENSE_PLATE::varchar, '') as license_plate
    from staging.vehicleentitiesexploded vp,
    lateral flatten(input => record_content) v
)

select distinct
    v.content:vehicleID::number(38,0) as vehicle_id
    ,v.content:type::varchar as vehicle_type
    ,cte_vp.license_plate::varchar as license_plate
from staging.vehicle_staging v
left join cte_vp cte_vp on v.content:vehicleid = cte_vp.vehicle_id
where v.content:vehicleID::number(38,0) is not null