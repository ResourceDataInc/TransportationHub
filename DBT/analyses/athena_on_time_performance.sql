SELECT 
	sum(d.otd)/cast(count(d.otd) as decimal(7,2)) as otd_frac,
	sum(d.otd) as otd_sum,
	count(d.otd) as otd_cnt,
	t.route_id
FROM (
	SELECT 
	trip_id,
	stop_time_update.stop_sequence,
	if(avg(stop_time_update.departure.delay) < -60 OR avg(stop_time_update.departure.delay) > 300, 0, 1) as otd
		FROM "gtfs-realtime"."tripentitiesexplodedstopsexploded"
		WHERE stop_time_update.departure IS NOT NULL and year='2023' and month='09' and day='17'
		GROUP BY 
		trip_id, 
		stop_time_update.stop_sequence
) d
JOIN (
	SELECT 
	route_id, 
	cast(trip_id as varchar) as trip_id
	FROM "gtfs-realtime"."trips"
	WHERE year='2023' AND month='09' AND day='17'
) t
ON d.trip_id = t.trip_id
GROUP BY t.route_id;
