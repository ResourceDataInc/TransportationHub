CREATE VIEW "gtfs-realtime".on_time_performance_stats AS
SELECT
  arbitrary(scheduled_arrival_time) scheduled_arrival_time
, arbitrary(scheduled_departure_time) scheduled_departure_time
, stop_id
, trip_id
, route_id
, arbitrary(route_short_name) route_short_name
, arbitrary(route_type) route_type
, arbitrary(agency_id) agency_id
, vehicle_id
, arbitrary(actual_arrival_time) actual_arrival_time
, arbitrary(actual_departure_time) actual_departure_time
, arbitrary(stop_code) stop_code
, arbitrary(stop_name) stop_name
, arbitrary(direction) direction
FROM
  (
   SELECT
     stop_timestamps.stop_id stop_id
   , stop_timestamps.trip_id trip_id
   , trips.route_id route_id
   , routes.route_short_name route_short_name
   , routes.route_type route_type
   , routes.agency_id agency_id
   , delays.vehicle_id vehicle_id
   , stop_timestamps.arrival_timestamp scheduled_arrival_time
   , stop_timestamps.departure_timestamp scheduled_departure_time
   , CAST(date_add('second', delays.arrival_delay, stop_timestamps.arrival_timestamp) AS timestamp) actual_arrival_time
   , CAST(date_add('second', delays.departure_delay, stop_timestamps.departure_timestamp) AS timestamp) actual_departure_time
   , stops.stop_code stop_code
   , stops.stop_name stop_name
   , stops.direction direction
   FROM
     ((((stop_timestamps
   INNER JOIN (
      SELECT
        route_id
      , CAST(trip_id AS varchar) trip_id
      FROM
        trips
      WHERE ((year = '2023') AND (month = '09') AND (day = '17'))
   )  trips ON (trips.trip_id = stop_timestamps.trip_id))
   INNER JOIN (
      SELECT
        route_id
      , route_short_name
      , route_type
      , agency_id
      FROM
        routes
      WHERE ((year = '2023') AND (month = '09') AND (day = '17'))
   )  routes ON (routes.route_id = trips.route_id))
   INNER JOIN delays ON (delays.trip_id = stop_timestamps.trip_id))
   INNER JOIN (
      SELECT
        stop_id
      , stop_code
      , stop_name
      , direction
      FROM
        stops
      WHERE ((year = '2023') AND (month = '09') AND (day = '17'))
   )  stops ON (stop_timestamps.stop_id = stops.stop_id))
)  all
GROUP BY stop_id, trip_id, route_id, vehicle_id