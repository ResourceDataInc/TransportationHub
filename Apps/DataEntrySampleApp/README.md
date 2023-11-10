# Data Entry Demo App
The Data Entry Demo App is a Streamlit application for demonstrating Streamlit's data entry, editing, and visualization capabilities to a client. 

## Development Environment Configuration
- Install [miniconda](https://docs.conda.io/projects/miniconda/en/latest/index.html)
- create a conda environment in the root of this folder.
    ```
    $ conda create --name <env> --file requirements.txt
    ```
- Activate the environment
    ```
    conda activate <env>
    ```
- Set up environment configuration; create `.streamlit/secrets.toml` and enter your Snowflake account credentials 
    ```
    [connections.snowflake]
    user = "************"
    password = "************"
    warehouse = "<warehouse>"
    role = "<role>"
    account = "************"
    database = "<database>"
    schema = "<schema>"
    client_session_keep_alive = true
    ```
- Run the app. You must `cd` to `src` for Streamlit to fetch the `secrets.toml` file.
    ```
    streamlit run DataEntrySampleApp.py
    ```

## App Overview
This app contains four tabs to feature some of Streamlit's data entry, editing, and visualization functionality. The first prompt allows the user to change their roles between `DEVELOPER` and `SYSADMIN` to demonstrate role based access to different areas of the app. This can be updated to dynamically include only the roles that the user has access to.
### Data Entry Form
This form demonstrates the capability to enter a row of data to an existing SQL table in Snowflake. Each entry showcases different input forms that the user can be shown. The `Submit entry` button at the bottom of the form allows the user to submit their data to the table in Snowflake.
### Data Editor
 The Data Editor shows an editable dataframe which the user can add, delete, or edit rows and submit their changes. The dataframe also includes configurable columns to allow limitations on what kind of data is entered.
 ### Data Viewer
 The Data Viewer contains a static table and collapsable visualizations of the data.
 ### File Uploader
 Data files can be uploaded here and immediately render a dataframe of that file. 
