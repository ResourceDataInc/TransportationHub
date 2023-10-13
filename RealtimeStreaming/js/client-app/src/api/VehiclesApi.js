import sqlQuery  from './GeneralApi';

export class VehiclesApi {

    async getVehicles(request) {
        let ksql;
        if(!request.routeId || !request.directionId) ksql= 'SELECT * FROM VEHICLESLATEST;';
        else ksql = `SELECT * FROM VEHICLESLATEST WHERE ROUTE_ID = '${request.routeId}' AND DIRECTION_ID = ${request.directionId};`;
        return sqlQuery(ksql);
    }
};
