CREATE APPLICATION ROLE IF NOT EXISTS app_public;
CREATE SCHEMA IF NOT EXISTS core;
GRANT USAGE ON SCHEMA core TO APPLICATION ROLE app_public;

create or replace secure view core.widgets(
    ID,
    NAME,
    COLOR,
    PRICE,
    CREATED_ON
) as
SELECT *
FROM shared_data.widgets;


GRANT SELECT on view core.widgets to APPLICATION ROLE app_public;

CREATE OR ALTER VERSIONED SCHEMA code_schema;
GRANT USAGE ON SCHEMA code_schema TO APPLICATION ROLE app_public;

CREATE OR REPLACE STREAMLIT code_schema.widgets_app
  FROM '/streamlit'
  MAIN_FILE = '/widgets_app.py'
;

GRANT USAGE ON STREAMLIT code_schema.widgets_app TO APPLICATION ROLE app_public;
