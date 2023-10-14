class Stop {
    constructor(stop) {
        this.index = stop.row.columns[0]
        this.directionId = stop.row.columns[1]
        this.routeId = stop.row.columns[2]
        this.id = stop.row.columns[3];
        this.latitude = stop.row.columns[4];
        this.longitude = stop.row.columns[5];
        this.position = [this.latitude, this.longitude];
        this.address = stop.row.columns[6];
        this.sequence = stop.row.columns[7];
    }
};

export default Stop