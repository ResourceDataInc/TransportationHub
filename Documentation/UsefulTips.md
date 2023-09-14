## Loading shape files into Snowflake

GIS data from trimet [data](https://developer.trimet.org/gis/) can be loaded following these [directions](https://medium.com/@daria.rostovtseva/load-shapefiles-into-snowflake-the-easy-way-2af966a17c9a).
For the database you're concerned with, there may already be a function defined for loading.  Once loaded, operations on the `GEOGRAPHY` type are possible as described [here](https://docs.snowflake.com/en/sql-reference/data-types-geospatial#label-data-types-geography).  Geospatial functions are defined [here](https://docs.snowflake.com/en/sql-reference/functions-geospatial).
