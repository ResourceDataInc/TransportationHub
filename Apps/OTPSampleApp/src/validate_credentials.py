import streamlit as st

try:
    conn = st.experimental_connection("snowpark") #this is deprecated after 4/1/2024
    print ('connected!')
except Exception as ex:
    print('bad connection info?:' + str(ex))

