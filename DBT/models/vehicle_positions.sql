{{
    config(
        materialized='incremental'
    )
}}

with vehicle_positions as (
    select distinct
        to_timestamp(v.value:VEHICLE:TIMESTAMP) as timestamp
        ,v.value:VEHICLE:VEHICLE:ID::number(38,0) as vehicle_id
        ,v.value:VEHICLE:POSITION:LATITUDE::number(15,12) as latitude
        ,v.value:VEHICLE:POSITION:LONGITUDE::number(15,12) as longitude
        ,v.value:VEHICLE:POSITION:BEARING::number(38,0) as bearing
        ,v.value:VEHICLE:POSITION:SPEED::number(38,0) as speed
        ,v.value:VEHICLE:TRIP:TRIP_ID::number(38,0) as trip_id
        ,v.value:VEHICLE:TRIP:ROUTE_ID::number(38,0) as route_id
        ,case when v.value:VEHICLE:STOP_ID = '' then NULL
        when v.value:VEHICLE:STOP_ID != '' then v.value:VEHICLE:STOP_ID::number(38,0) 
        end as stop_id
        ,v.value:VEHICLE:CURRENT_STATUS::varchar as current_status
    from {{ source('transport_hub', 'VEHICLEENTITIESEXPLODED') }} vp
    ,lateral flatten(input => vp.record_content) v
    where trip_id is not null
)
select
    row_number() over (order by vehicle_id, timestamp) as vehicle_position_id
    ,year(to_date(timestamp)) as year
    ,month(to_date(timestamp)) as month
    ,day(to_date(timestamp)) as day
    ,dayname(to_date(timestamp)) as day_of_week
    ,to_time(timestamp) as time
    ,timestamp
    ,vehicle_id
    ,latitude
    ,longitude
    ,bearing
    ,speed
    ,trip_id
    ,route_id
    ,stop_id as stop_location_id
    ,current_status
from vehicle_positions

{% if is_incremental() %}
    where timestamp >= (select max(timestamp) from {{ this }})
{% endif %}