CREATE OR REPLACE TABLE TRANSPORTATION_HUB.STAGING.VEHICLE_STAGING (
	BEARING NUMBER(38,0),
	BLOCKID NUMBER(38,0),
	DELAY NUMBER(38,0),
	EXPIRES NUMBER(38,0),
	EXTRABLOCKID NUMBER(38,0),
	GARAGE VARCHAR(16777216),
	INCONGESTION BOOLEAN,
	LASTLOCID NUMBER(38,0),
	LASTSTOPSEQ NUMBER(38,0),
	LATITUDE FLOAT,
	LOADPERCENTAGE FLOAT,
	LOCATIONINSCHEDULEDAY NUMBER(38,0),
	LONGITUDE FLOAT,
	MESSAGECODE NUMBER(38,0),
	SIGNMESSAGE VARCHAR(16777216),
	SIGNMESSAGELONG VARCHAR(16777216),
	NEWTRIP BOOLEAN,
	NEXTLOCID NUMBER(38,0),
	NEXTSTOPSEQ NUMBER(38,0),
	OFFROUTE BOOLEAN,
	ROUTECOLOR VARCHAR(16777216),
	ROUTENUMBER NUMBER(38,0),
	ROUTESUBTYPE VARCHAR(16777216),
	SERVICEDATE NUMBER(38,0),
	SOURCE VARCHAR(16777216),
	TIME NUMBER(38,0),
	TRIPID NUMBER(38,0),
	TYPE VARCHAR(16777216),
	VEHICLEID NUMBER(38,0)
);