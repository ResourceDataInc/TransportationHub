CREATE OR REPLACE TABLE HUB.ROUTES ( 
	ROUTE_ID             number(38,0) NOT NULL    ,
	ROUTE_TYPE           varchar(10)     ,
	ROUTE_SUB_TYPE       varchar(20)     ,
	ROUTE_COLOR          varchar(6)     ,
	FREQUENT_SERVICE     boolean     ,
	ROUTE_DESC           varchar(50)     ,
	CONSTRAINT UNQ_ROUTE_ROUTE_ID UNIQUE ( ROUTE_ID ),
	CONSTRAINT PK_ROUTE_ROUTE_ID PRIMARY KEY ( ROUTE_ID )
 );

COMMENT ON COLUMN TRANSPORTATION_HUB.HUB.ROUTES.ROUTE_ID IS '"routeNumber" in JSON dataset';
