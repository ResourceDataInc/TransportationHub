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