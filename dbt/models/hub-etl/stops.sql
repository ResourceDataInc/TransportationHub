select distinct
   s.value:locid::number(38,0) as stop_id
   ,rm.value:id::number(38,0) as route_id
   ,s.value:desc::varchar as stop_desc
   ,s.value:lat::number(15,12) as latitude
   ,s.value:lng::number(15,12) as longitude
   ,case when d.value:dir::number(38,0) = 0 then 'Outbound'
         when d.value:dir::number(38,0) = 1 then 'Inbound'
    end as route_direction
   ,s.value:dir::varchar as traffic_direction
   ,s.value:seq::number(38,0) as stop_sequence
   ,s.value:tp::boolean as time_point
from staging.route_staging r
,lateral flatten(input => content) rm
,lateral flatten(input => rm.value:dir) d
,lateral flatten(input => d.value:stop) s

UNION ALL 

select distinct
    case when v.value:VEHICLE:STOP_ID = '' then null
     when v.value:VEHICLE:STOP_ID != '' then v.value:VEHICLE:STOP_ID::number(38,0) 
     end as stop_id
    ,v.value:VEHICLE:TRIP:ROUTE_ID::number(38,0) as route_id
    ,null AS stop_desc
    ,avg(v.value:VEHICLE:POSITION:LATITUDE::number(15,12)) as latitude
    ,avg(v.value:VEHICLE:POSITION:LONGITUDE::number(15,12)) as longitude
    ,case when v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 0 then 'Outbound'
      when v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 1 then 'Inbound'
      end as route_direction
    ,null as traffic_direction
    ,null as stop_sequence
    ,FALSE as time_point
from staging.vehicleentitiesexploded vp
,lateral flatten(input => vp.record_content) v
where stop_id not in (
    select distinct
        s.value:locid::number(38,0) as stop_id 
    from staging.route_staging r
    ,lateral flatten(input => content) rm
    ,lateral flatten(input => rm.value:dir) d
    ,lateral flatten(input => d.value:stop) s
)
and v.value:VEHICLE:CURRENT_STATUS::varchar = 'STOPPED_AT'
group by STOP_ID, ROUTE_ID, route_direction

UNION ALL

select distinct
    case when v.value:VEHICLE:STOP_ID = '' then null
     when v.value:VEHICLE:STOP_ID != '' then v.value:VEHICLE:STOP_ID::number(38,0) 
     end as stop_id
    ,v.value:VEHICLE:TRIP:ROUTE_ID::number(38,0) as route_id
    ,null AS stop_desc
    ,null as latitude
    ,null as longitude
    ,case when v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 0 then 'Outbound'
      when v.value:VEHICLE:TRIP:DIRECTION_ID::number(38,0) = 1 then 'Inbound'
      end as route_direction
    ,null as traffic_direction
    ,null as stop_sequence
    ,false as time_point
from staging.vehicleentitiesexploded vp
,lateral flatten(input => vp.record_content) v
where stop_id not in (
    select distinct
        s.value:locid::number(38,0) as stop_id 
    from staging.route_staging r
    ,lateral flatten(input => content) rm
    ,lateral flatten(input => rm.value:dir) d
    ,lateral flatten(input => d.value:stop) s
)
and stop_id not in (
    select distinct
        case when v.value:VEHICLE:STOP_ID = '' then NULL
        when v.value:VEHICLE:STOP_ID != '' then v.value:VEHICLE:STOP_ID::number(38,0) 
        end as stop_id
    from staging.vehicleentitiesexploded vp
    ,lateral flatten(input => vp.record_content) v
    where stop_id not in (
        select distinct
            s.value:locid::number(38,0) as stop_id 
        from staging.route_staging r
        ,lateral flatten(input => content) rm
        ,lateral flatten(input => rm.value:dir) d
        ,lateral flatten(input => d.value:stop) s
    )    
    and v.value:VEHICLE:CURRENT_STATUS::varchar = 'STOPPED_AT'
)
and v.value:VEHICLE:CURRENT_STATUS::varchar = 'IN_TRANSIT_TO'
group by STOP_ID, ROUTE_ID, route_direction

