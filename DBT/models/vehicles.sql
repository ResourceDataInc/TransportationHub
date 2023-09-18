with cte_vp as (
    select distinct
         v.value:VEHICLE:VEHICLE:ID::number(38,0) as vehicle_id
        ,nullif(v.value:VEHICLE:VEHICLE:LICENSE_PLATE::varchar, '') as license_plate
    from {{ source('transport_hub', 'VEHICLEENTITIESEXPLODED') }} vp,
    lateral flatten(input => record_content) v
)

select distinct
    cte_vp.vehicle_id as vehicle_id
    ,v.content:type::varchar as vehicle_type
    ,cte_vp.license_plate as license_plate
from cte_vp cte_vp
join {{ source('transport_hub', 'vehicle_staging') }} v on
    v.content:vehicleID = cte_vp.vehicle_id
where v.content:vehicleID::number(38,0) is not null