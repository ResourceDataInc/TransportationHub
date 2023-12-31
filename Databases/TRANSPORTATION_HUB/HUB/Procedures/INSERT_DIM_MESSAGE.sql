CREATE OR REPLACE PROCEDURE TRANSPORTATION_HUB.HUB.INSERT_DIM_MESSAGE()
RETURNS VARCHAR(16777216)
LANGUAGE SQL
EXECUTE AS OWNER
AS 
'
BEGIN
    INSERT INTO HUB.MESSAGE (MESSAGE_ID, SIGN_MESSAGE, SIGN_MESSAGE_LONG)
    SELECT DISTINCT
          MESSAGECODE
        , SIGNMESSAGE
        , SIGNMESSAGELONG
    FROM STAGING.MESSAGE_STREAM
    WHERE NOT EXISTS (SELECT MESSAGE_ID FROM HUB.MESSAGE WHERE MESSAGE_ID = MESSAGECODE);
END;
'
;