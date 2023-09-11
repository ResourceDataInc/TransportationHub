select distinct
   s.value:locid::number(38,0) as stop_id
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

UNION ALL 

select distinct
    case when v.value:vehicle:stop_id = '' THEN NULL
     when v.value:vehicle:stop_id != '' THEN v.value:vehicle:stop_id::number(38,0) 
     END as stop_id
    ,v.value:vehicle:trip:route_id::number(38,0) as route_id
    ,NULL AS stop_desc
    ,AVG(v.value:vehicle:position:latitude::number(15,12)) as latitude
    ,AVG(v.value:vehicle:position:longitude::number(15,12)) as longitude
    ,CASE WHEN v.value:vehicle:trip:direction_id::number(38,0) = 0 THEN 'Outbound'
      WHEN v.value:vehicle:trip:direction_id::number(38,0) = 1 THEN 'Inbound'
      END as route_direction
    ,NULL as traffic_direction
    ,NULL as stop_sequence
    ,FALSE as time_point
from staging.vehiclepositions vp
,lateral flatten(input => vp.record_content:entity) v
where stop_id not in (
    select distinct
        s.value:locid::number(38,0) as stop_id 
    from staging.route_staging r
    ,lateral flatten(input => content) rm
    ,lateral flatten(input => rm.value:dir) d
    ,lateral flatten(input => d.value:stop) s
)
and v.value:vehicle:current_status::varchar = 'STOPPED_AT'
GROUP BY STOP_ID, ROUTE_ID, route_direction

UNION ALL

select distinct
    case when v.value:vehicle:stop_id = '' THEN NULL
     when v.value:vehicle:stop_id != '' THEN v.value:vehicle:stop_id::number(38,0) 
     END as stop_id
    ,v.value:vehicle:trip:route_id::number(38,0) as route_id
    ,NULL AS stop_desc
    ,NULL as latitude
    ,NULL as longitude
    ,CASE WHEN v.value:vehicle:trip:direction_id::number(38,0) = 0 THEN 'Outbound'
      WHEN v.value:vehicle:trip:direction_id::number(38,0) = 1 THEN 'Inbound'
      END as route_direction
    ,NULL as traffic_direction
    ,NULL as stop_sequence
    ,FALSE as time_point
from staging.vehiclepositions vp
,lateral flatten(input => vp.record_content:entity) v
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
        case when v.value:vehicle:stop_id = '' THEN NULL
        when v.value:vehicle:stop_id != '' THEN v.value:vehicle:stop_id::number(38,0) 
        END as stop_id
    from staging.vehiclepositions vp
    ,lateral flatten(input => vp.record_content:entity) v
    where stop_id not in (
        select distinct
            s.value:locid::number(38,0) as stop_id 
        from staging.route_staging r
        ,lateral flatten(input => content) rm
        ,lateral flatten(input => rm.value:dir) d
        ,lateral flatten(input => d.value:stop) s
    )    
    and v.value:vehicle:current_status::varchar = 'STOPPED_AT'
)
and v.value:vehicle:current_status::varchar = 'IN_TRANSIT_TO'
GROUP BY STOP_ID, ROUTE_ID, route_direction

