with stops as 
(
    select distinct
        s.value:locid::number(38,0) as stop_id
        ,r.record_content:id::number(38,0) as route_id
        ,s.value:desc::varchar as stop_desc
        ,s.value:lat::number(15,12) as latitude
        ,s.value:lng::number(15,12) as longitude
        ,case when d.value:dir::number(38,0) = 0 then 'Outbound'
            when d.value:dir::number(38,0) = 1 then 'Inbound'
        end as route_direction
        ,s.value:dir::varchar as traffic_direction
        ,s.value:seq::number(38,0) as stop_sequence
        ,s.value:tp::boolean as time_point
    from {{ source('transport_hub', 'routeconfig')}} r
    ,lateral flatten(input => record_content:dir) d
    ,lateral flatten(input => d.value:stop) s
)
select
    row_number() over (order by stop_id, route_id, stop_sequence) as stop_id
    ,stop_id as stop_location_id
    ,route_id
    ,stop_desc
    ,latitude
    ,longitude
    ,route_direction
    ,stop_sequence
    ,time_point
from stops