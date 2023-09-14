import os
import urllib3
import json
import boto3
from datetime import datetime, timezone

S3_CLIENT = boto3.client("s3")
TRIMET_S3_BUCKET = "trimet-vehicle-data"
TRIMET_BASE_URL = "https://developer.trimet.org/ws/"
API_VERSION_1 = "v1/"
API_VERSION_2 = "v2/"
TRIMET_APP_ID = os.environ["TRIMET_APP_ID"]
HTTP = urllib3.PoolManager()

def _get_key(service):
    dt_now = datetime.now(tz=timezone.utc)
    
    KEY = (
        service
        + "/"
        + dt_now.strftime("%Y-%m-%d")
        + "/"
        + dt_now.strftime("%H")
        + "-"
        + dt_now.strftime("%M")
        + "-"
        + dt_now.strftime("%S")
        + ".json"
    )
    return KEY


def get_endpoint(api_version, service, payload_key, fields=None, headers=None, base_url=TRIMET_BASE_URL):
    
    endpoint_url = base_url + api_version + service
    
    try:
        response = HTTP.request(
            method="GET",
            url=endpoint_url,
            fields=fields,
            headers=headers,
            retries=urllib3.util.Retry(3)
        )
        
        status_code = response.status
        json_payload = json.loads(response.data)
        json_result = json.dumps(json_payload.get("resultSet").get(payload_key))

    except KeyError as e:
        print(f"Wrong format url {endpoint_url}", e)
    
    except urllib3.exceptions.MaxRetryError as e:
        print(f"API unavailable at {endpoint_url}", e)
    
    return json_result, status_code

def lambda_handler(event, context):
    
    fields = {"appid": TRIMET_APP_ID, "json": True}
    headers = {"Content-Type": "application/json"}
    
    json_payload, status_code = get_endpoint(
        api_version=event.get("api_version"),
        service=event.get("service"),
        payload_key=event.get("payload_key"),
        fields=fields,
        headers=headers,
    )

    key = _get_key(event.get("service"))
    
    S3_CLIENT.put_object(
        Body=json_payload,
        Bucket=TRIMET_S3_BUCKET,
        Key=key,
    )
        
    return status_code
