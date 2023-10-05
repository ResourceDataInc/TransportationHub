export class StopsApi {
    constructor() {}

    #root = 'http://localhost:8088/query';
    
    async getAllStops() {
        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": "SELECT * FROM STOPSLATEST;",
                "streamsProperties": {}
            }),
        });

        const json = await response.json();
        console.log(json);

        const header = json.shift();
        //console.log(header);
        
        return json;
    }

    async getStopsWithinMapBounds(north, east, south, west) {
        const buffer = 0.025;
        
        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": `SELECT * FROM STOPSLATEST WHERE STOP_LAT > ${south - buffer} AND STOP_LAT < ${north + buffer} AND STOP_LON > ${west - buffer} AND STOP_LON < ${east + buffer};`,
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