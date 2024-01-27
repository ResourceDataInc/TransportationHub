# Import python packages
import streamlit as st
import pandas as pd
import plotly.express as px
import time
from datetime import date
from io import StringIO

# Write directly to the app
st.title("Example Data App")
st.write("Application for entering, editing, or viewing data for the 'Example Data' table.")

# Get the current credentials
conn = st.connection("snowflake")
session = conn.session()

def sysadmin_view():

    # Query existing tables
    table_query = f"""select * from ct_demo.demo_app.example_data;"""
    routes = f"""select route_id from transportation_hub.hub.routes order by route_id"""
    route_list = conn.query(routes)['ROUTE_ID'].values.tolist()
    disruption_type_list = ["Construction","Event","Maintenance","Traffic","Weather","Other"]

    # Initialize app tabs
    data_entry_tab, data_editor_tab, data_viewer_tab, file_uploader = st.tabs(["Data Entry Form","Data Editor", "Data Viewer", "File Uploader"])
    with st.sidebar:
        st.markdown("""
            # Example Data App
            This is an explanation of the data.
            Use **markdown** to display text.

            ## Add a simple Data Dictionary for the app user.
            - `Disruption type`: Event causing the disruption.
            - `Number of passengers affected`: Number of vehicle passengers intending to ride the vehicle but were affected by the event.
            - ...
                    
            ## Data Entry Form
            Use the Data Entry Form to enter a new row into the Example Data Set.
            
            ## Data Editor
            Use the Data Editor to edit the values of existing data in the Example Data Set.
                    
            ## Data Viewer
            Use the Data Viewer to view the existing data in the Example Data Set.
                
        """)

    with data_entry_tab:
        with st.form(key="entry_form", clear_on_submit=True):
            
            # Columns to demonstrate side-by-side input forms
            col1, col2 = st.columns(2)
            with col1:
                disruption_type = st.selectbox(
                    label="Disruption type",
                    options=disruption_type_list
                )
            with col2:
                passengers_affected = st.number_input(
                    label="Number of passengers affected",
                    step=1
                )

            routes_affected = st.multiselect(
                label="Routes affected",
                options=route_list,
                format_func=lambda id: "Route " + str(id)
            )

            service_cancelled = st.checkbox(
                label="Service cancelled",
                value=False
            )
            total_cost = st.slider(
                label="Total cost",
                min_value=0.00,
                max_value=100.00,
                value=0.00,
                format="$%d",
                disabled=False
            )
            event_date = st.date_input(
                label="Event date",
                max_value=date.today()
            )
            event_descr = st.text_area(
                label="Event description",
                placeholder="Describe the event here",
                max_chars=300
            )
                
            submit_entry = st.form_submit_button("Submit entry")
            st.markdown("**required*")

            if submit_entry:
                # Convert the values to a single row dataframe. Exclude `EVENT_UID` because it is auto-incrementing by table definition.
                new_row = {
                    'DISRUPTION_TYPE': [disruption_type],
                    'PASSENGERS_AFFECTED': [passengers_affected],
                    'ROUTES_AFFECTED': [routes_affected],
                    'SERVICE_CANCELLED': [service_cancelled],
                    'TOTAL_COST': [total_cost],
                    'EVENT_DATE': [event_date],
                    'EVENT_DESCR': [event_descr]
                }
                new_row_df = pd.DataFrame(new_row)

                with st.spinner("Writing data..."):
                    # Append the new row to the table.
                    conn.write_pandas(
                        df=new_row_df,
                        database="CT_DEMO",
                        schema="DEMO_APP",
                        table_name="EXAMPLE_DATA"
                    )
                    st.success("Data row inserted!")
                    time.sleep(0.5)
                # Clear cache and rerun the app to show the updated dataframe with the new row in other tabs.
                st.cache_data.clear()
                st.rerun()

    with data_editor_tab:
        with st.form(key="edit_form"):
            df_editor = st.data_editor(
                data=conn.query(table_query),
                column_config={
                    'EVENT_UID': st.column_config.Column(
                        disabled=True
                    ),
                    'DISRUPTION_TYPE': st.column_config.SelectboxColumn(
                        options=disruption_type_list
                    ),
                    'PASSENGERS_AFFECTED': st.column_config.NumberColumn(
                        step=1
                    ),
                    'ROUTES_AFFECTED': st.column_config.Column(),
                    'SERVICE_CANCELLED': st.column_config.CheckboxColumn(),
                    'TOTAL_COST': st.column_config.NumberColumn(
                        min_value=0,
                        max_value=100,
                        step=0.01
                    ),
                    'EVENT_DATE': st.column_config.DateColumn(
                        max_value=date.today()
                    ),
                    'EVENT_DESCR': st.column_config.TextColumn(
                        max_chars=300
                    ),
                },
                num_rows='dynamic'
            )

            submit_edit = st.form_submit_button("Submit Edits")

            if submit_edit:
                with st.spinner("Editing data..."):
                    # Data editor doesn't inherently know what rows and values changed from the original state.
                    # For each row in the dataframe, execute an update statement, regardless of whether it changed.
                    df_dict = df_editor.to_dict()
                    for row_num in df_dict['EVENT_UID']:
                        uid = df_dict['EVENT_UID'][row_num]
                        disruption_type = df_dict['DISRUPTION_TYPE'][row_num]
                        passengers_affected = df_dict['PASSENGERS_AFFECTED'][row_num]
                        routes_affected = df_dict['ROUTES_AFFECTED'][row_num]
                        service_cancelled = df_dict['SERVICE_CANCELLED'][row_num]
                        total_cost = df_dict['TOTAL_COST'][row_num]
                        event_date = df_dict['EVENT_DATE'][row_num]
                        event_descr = df_dict['EVENT_DESCR'][row_num]

                        update_query = f"""
                            UPDATE CT_DEMO.DEMO_APP.EXAMPLE_DATA
                            SET 
                                DISRUPTION_TYPE = ?,
                                PASSENGERS_AFFECTED = ?,
                                ROUTES_AFFECTED = ?,
                                SERVICE_CANCELLED = ?,
                                TOTAL_COST = ?,
                                EVENT_DATE = ?,
                                EVENT_DESCR = ?
                            WHERE EVENT_UID = ?
                        """
                        session.sql(
                            update_query,
                            params=[
                                f'{disruption_type}',
                                passengers_affected,
                                f'{routes_affected}',
                                service_cancelled,
                                total_cost,
                                f'{event_date}',
                                f'{event_descr}',
                                uid
                                ]
                        ).collect()

                st.success("Data updated!")
                
                time.sleep(0.25)
                st.cache_data.clear()
                st.rerun()

    with data_viewer_tab:
        st.write(conn.query(table_query))
        # Demonstrate expanders and simple viz.
        with st.expander("Passengers affected by disruption type",expanded=False):
            disruption_passenger_affect = conn.query(table_query).groupby('DISRUPTION_TYPE').sum('PASSENGERS_AFFECTED')['PASSENGERS_AFFECTED']
            st.bar_chart(disruption_passenger_affect)
        with st.expander("Number of events over time",expanded=False):
            events_over_time = conn.query(table_query).groupby('EVENT_DATE').sum('EVENT_UID')['EVENT_UID']
            fig = px.line(events_over_time,x=events_over_time.index,y="EVENT_UID",labels={
                "EVENT_UID": "Number of events",
                "EVENT_DATE": "Date"
            })
            st.plotly_chart(fig)
        
    with file_uploader:
        # Demonstrate simple file uplaoding
        uploaded_file = st.file_uploader("Upload a .csv file")
        if uploaded_file is not None:
            st.balloons()
            df = pd.read_csv(uploaded_file)
            st.write(df)

def developer_view():
    # Demonstrate role based views/UI
    st.write("Developer unable to access")

# Update role
with st.form(key="role_form"):
    role = st.selectbox('Role',options=['SYSADMIN','DEVELOPER'])
    role_update = st.form_submit_button("Change role")
    if role_update:
        session.use_role(role)

current_role = session.get_current_role()
st.markdown(f"**Access rights:** `{current_role}`")
if current_role == '"DEVELOPER"':
    developer_view()
elif current_role == '"SYSADMIN"':
    sysadmin_view()
    