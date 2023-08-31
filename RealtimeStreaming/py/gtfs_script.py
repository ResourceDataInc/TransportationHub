#!/usr/bin/env python3
import pandas as pd
stops = pd.read_csv("gtfs/stops.txt", dtype=str, keep_default_na=False)
stops=stops[["stop_id","stop_name","stop_lat","stop_lon"]]

trips = pd.read_csv("gtfs/trips.txt", dtype=str, keep_default_na=False)
trips=trips[["route_id","trip_id","direction_id"]]

stop_times = pd.read_csv("gtfs/stop_times.txt", dtype=str, keep_default_na=False)
stop_times =stop_times[["trip_id","stop_id","stop_sequence"]]

stops_exp = pd.merge(stops, stop_times, on=["stop_id"])
df = pd.merge(stops_exp, trips, on=["trip_id"])
df.drop(columns=['trip_id'], inplace=True)
df.drop_duplicates(keep='first', inplace=True)
df = df.reindex(sorted(df.columns), axis=1)

for index,row in df.iterrows():
    stop_id=row["stop_id"]
    row.drop(labels=["stop_id"], inplace=True)
    print(stop_id+"\t"+row.to_json())
