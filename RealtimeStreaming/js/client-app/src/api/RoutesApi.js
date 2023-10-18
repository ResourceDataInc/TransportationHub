import { yyyymmddFormat, weekdayName } from "../util/dateUtil";
import sqlQuery from "./GeneralApi";

export class RoutesApi {
    constructor(routeId, directionId) {
        this.routeId = routeId;
        this.directionId = directionId;
    }

    #root = 'http://localhost:8088/query';

    async getRoute() {
        const serviceIds1 = await this.getServiceIdsFromCalendarTable();
        const serviceIds2 = await this.getServiceIdsFromCalendarDatesTable();
        const shapeIds = await this.getShapeId(serviceIds1.concat(serviceIds2));
        const routePath = await this.getRoutePath(shapeIds);

        return routePath;
    }

    async getServiceIdsFromCalendarDatesTable() {
        const date = yyyymmddFormat();
        const ksql = `SELECT * FROM CALENDARDATESTABLE WHERE DATE = ${date};`;
        const json = await sqlQuery(ksql);
        const serviceIds = [];
        for (let record of json) {
            const serviceId = record.row.columns[1];
            serviceIds.push(serviceId);
        };
        
        return serviceIds;
    } 

    async getServiceIdsFromCalendarTable() {
        const date = yyyymmddFormat();
        const weekday = weekdayName();
        const ksql =  `SELECT service_id FROM CalendarTable WHERE ${date} BETWEEN start_date AND end_date AND ${weekday} = 1;`;
        const json = await sqlQuery(ksql);
        const serviceIds = [];
        for (let record of json) {
            const serviceId = record.row.columns[0];
            serviceIds.push(serviceId);
        };
        return serviceIds;
    } 

    async getShapeId(serviceIds) {
        const serviceIdsString = serviceIds.map(e => "'"+e+"'").join(',')
        const ksql = `SELECT SHAPE_ID FROM TRIPSTABLE WHERE ROUTE_ID = '${this.routeId}' AND DIRECTION_ID = ${this.directionId} AND SERVICE_ID IN (${serviceIdsString});`;
        const json = await sqlQuery(ksql);
        const shapeIds = json.map(e => e.row.columns[0])
        let uniqueShapeIds = {}
        for(let shapeId of shapeIds){
            uniqueShapeIds[shapeId] = 1;
        }
        return Object.keys(uniqueShapeIds);
    }

    async getRoutePath(shapeIds) {
        const shapeIdsString = shapeIds.map(e => "'"+e+"'").join(',')
        const ksql = `SELECT ROUTE_PATH FROM  ROUTEPATHSTABLE WHERE SHAPE_ID IN (${shapeIdsString});`;
        const json = await sqlQuery(ksql);
        return json.map(e => e.row.columns[0]);
    }
};
