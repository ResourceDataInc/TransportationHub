with cte_vp as (
    select distinct 
         v.value:vehicle:vehicle:id::number(38,0) as vehicle_id
        ,nullif(v.value:vehicle:vehicle:license_plate::varchar, '') as license_plate
    from staging.vehiclepositions vp,
    lateral flatten(input => record_content:entity, outer => true) v
)

select distinct
    v.content:vehicleID::number(38,0) as vehicle_id
    ,v.content:type::varchar as vehicle_type
    ,cte_vp.license_plate::varchar as license_plate
from staging.vehicle_staging v
left join cte_vp cte_vp on v.content:vehicleid = cte_vp.vehicle_id
where v.content:vehicleID::number(38,0) is not null