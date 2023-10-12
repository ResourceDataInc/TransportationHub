export class VehiclesApi {
    constructor() {}

    #root = 'http://localhost:8088/query';

    async getVehicles(request) {
        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": `SELECT * FROM VEHICLESLATEST WHERE ROUTE_ID = '${request.routeId}' AND DIRECTION_ID = ${request.directionId};`,
                "streamsProperties": {}
            }),
        });

        const json = await response.json();

        const header = json.shift();
        //console.log(header);

        return json;
    }
};
