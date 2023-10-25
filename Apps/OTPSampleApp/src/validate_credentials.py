import streamlit as st
#from snowflake.snowpark import Session
from snowflake.snowpark.context import get_active_session

connection_info = {
    "user" : "****"
    ,"password" : "****"
    ,"warehouse" : "COMPUTE_WH"
    ,"role" : "SYSADMIN"
    ,"account" : "djfahgs-nab74593"
    ,"database" : "TRANSPORTATION_HUB"
    ,"schema" : "HUB"
}

# session = Session.builder.configs(st.secrets["connections.snowpark"]).create()

conn = st.experimental_connection("snowpark")
session = get_active_session()

agencies = conn.query("select * from TRANSPORTATION_HUB.HUB.AGENCIES")
st.dataframe(agencies, use_container_width=True)

routes = session.sql("select * from TRANSPORTATION_HUB.HUB.ROUTES")
st.dataframe(routes, use_container_width=True)

# import openai

#openai.api_key = st.secrets["OPENAI_API_KEY"]

# completion = openai.ChatCompletion.create(
#   model="gpt-3.5-turbo",
#   messages=[
#     {"role": "user", "content": "What is Streamlit?"}
#   ]
# )

# st.write(completion.choices[0].message.content)