with route_shapes as (
    select distinct
        properties:rte::number(38,0) as route_id
        ,case
            when properties:dir::number(38,0) = 0 then 'Outbound'
            when properties:dir::number(38,0) = 1 then 'Inbound' 
            end as direction
        ,properties:dir_desc::varchar as direction_desc
        ,case
            when properties:frequence_service::varchar = 'True' then true else False end as frequence_service
        ,r.geography as geography
    from {{ source('transport_hub', 'routes') }} r
)
select 
    row_number() over (order by route_id, direction) as route_shape_id
    ,route_id
    ,direction
    ,direction_desc
    ,geography
from route_shapes r