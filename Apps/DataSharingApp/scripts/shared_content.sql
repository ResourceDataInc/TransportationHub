ALTER APPLICATION PACKAGE {{package_name}} SET DISTRIBUTION = EXTERNAL;
USE APPLICATION PACKAGE {{package_name}};

CREATE SCHEMA shared_data;
USE SCHEMA shared_data;

create or replace secure view widgets(
	    ID,
	    NAME,
	    COLOR,
	    PRICE,
	    CREATED_ON
) as
SELECT w.*
FROM dev.blincoln.widgets AS w
WHERE w.id IN (
	    SELECT widget_id
	    FROM dev.blincoln.widget_access_rules AS a
	    WHERE upper(account_name) = CURRENT_ACCOUNT()
);

GRANT REFERENCE_USAGE ON DATABASE dev TO SHARE IN APPLICATION PACKAGE {{package_name}}; 
GRANT USAGE ON SCHEMA shared_data TO SHARE IN APPLICATION PACKAGE {{package_name}};
GRANT SELECT ON VIEW widgets TO SHARE IN APPLICATION PACKAGE {{package_name}};
