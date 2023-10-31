import sqlQuery from './GeneralApi';

export class VehiclesApi {


    async getVehicles(request) {
        let ksql;
        if (!request.routeId || !request.directionId) ksql = 'SELECT * FROM VEHICLESLATEST;';
        else ksql =` 
        SELECT * FROM VEHICLESLATEST 
        WHERE ROUTE_ID = '${request.routeId}' AND DIRECTION_ID = ${request.directionId};`;
        return sqlQuery(ksql);
    }

    async getTripUpdates(request) {
        let ksql;
        if (!request.routeId || !request.directionId) return [];
        else ksql =` 
        SELECT 
            VEHICLE_ID, 
            CURRENT_STOP_SEQUENCE
        FROM VEHICLESLATEST
        WHERE ROUTE_ID = '${request.routeId}' AND DIRECTION_ID = ${request.directionId};`;
        const json = await sqlQuery(ksql);
        const vehicles = json.map(e => {return {id: e.row.columns[0], seq: e.row.columns[1]}});
        if(vehicles.length === 0) return [];
        const vehicleIds = vehicles.map(v => "'"+v.id+"'").join(",");
        const seqs = vehicles.map(v => v.seq).join(",");
        const sizeMax = vehicles.length*vehicles.length;
        const vehicleMap = {};
        for(let vehicle of vehicles){
            vehicleMap[vehicle.id] = vehicle.seq
        }
        const ksql_aggregate =` 
        SELECT
            VEHICLE_ID,
            STOP_TIME_UPDATE->STOP_SEQUENCE, 
            LATEST_BY_OFFSET(STOP_TIME_UPDATE->ARRIVAL->DELAY), 
            LATEST_BY_OFFSET(STOP_TIME_UPDATE->DEPARTURE->DELAY) 
        FROM TRIPENTITIESEXPLODEDSTOPSEXPLODED
        WHERE 
            VEHICLE_ID in(${vehicleIds}) AND 
            STOP_TIME_UPDATE->STOP_SEQUENCE in (${seqs}) AND 
            (STOP_TIME_UPDATE->ARRIVAL IS NOT NULL OR STOP_TIME_UPDATE->DEPARTURE IS NOT NULL)
        GROUP BY VEHICLE_ID, STOP_TIME_UPDATE->STOP_SEQUENCE 
        EMIT CHANGES LIMIT ${sizeMax};`;
        const json_aggregate = await sqlQuery(ksql_aggregate);
        let output = [];
        if(json_aggregate.length > 1){
            for(let json_row of json_aggregate){
                if(!("finalMessage" in json_row)){
                    const message = {
                        id: json_row.row.columns[0],
                        sequence: json_row.row.columns[1],
                        arrivalDelay: json_row.row.columns[2],
                        departureDelay: json_row.row.columns[3],
                    };
                    if((message.id in vehicleMap) && vehicleMap[message.id] === message.sequence){
                            output.push(message);
                            delete vehicleMap[message.id];
                    }
                }
            }
        }
        return output;
    }
};
