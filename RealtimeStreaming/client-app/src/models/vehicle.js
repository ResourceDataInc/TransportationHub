class Vehicle {
    constructor(vehicle) {
        this.key = `${vehicle.row.columns[0]}`;
        this.id = Number(vehicle.row.columns[0]);
        this.latitude = vehicle.row.columns[1];
        this.longitude = vehicle.row.columns[2];
        this.position = [vehicle.row.columns[1], vehicle.row.columns[2]];
        this.status = vehicle.row.columns[3];
        this.stopSequence = vehicle.row.columns[4];
        this.stopId = vehicle.row.columns[5];
    }
};

export default Vehicle;