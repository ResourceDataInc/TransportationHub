{{ config(materialized='table') }}

select 
      id as 'route_id'
    , type as 'route_type'
    , routesubtype as 'route_subtype'
    , routecolor as 'route_color'
    , frequentservice as 'frequent_service'
    , desc as 'route_desc'
from staging.route_staging