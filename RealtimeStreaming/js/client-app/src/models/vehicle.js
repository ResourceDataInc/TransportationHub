class Vehicle {
    constructor(vehicle) {
        this.id = Number(vehicle.row.columns[0]);
        this.latitude = vehicle.row.columns[1];
        this.longitude = vehicle.row.columns[2];
        this.position = [vehicle.row.columns[1], vehicle.row.columns[2]];
        this.status = vehicle.row.columns[3];
        this.stopSequence = vehicle.row.columns[4];
        this.stopId = vehicle.row.columns[5];
        this.routeId = vehicle.row.columns[6];
        this.direction_id = vehicle.row.columns[7];
        this.timestamp = vehicle.row.columns[8];
        this.bearing = vehicle.row.columns[9];
        this.speed = vehicle.row.columns[10];
    }
};

export default Vehicle;
