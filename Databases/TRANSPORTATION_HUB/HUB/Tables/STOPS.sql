CREATE  TABLE TRANSPORTATION_HUB.HUB.STOPS ( 
	STOP_ID              number(38,0) NOT NULL    ,
	ROUTE_ID             number(38,0) NOT NULL    ,
	STOP_DESCRIPTION     varchar     ,
	LATITUDE             number(15,12)     ,
	LONGITUDE            number(15,12)     ,
	DIRECTION            varchar     ,
	STOP_SEQUENCE        number(38,0)     ,
	CONSTRAINT UNQ_STOPS_STOP_ID UNIQUE ( STOP_ID ),
	CONSTRAINT PK_STOPS_STOP_ID PRIMARY KEY ( STOP_ID )
 );

ALTER TABLE TRANSPORTATION_HUB.HUB.STOPS ADD CONSTRAINT FK_STOPS_ROUTE FOREIGN KEY ( ROUTE_ID ) REFERENCES TRANSPORTATION_HUB.HUB.ROUTES( ROUTE_ID ) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMENT ON TABLE TRANSPORTATION_HUB.HUB.STOPS IS 'Defined as Location ID in the TriMet API. Identifies stops along a bus or MAX route.';

COMMENT ON COLUMN TRANSPORTATION_HUB.HUB.STOPS.LATITUDE IS 'Stop latitude';
