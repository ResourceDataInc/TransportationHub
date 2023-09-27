with stop_times as (
    select distinct
        value:trip_id::number(38,0) as trip_id
        ,value:stop_sequence::number(38,0) as trip_stop_sequence
        ,value:stop_id::number(38,0) as stop_location_id
        ,case
            when substring(value:arrival_time, 1, 2) = '24' then to_time(concat(replace(left(value:arrival_time,2),'24','00'),right(value:arrival_time,3)))
            when substring(value:arrival_time, 1, 2) = '25' then to_time(concat(replace(left(value:arrival_time,2),'25','01'),right(value:arrival_time,3)))
            when substring(value:arrival_time, 1, 2) = '26' then to_time(concat(replace(left(value:arrival_time,2),'26','02'),right(value:arrival_time,3)))
            else to_time(value:arrival_time)
        end as arrival_time
    from {{ source('transport_hub', 'gtfs_stop_times') }}
)
select
    row_number() over (order by s.trip_id, s.trip_stop_sequence) as stop_time_id
    ,s.trip_id
    ,s.trip_stop_sequence
    ,s.stop_location_id
    ,s.arrival_time
from stop_times s