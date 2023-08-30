export class RoutesApi {
    constructor() {}

    #root = 'http://localhost:8088/query';

    async getRoutes() {
        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": "",
                "streamsProperties": {}
            }),
        });

        const json = await response.json();
        console.log(json);
        
        return json;
    }
};
