with agency as (
    select distinct
        value:agency_id::varchar as agency_name
        ,value:agency_name::varchar as agency_name_desc
        ,value:agency_email::varchar as email_address
        ,value:agency_phone::varchar as phone_number
        ,value:agency_lang::varchar as language
        ,value:agency_timezone::varchar as timezone
        ,value:agency_url::varchar as website_url
        ,value:agency_fare_url::varchar as fare_website_url
    from {{ source('transport_hub', 'gtfs_agency') }}
)
select 
    row_number() over (order by agency_name) as agency_id
    ,agency_name
    ,agency_name_desc
    ,email_address
    ,phone_number
    ,language
    ,timezone
    ,website_url
    ,fare_website_url
from agency
