# DBT

```
.
├───analyses/             # SQL files used for auditing queries
├───macros/               # SQL files for reusable functions
├───models/               # SQL files used to generate tables
├───seeds/                # CSV files used to populate initial data
├───snapshots/            # SQL files for handling type-2 data
├───tests/                # SQL files for automated tests
├───example.profiles.yml  # Example YAML file used to configure a connection with Snowflake
├───dbt_project.yml       # YAML file used to configure DBT
└───packages.yml          # YAML file used to specify DBT extensions
```

[DBT](https://docs.getdbt.com/) is a tool that extends SQL with features like [code templating](https://docs.getdbt.com/docs/build/jinja-macros) and [order of execution](https://docs.getdbt.com/reference/dbt-jinja-functions/ref). In this project, we leverage DBT to create reproducible database structures in Snowflake. 

### First Time Setup

```bash
# Install the DBT CLI tool
$ python -m venv venv
$ venv/Scripts/pip install dbt-snowflake
$ source venv/Scripts/activate

# Configure your connection to Snowflake
$ cp example.profiles.yml profiles.yml
$ vi profiles.yml

# Test that the configuration works
$ dbt debug

# Install DBT extensions
$ dbt deps
```

### Usage

##### Create a set of models for individual use in Snowflake

```bash
$ dbt run
```

##### Create a set of models for group use in Snowflake 

*Note: Requires Snowflake admin permissions.*

```bash
$ dbt run -t prod
```

### Other Resources

* [DBT Init Documentation](https://docs.getdbt.com/reference/commands/init)
* [DBT Quickstart Documentation](https://docs.getdbt.com/quickstarts/manual-install?step=1)
* [DBT Best Practices](https://docs.getdbt.com/guides/best-practices)
