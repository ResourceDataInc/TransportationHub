select distinct
    {{ dbt_utils.surrogate_key(
        'stop_id',
        'route_id'
    )}} as 'route_stop_id'
   ,s.value:locid::number(38,0) as stop_id
   ,rm.value:id::number(38,0) as route_id
   ,s.value:desc::varchar as stop_desc
   ,s.value:lat::number(15,12) as latitude
   ,s.value:lng::number(15,12) as longitude
   ,CASE WHEN d.value:dir::number(38,0) = 0 THEN 'Outbound'
         WHEN d.value:dir::number(38,0) = 1 THEN 'Inbound'
    END as route_direction
   ,s.value:dir::varchar as traffic_direction
   ,s.value:seq::number(38,0) as stop_sequence
   ,s.value:tp::boolean as time_point
from staging.route_staging r
,lateral flatten(input => content) rm
,lateral flatten(input => rm.value:dir) d
,lateral flatten(input => d.value:stop) s