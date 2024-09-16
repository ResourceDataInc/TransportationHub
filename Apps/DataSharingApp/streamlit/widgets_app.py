# Import python packages
import streamlit as st
from snowflake.snowpark.context import get_active_session

# Get the current credentials
session = get_active_session()

cmd = f"""
    select * from core.widgets
    """
queried_data = session.sql(cmd).to_pandas()
st.subheader("WIDGETS")
st.dataframe(queried_data, use_container_width=True)
