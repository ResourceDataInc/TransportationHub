with stop_times as (
    select
        to_timestamp(record_content:ENTITY:VEHICLE:TIMESTAMP) as timestamp
        ,try_to_number(record_content:ENTITY:VEHICLE:TRIP:TRIP_ID::text) as trip_id
        ,try_to_number(record_content:ENTITY:VEHICLE:CURRENT_STOP_SEQUENCE::text) as current_stop_sequence
        ,record_content:ENTITY:VEHICLE:CURRENT_STATUS::varchar as current_status
        ,try_to_number(record_content:ENTITY:VEHICLE:STOP_ID::text) as stop_id
    from {{ source('transport_hub', 'VEHICLEENTITIESEXPLODED') }} v
)
,trip_delays as (select 
    to_timestamp(t.record_content:TS) as timestamp
    ,try_to_number(t.record_content:TRIP_ID::text) as trip_id
    ,try_to_number(t.record_content:STOP_TIME_UPDATE:STOP_SEQUENCE::text) as trip_stop_sequence
    ,try_to_number(t.record_content:STOP_TIME_UPDATE:ARRIVAL:DELAY::text) as delay
from {{ source('transport_hub', 'TRIPENTITIESEXPLODEDSTOPSEXPLODED') }} t
)
select distinct
    row_number() OVER (ORDER BY t.trip_id, t.timestamp) as trip_delay_id
    ,t.timestamp
    ,t.trip_id
    ,t.trip_stop_sequence
    ,s.stop_id
    ,t.delay
from stop_times s
join trip_delays t on
    s.timestamp = t.timestamp and
    s.trip_id = t.trip_id and
    s.current_stop_sequence = t.trip_stop_sequence