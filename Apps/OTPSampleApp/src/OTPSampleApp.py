# Import python packages
import streamlit as st
from snowflake.snowpark.context import get_active_session
import pandas as pd
import altair as alt

# Write directly to the app
st.title("Transportation Hub Sample App :bus:")
st.write(
    """Sample app for showing and editing data in the Transportation Hub."""
)
st.write(
    """More tips and easy-to-follow guides at [docs.streamlit.io](https://docs.streamlit.io)."""
)

# Get the current credentials
session = get_active_session()

# Get the Vehicle Stop Time data
avg_delay_qry = """
SELECT
    LOCAL_DATE,
    ROUTE_ID,  
    ROUTE_TYPE,
    ROUTE_DESC,
    VEHICLE_ID,
    VEHICLE_TYPE,
    STOP_LOCATION_ID,
    STOP_SEQUENCE,
    STOP_DESC,
    ROUTE_DIRECTION,
    ROUND(AVG(TIMESTAMP_DELAY), 0) as AVG_TIMESTAMP_DELAY,
    ROUND(AVG(AVG_DELAY), 0) AS AVG_REPORTED_DELAY
FROM TRANSPORTATION_HUB.HUB.VESSEL_STOP_TIME_POSITIONS
GROUP BY 
    LOCAL_DATE,
    ROUTE_ID,
    ROUTE_TYPE,
    ROUTE_DESC,
    VEHICLE_ID,
    VEHICLE_TYPE,
    STOP_LOCATION_ID,
    STOP_SEQUENCE,
    STOP_DESC,
    ROUTE_DIRECTION
ORDER BY STOP_SEQUENCE
"""

chart_df = session.sql(avg_delay_qry)
cdfpd = chart_df.to_pandas()

# Get a date selector limited to min and max dates appearing in the data set
date_choice = st.date_input(label=":green[**Select Date:**]", value=cdfpd["LOCAL_DATE"].min(0), min_value=cdfpd["LOCAL_DATE"].min(0), max_value=cdfpd["LOCAL_DATE"].max(0))

# Get all of the routes that appear in the dataset
rsdfpd = cdfpd[["ROUTE_ID","ROUTE_DESC","LOCAL_DATE"]].drop_duplicates().sort_values(by=['ROUTE_ID'])
route_choice = st.selectbox(label=":green[**Select Route:**]", options=rsdfpd.loc[(rsdfpd["LOCAL_DATE"]==date_choice)], index=0, format_func=lambda x: str(x) + " - " + rsdfpd.loc[rsdfpd['ROUTE_ID'] == x,"ROUTE_DESC"].values[0])

# Get all of the vechicles for selected route in the data
vdfpd = cdfpd[["ROUTE_ID","VEHICLE_ID","LOCAL_DATE"]].drop_duplicates().sort_values(by=['VEHICLE_ID'])
vehicle_choice = st.selectbox(label=":green[**Select Vehicle:**]", options=vdfpd.loc[(vdfpd["ROUTE_ID"]==route_choice)&(vdfpd["LOCAL_DATE"]==date_choice), "VEHICLE_ID"], index=0, format_func=lambda x: str(x))

# Get available route directions for selected route and vehicle
dirpd = cdfpd[["ROUTE_ID","VEHICLE_ID","ROUTE_DIRECTION","LOCAL_DATE"]].drop_duplicates().sort_values(by=['ROUTE_DIRECTION'])
direction_choice = st.selectbox(label=":green[**Select Direction:**]", options=dirpd.loc[(dirpd["ROUTE_ID"]==route_choice)&(dirpd["VEHICLE_ID"]==vehicle_choice)&(dirpd["LOCAL_DATE"]==date_choice), "ROUTE_DIRECTION"], index=0)

# Chart it
st.divider()
st.write(":green[**On-time Performance Chart:**]")

# Use altair chart directly
#c = (
#    alt.Chart(cdfpd).mark_line().encode(x="STOP_SEQUENCE", y=["AVG_REPORTED_DELAY","AVG_TIMESTAMP_DELAY"])
#)
#st.altair_chart(c, use_container_width=True)

# Use line_chart "syntax sugar" for altair chart
st.line_chart(data=cdfpd.loc[(cdfpd["ROUTE_ID"]==route_choice)&(cdfpd["LOCAL_DATE"]==date_choice)&(cdfpd["VEHICLE_ID"]==vehicle_choice)&(cdfpd["ROUTE_DIRECTION"]==direction_choice)], x="STOP_SEQUENCE", y=["AVG_REPORTED_DELAY","AVG_TIMESTAMP_DELAY"])

st.divider()
st.write(":green[**Underlying Data**]")

st.dataframe(cdfpd.loc[(cdfpd["ROUTE_ID"]==route_choice)&(cdfpd["LOCAL_DATE"]==date_choice)&(cdfpd["VEHICLE_ID"]==vehicle_choice)&(cdfpd["ROUTE_DIRECTION"]==direction_choice)], use_container_width=True)

