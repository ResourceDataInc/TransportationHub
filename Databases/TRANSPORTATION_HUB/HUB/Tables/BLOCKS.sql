CREATE  TABLE TRANSPORTATION_HUB.HUB.BLOCKS ( 
	BLOCK_ID             number(38,0) NOT NULL    ,
	TRIP_ID              number(38,0) NOT NULL    ,
	CONSTRAINT PK_BLOCKS_BLOCK_ID PRIMARY KEY ( BLOCK_ID )
 );

ALTER TABLE TRANSPORTATION_HUB.HUB.BLOCKS ADD CONSTRAINT FK_BLOCKS_TRIP FOREIGN KEY ( TRIP_ID ) REFERENCES TRANSPORTATION_HUB.HUB.TRIPS( TRIP_ID ) ON DELETE NO ACTION ON UPDATE NO ACTION;