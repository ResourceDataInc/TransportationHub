export class StopsApi {
    constructor() {}

    #root = 'http://localhost:8088/query';

    async getStops() {
        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": "SELECT * FROM STOPSLATEST LIMIT 1000;",
                "streamsProperties": {}
            }),
        });

        const json = await response.json();
        console.log(json);

        const header = json.shift();
        //console.log(header);
        
        return json;
    }
};
