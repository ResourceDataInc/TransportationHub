import sqlQuery  from './GeneralApi';

export class StopsApi {

    async getAllStopEvents(request) {
        let ksql;
        if(!request.routeId || !request.directionId) ksql = 'SELECT * FROM STOPSLATEST;';
        else ksql = `SELECT * FROM STOPSLATEST WHERE ROUTE_ID = '${request.routeId}' AND DIRECTION_ID = ${request.directionId};`;
        return sqlQuery(ksql);
    }

    async getAllStops(request) {
         let ksql;
         if(!request.routeId || !request.directionId) ksql = 'SELECT * FROM STOPSTABLE;';
         else ksql = `SELECT * FROM STOPSTABLE WHERE ROUTE_ID = '${request.routeId}' AND DIRECTION_ID = ${request.directionId};`;
         return sqlQuery(ksql);
    }

    async getStopsWithinMapBounds(north, east, south, west) {
        const buffer = 0.025;
        const ksql = `SELECT * FROM STOPSLATEST WHERE STOP_LAT > ${south - buffer} AND STOP_LAT < ${north + buffer} AND STOP_LON > ${west - buffer} AND STOP_LON < ${east + buffer};`;
        return sqlQuery(ksql);
    }
};
