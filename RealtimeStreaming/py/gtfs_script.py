#!/usr/bin/env python3
import pandas as pd
stops = pd.read_csv("gtfs/stops.txt", dtype=str, keep_default_na=False)
stops=stops[["stop_id","stop_name","stop_lat","stop_lon"]]

trips = pd.read_csv("gtfs/trips.txt", dtype=str, keep_default_na=False)
trips=trips[["route_id","trip_id","direction_id"]]

stop_times = pd.read_csv("gtfs/stop_times.txt", dtype=str, keep_default_na=False)
stop_times =stop_times[["trip_id","stop_id","stop_sequence"]]

stops_exp = pd.merge(stops, stop_times, on=["stop_id"])
all_info = pd.merge(stops_exp, trips, on=["trip_id"])
all_info.drop(['trip_id'],axis=1, inplace=True)
all_info.drop_duplicates(keep='first', inplace=True)
for index,row in all_info.iterrows():
    print(row["route_id"]+"_"+row["stop_sequence"]+"_"+row["direction_id"]+"\t"+row.to_json())

