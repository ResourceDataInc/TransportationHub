with lambda_cte as (
    select distinct
        r.record_content:id::number(38,0) as route_id
        ,r.record_content:routeSubType::varchar as route_subtype
        ,r.record_content:routeColor::varchar as route_color
    from {{ source('transport_hub', 'routeconfig') }} r
)
, protobuf_cte as (
    select distinct 
        properties:rte::number(38,0) as route_id
        ,properties:type::varchar as route_type
        ,properties:rte_desc::varchar as route_desc
    from {{ source('transport_hub', 'routes') }} r
)
select distinct
    protobuf_cte.route_id as route_id
    ,protobuf_cte.route_type as route_type
    ,lambda_cte.route_subtype as route_subtype
    ,lambda_cte.route_color as route_color
    ,protobuf_cte.route_desc as route_desc
from protobuf_cte
join lambda_cte on lambda_cte.route_id = protobuf_cte.route_id
order by route_id
