select distinct
   rm.value:id::number(38,0) as route_id
  ,rm.value:type::varchar as route_type
  ,rm.value:routeSubType::varchar as route_subtype
  ,rm.value:routeColor::varchar as route_color
  ,rm.value:frequentService::boolean as frequent_service
  ,rm.value:desc::varchar as route_descr
from staging.route_staging r
,lateral flatten(input => content) rm