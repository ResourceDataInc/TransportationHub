CREATE OR REPLACE VIEW TRANSPORTATION_HUB.HUB.ON_TIME_PERFORMANCE AS 
SELECT 
	sum(d.otd)/cast(count(d.otd) as decimal(7,2)) as otd_frac,
	sum(d.otd) as otd_sum,
	count(d.otd) as otd_cnt,
	t.route_id
FROM (
	SELECT 
		trip_id,
		stop_sequence,
		CASE WHEN avg(delay) < -60 OR avg(delay) > 300 THEN 0 ELSE 1 
		END AS otd
	FROM (
		SELECT 
			record_content:TRIP_ID::INTEGER as trip_id,
			record_content:STOP_TIME_UPDATE.STOP_SEQUENCE as stop_sequence,
			record_content:STOP_TIME_UPDATE.DEPARTURE as departure,
			record_content:STOP_TIME_UPDATE.DEPARTURE.DELAY as delay,
			to_timestamp_ntz(record_content:TS) as eventtime
		FROM TRANSPORTATION_HUB.STAGING.TRIPENTITIESEXPLODEDSTOPSEXPLODED  
	) a
	WHERE departure !='' AND YEAR(eventtime) = 2023 AND MONTH(eventtime)= 9 AND DAY(eventtime)= 17
	GROUP BY trip_id, stop_sequence
) as d
JOIN (
	SELECT
		route_id,
		trip_id as trip_id
	FROM DEV.HUB.TRIPS
) as t
ON d.trip_id = t.trip_id
GROUP BY t.route_id;
