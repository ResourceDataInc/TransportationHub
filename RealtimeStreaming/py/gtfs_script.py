#!/usr/bin/env python3
import json
import pandas as pd
from pandas import DataFrame
from typing import List, Set, Any

STOPS = pd.read_csv("gtfs/stops.txt",dtype={"stop_id": str})
TRIPS = pd.read_csv("gtfs/trips.txt")
STOP_TIMES = pd.read_csv("gtfs/stop_times.txt", dtype={"stop_id":str})
SHAPES = pd.read_csv("gtfs/shapes.txt")
CALENDAR_DATES = pd.read_csv("gtfs/calendar_dates.txt")
CALENDAR = pd.read_csv("gtfs/calendar.txt")

def remove_others(df: DataFrame, columns: Set[Any]) -> DataFrame:
    cols_total: Set[Any] = set(df.columns)
    diff: Set[Any] = cols_total - columns
    return df.drop(diff, axis=1)

def write_to_json(df: DataFrame, path: str):
    with open(path,"w") as f:
        for index, row in df.iterrows():
            f.write(str(index)+"\t"+row.to_json()+"\n")

def make_stops_data_json():
    stops_keep = remove_others(STOPS, {"stop_id","stop_lat","stop_lon","stop_name"})
    stop_times_keep = remove_others(STOP_TIMES, {"trip_id","stop_id", "stop_sequence"})
    trips_keep = remove_others(TRIPS, {"route_id","trip_id","direction_id"})
    stops_exp = pd.merge(stops_keep, stop_times_keep, on=["stop_id"])
    df = pd.merge(stops_exp, trips_keep, on=["trip_id"])
    df.drop(columns=["trip_id"], inplace=True)
    df.drop_duplicates(keep="first", inplace=True)
    df = df.reindex(sorted(df.columns), axis=1)
    with open("stops.kafka.txt","w") as f:
        for _, row in df.iterrows():
            stop_id=row["stop_id"]
            row.drop(labels=["stop_id"], inplace=True)
            f.write(stop_id+"\t"+row.to_json()+"\n")

def make_shapes_file(df: DataFrame, shape_file_path: str) -> DataFrame:
    df["combined_coords"]=df[["shape_pt_lat","shape_pt_lon"]].values.tolist()
    series=df.groupby("shape_id")["combined_coords"].apply(list)
    with open(shape_file_path,"w") as f:
        for index, value in series.items(): 
            route_path={}
            route_path['route_path']=value
            f.write(str(index)+"\t"+json.dumps(route_path)+"\n")


def make_route_data_json():
    trips_keep = remove_others(TRIPS, {"route_id","service_id","direction_id","shape_id"})
    shapes_keep = remove_others(SHAPES, {"shape_id","shape_pt_lat","shape_pt_lon"})
    trips_keep.drop_duplicates(keep="first", inplace=True)
    make_shapes_file(shapes_keep, "shapes.kafka.txt")
    write_to_json(trips_keep, "trips.kafka.txt") 
    write_to_json(CALENDAR, "calendar.kafka.txt")
    write_to_json(CALENDAR_DATES, "calendar_dates.kafka.txt")

make_stops_data_json()
make_route_data_json()
