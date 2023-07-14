AppID
4670688E9C3317977B21EED03

# Table of Contents
1. [Overview](#overview)
2. [GET URL Format](#get-url-format)
3. [Services](#services)
    1. [Alerts](#alerts)
    2. [Vehicles](#vehicles)
    3. [Arrivals](#arrivals)
    4. [RouteConfig](#routeconfig)

# Overview
TriMet offers a REST API to access information of their transportation services in General Transit Feed Specification (GTFS) format. The REST API can be called with HTTP GET requests. The API endpoints are either XML or JSON objects. Documentation is provided for accessing each service offered, including the GET request parameters and the endpoint datasets. 

# GET URL Format
Some services are only available on specific REST API versions.
### V1
https://developer.trimet.org/ws/v1/*{service}*/
### V2
https://developer.trimet.org/ws/v2/*{service}*/

# Services
| Service name | URL alias | Description |
| ------------ | --------- | ----------- |
| Alerts | alerts | Reports alerts currently in effect by route or location ID. |
| Vehicles | vehicles | Latest vehicle positions. |
| Arrivals | arrivals |Reports arrivals at a stop identified by location ID. |
| RouteConfig | routeConfig | Retrieves a list of routes reported by TransitTracker from the active schedule. |

## Alerts
https://developer.trimet.org/ws_docs/alerts2_ws.shtml  
By default, returns a JSON object of alerts associated with routes. Key 'alert' contains a list of routes with alerts associated with them at the time the GET request was called. Includes 10 fields.

### Version
Alerts is accessed via version 2 of the REST API. URL: https://developer.trimet.org/ws/v2/alerts/

### Request Parameters
| Parameter | Type | Required | Description | Example |
| --------- | ---- | -------- | ----------- | ------- |
| appID | string | TRUE | appID to access API. | "4670688E9C3317977B21EED03" |
| routes | comma delimited values | FALSE | Return only alerts applicable for specified routes.	| [200, 100, 90]
| route | alias for routes | FALSE | Same as routes. | [200, 100, 90] |
| locIDs | comma delimited values | FALSE | Return only alerts applicable for specified location IDs. | [8377, 3077] | 
| systemWideOnly | boolean (default false) | FALSE | If "true", return only alerts applicable for the entire system. routes and locIDs parameters will be ignored. | true |
| json | boolean (default true) | FALSE | If "false", return results in xml format (instead of default json). | false |
| callback | string | FALSE| Returns json result in a jsonp callback function. json must be "true".	| "true" |

### Response Object
```
'resultSet': {
    'alert': [
        {
            'route': @list,
            'info_link_url': @string,
            'end': @integer,
            'system_wide_flag': @boolean,
            'id': @integer,
            'header_text': @string,
            'begin': @integer,
            'desc': @string,
        },
        ...
    ],
    'queryTime': @integer,
}
```

## Vehicles
https://developer.trimet.org/ws_docs/vehicle_locations_ws.shtml  
By default, returns a JSON object of vehicles and associated fields. Key 'vehicle' contains a list of all vehicles deployed by TriMet at the time the GET request was called. Includes 30 fields.

### Version
Vehicles is accessed via version 2 of the REST API. URL: https://developer.trimet.org/ws/v2/vehicles/

### Request Parameters
| Parameter | Type | Required | Description | Example |
| --------- | ---- | -------- | ----------- | ------- |
| appID | string | TRUE | appID to access API. | "4670688E9C3317977B21EED03" |
| routes | comma delimited values | FALSE | Return only vehicles travelling on specified routes. | [200, 100, 90] | 
| blocks | comma delimited values | FALSE | Return only vehicles serving specified blocks. | [9084, 9003] |
| ids | comma delimited values | FALSE | Return only vehicles of specified ids.	|174, 384, 123 |
| since | time (epoch milliseconds) | FALSE | Return only vehicles if location was refreshed after specified epoch time. | 1689277190911 | 
| xml | boolean (default false) | FALSE | If "true", return results in xml format (instead of default json). | true |
| callback | string	| FALSE | Returns json result in a jsonp callback function.	| true |
| bbox | comma delimited list of lat, lon values | FALSE | Return only vehicles within the specified lat and lon bounding box.| 45.521417072238776, -122.68457131175182, 45.520469750084125, -122.68060165511433, 45.52002641575691, -122.68654546257596, 45.518447670838114, -122.68170692457747 |
| showNonRevenue | boolean | FALSE | If "true", return vehicles on dead head routes. | true |
| onRouteOnly | boolean | FALSE | If "true", return only vehicles servicing a route. | true |
| showStale | boolean | FALSE | If "true", return expired entries. | true | 

### Response Object
```
'resultSet': {
    'queryTime': @integer,
    'vehicle': [
        {
            'routeColor': @string,
            'expires': @integer,
            'signMessage': @string,
            'serviceDate': @integer,
            'loadPercentage': @object,
            'latitude': @float,
            'nextstopSeq': @integer,
            'source': @string,
            'type': @string,
            'blockID': @integer,
            'signMessageLong': @string,
            'lastLocID': @integer,
            'nextLocID': @integer,
            'locationInScheduleDay': @integer,
            'routeSubType': @string,
            'newTrip': @boolean,
            'longitude': @float,
            'direction': @integer,
            'inCongestion': @boolean,
            'routeNumber': @integer,
            'bearing': @integer,
            'garage': @string,
            'tripID': @string,
            'delay': @integer,
            'extraBlockID': @integer,
            'messageCode': @integer,
            'lastStopSeq': @integer,
            'vehicleID': @integer,
            'time': @integer,
            'offRoute': False
        },
        ...
    ],
}
```

## Arrivals
https://developer.trimet.org/ws_docs/arrivals2_ws.shtml  
By default, returns a JSON object of vehicles arriving at specified location(s). Key 'arrivals' contains a list of scheduled arrivals at the specified *{locID}* for vehicles up to 20 minutes away (default, maximum 60 minutes), and showing at least two (default) arrivals per *{locID}*. Includes 24 fields.

### Version
Arrivals is accessed via version 2 of the REST API. URL: https://developer.trimet.org/ws/v2/arrivals/

### Request Parameters
| Parameter | Type | Required | Description | Example |
| --------- | ---- | -------- | ----------- | ------- |
| appID	| string | TRUE | appID to access API. | "4670688E9C3317977B21EED03" |
| locIDs | comma delimited values | TRUE | Location IDs to report arrivals. Up to 10 location IDs. | [8377,3077] |
| json | boolean (default true) | FALSE | If "false", return results in xml format (instead of default json). | false |
| callback | string | FALSE | Returns json result in a jsonp callback function.| true |
| showPosition | boolean (default false) | FALSE | If "true", return blockPosition elements in addition to arrival elements. | true |
| minutes | integer (default 20) | FALSE | Return arrivals further than *minutes* away for each route and direction served at specified *locID(s)*. | 10
| arrivals | integer (default 2) | FALSE | Return at least *{arrivals}* arrivals for each route and direction served at specified *locID(s)*. | 5 |
| begin	| datetime (epoch seconds) or string "yyyy-MM-ddTHH:mm:ss" | FALSE | Return arrivals after *begin*. If specified time is before current time, defaults to current time. If *end* not specified, defaults to one hour after begin. | 1689273316 or "2023-07-13T18:35:16" |
| end | datetime (epoch seconds) or string "yyyy-MM-ddTHH:mm:ss" | FALSE | Return arrivals before *end*. Requires begin parameter. Maximum delta is one day. | 	1689273316 or "2023-07-13T18:35:16" |

### Response Object
```
'resultSet': {
    'detour': @list,
    'arrival': [
        {
            'routeColor': @string,
            'feet': @integer,
            'inCongestion': @boolean,
            'departed': @boolean,
            'scheduled': @integer,
            'loadPercentage': @object,
            'shortSign': 'Green Line to City Ctr',
            'estimated': 1689292131000,
            'detoured': True,
            'tripID': '12606935',
            'dir': 1,
            'blockID': 9085,
            'detour': [172915, 179852, 178036],
            'route': 200,
            'piece': '1',
            'fullSign': 'MAX  Green Line to City Center/PSU',
            'routeSubType': 'Light Rail',
            'id': '12606935_60460_13',
            'dropOffOnly': False,
            'vehicleID': '522',
            'showMilesAway': False,
            'locid': 8377,
            'newTrip': False,
            'status': 'estimated'
        },
    ...
    ],
    'queryTime': @integer,
    'location': @list,
}
```

## RouteConfig
https://developer.trimet.org/ws_docs/routeConfig_ws.shtml  
By default, returns a XML object of routes. Key 'route' contains a list of route details, with optional stop and directional elements associated with a route. Includes 9 fields.

### Version
RouteConfig is accessed via version 1 of the REST API. URL: https://developer.trimet.org/ws/v1/routeConfig/

### Request Parameters
| Parameter | Type | Required | Description | Example |
| --------- | ---- | -------- | ----------- | ------- |
| appID	| string | TRUE | appID to access API. | "4670688E9C3317977B21EED03" |
| routes | comma delimited values | FALSE | Return only alerts applicable for specified routes. If omitted, return every route.	| 70, 86, 20 |
| route | alias for routes | FALSE | Same as routes. | 70, 86, 20 |
| dir | integer (1 or 0) or string ("true" or "yes") | FALSE | Return direction elements under the route number. 0 (outbound), 1 (inbound), "true" or "yes" (both directions). | 1 |
| stops | string (non-empty) | FALSE | Return stop elements under each route direction. |true |
| tp | string (non-empty) | FALSE | Return stop elements under each route direction that are also time points along the route. If *tp*, *stops* should not be used.	| true |
| startSeq | integer | FALSE | Return only stops with sequence numbers greater than or equal to *startSeq*.	| 15 |
| endSeq | integer | FALSE | Return only stops with sequence numbers less than or equal to *endSeq*. | 87 |
| json | boolean (default false) | FALSE | If "true", return results in json format (instead of default xml). | true |
| callback | string | FALSE | Returns json result in a jsonp callback function. | true |

### Response Object
```
'resultSet': {
    'route': [
        {
            'routeColor': @string,
            'frequentService': @boolean,
            'route': @integer,
            'detour': @boolean,
            'routeSubType': @string,
            'id': @integer,
            'type': @string,
            'desc': @string,
            'routeSortOrder': @integer
        },
        ...
    ],
}
```