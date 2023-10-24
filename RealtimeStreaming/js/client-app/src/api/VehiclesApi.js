import sqlQuery from './GeneralApi';

export class VehiclesApi {

    async getVehicles(request) {
        let ksql;
        if (!request.routeId || !request.directionId) ksql = 'SELECT * FROM VEHICLESLATEST;';
        else ksql = `SELECT * FROM VEHICLESLATEST WHERE ROUTE_ID = '${request.routeId}' AND DIRECTION_ID = ${request.directionId};`;
        return sqlQuery(ksql);
    }
    async getVehicleUpdates(request) {
        let ksql = `SELECT STOP_TIME_UPDATE->STOP_SEQUENCE, LATEST_BY_OFFSET(STOP_TIME_UPDATE->ARRIVAL->DELAY), LATEST_BY_OFFSET(STOP_TIME_UPDATE->DEPARTURE->DELAY) FROM TRIPENTITIESEXPLODEDSTOPSEXPLODED WHERE VEHICLE_ID = '${request.id}' AND (STOP_TIME_UPDATE->ARRIVAL IS NOT NULL OR STOP_TIME_UPDATE->DEPARTURE IS NOT NULL) AND STOP_TIME_UPDATE->STOP_SEQUENCE >=  ${request.stopSequence} GROUP BY STOP_TIME_UPDATE->STOP_SEQUENCE EMIT CHANGES LIMIT 3;`;
        const json = await sqlQuery(ksql);
        let output = [];
        if(!json) return [];
        let sequences = {}
        for (let e of json) {
            if (!("finalMessage" in e) && !(e.row.columns[0] in sequences)) {
                output.push({
                    sequence: e.row.columns[0],
                    arrivalDelay: e.row.columns[1],
                    departureDelay: e.row.columns[2],
                });
                sequences[e.row.columns[0]] = 1;
            }
        }
        return output;
    }
};
