import { yyyymmddFormat } from "../util/dateFormat";

export class RoutesApi {
    constructor(routeId, directionId) {
        this.routeId = routeId;
        this.directionId = directionId;
    }

    #root = 'http://localhost:8088/query';

    async getRoute() {
        const serviceIds = await this.getServiceIds();
        const shapeId = await this.getShapeId(serviceIds);
        const routePath = await this.getRoutePath(shapeId);

        return routePath;
    }

    async getServiceIds() {
        const date = yyyymmddFormat();

        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": `SELECT * FROM CALENDARDATESTABLE WHERE DATE = ${date};`,
                "streamsProperties": {}
            }),
        });

        const json = await response.json();
        json.shift();
        
        const serviceIds = [];
        for (let record of json) {
            const serviceId = record.row.columns[1];
            serviceIds.push(serviceId);
        };
        
        return serviceIds;
    }

    serviceIdsString(serviceIds) {
        let serviceIdsString = '';

        for(let i = 0; i < serviceIds.length; i++) {
            if (i === serviceIds.length -1) {
                serviceIdsString += (`SERVICE_ID = '${serviceIds[i]}'`);
                break;
            };

            serviceIdsString += (`SERVICE_ID = '${serviceIds[i]}' OR `);
        };

        return serviceIdsString;
    }

    async getShapeId(serviceIds) {
        const serviceIdsString = this.serviceIdsString(serviceIds)

        console.log(`route id = ${this.routeId}`);
        console.log(`direction id = ${this.directionId}`);

        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": `SELECT * FROM TRIPSTABLE WHERE ROUTE_ID = '${this.routeId}' AND DIRECTION_ID = ${this.directionId} AND ${serviceIdsString};`,
                "streamsProperties": {}
            }),
        });

        const json = await response.json();
        json.shift();
        
        const shapeId = json[0]['row']['columns'][4];
        
        return shapeId; 
    }

    async getRoutePath(shapeId) {
        const response = await fetch(`${this.#root}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ksql.v1+json',
            },
            body: JSON.stringify({
                "ksql": `SELECT * FROM  ROUTEPATHSTABLE WHERE SHAPE_ID = '${shapeId}';`,
                "streamsProperties": {}
            }),
        });
        
        const json = await response.json();
        json.shift();
        
        const routePath = json[0]['row']['columns'][1];

        return routePath;
    }
};
