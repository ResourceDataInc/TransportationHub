SELECT 
    sum(d.otd)/cast(count(d.otd) as decimal(7,2)) as otd_frac,
    sum(d.otd) as otd_sum,
    count(d.otd) as otd_cnt,
    t.route_id,
    t.direction_id
FROM (
    SELECT 
        trip_id,
        trip_stop_sequence,
        CASE WHEN avg(delay) < -60 THEN 0 ELSE 1 END AS otd
    FROM 
        DEV.HUB.TRIP_DELAYS
    WHERE 
        timestamp IS NOT NULL AND YEAR(timestamp)='2023' AND MONTH(timestamp)='09' AND DAY(timestamp)='14'
    GROUP BY 
        trip_id, 
        trip_stop_sequence
        ) as d
JOIN (
    SELECT 
        route_id, 
        cast(trip_id as varchar) as trip_id,
        route_direction as direction_id
    FROM 
        DEV.HUB.TRIPS
    ) as t
ON 
    d.trip_id = t.trip_id
GROUP BY
    t.route_id, t.direction_id;