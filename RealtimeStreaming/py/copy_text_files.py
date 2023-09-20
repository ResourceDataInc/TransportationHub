#!/usr/bin/env python3
import glob
import pandas as pd
from pathlib import Path
import boto3
from tempfile import NamedTemporaryFile, TemporaryDirectory
from datetime import datetime
import requests
from zipfile import ZipFile
import sys
s3 = boto3.client("s3")
with NamedTemporaryFile() as gtfszip, TemporaryDirectory() as extracted_files:
    zip_file = requests.get("https://developer.trimet.org/schedule/gtfs.zip")
    gtfszip.write(zip_file.content)
    with ZipFile(gtfszip.name, "r") as zObject:
        zObject.extractall(extracted_files)
        for name in glob.glob(extracted_files + "/*.txt"):
            df_csv = pd.read_csv(name)
            with NamedTemporaryFile() as f:
                df_csv.to_parquet(f.name)
                stem = Path(name).stem
                dt = datetime.utcnow().strftime("year=%Y/month=%m/day=%d")
                s3_path = f"gtfs/{stem}/{dt}/{stem}.parquet"
                print(f"uploading {stem} at {s3_path}")
                s3.upload_file(f.name, "trimet-gtfs-realtime-071220964300", s3_path)
