export class GeneralApi {
    async getAllRoutes() {
        const query = 'SELECT route_id, route_long_name, route_color FROM RoutesTable;';
        const routes = await sqlQuery(query);
        const output_data = []
        for (let record of routes) {
            output_data.push(
                {
                    id: record.row.columns[0],
                    name: record.row.columns[1],
                    color: record.row.columns[2],
                });
        }
        return output_data;
    }
}

async function sqlQuery(sqlStatement) {
    const root = 'http://localhost:8088/query';
    const response = await fetch(root, {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.ksql.v1+json',
        },
        body: JSON.stringify({
            "ksql": sqlStatement,
            "streamsProperties": {}
        }),
    });
    const json = await response.json();
    json.shift();
    return json;
}



export default sqlQuery;