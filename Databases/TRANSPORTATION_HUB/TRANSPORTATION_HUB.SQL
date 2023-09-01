USE ROLE SYSADMIN;
USE WAREHOUSE COMPUTE_WH;

create or replace database TRANSPORTATION_HUB;
grant usage on database TRANSPORTATION_HUB to ROLE DEVELOPER;
create or replace schema TRANSPORTATION_HUB.STAGING;
grant usage on schema TRANSPORTATION_HUB.STAGING to ROLE DEVELOPER;
create or replace schema TRANSPORTATION_HUB.HUB;
grant usage on schema TRANSPORTATION_HUB.HUB to ROLE DEVELOPER;
create or replace schema TRANSPORTATION_HUB.MART;
grant usage on schema TRANSPORTATION_HUB.MART to ROLE DEVELOPER;
