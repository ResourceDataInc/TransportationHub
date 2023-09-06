class Stop {
    constructor(stop) {
        this.id = stop.row.columns[0];
        this.latitude = stop.row.columns[2];
        this.longitude = stop.row.columns[3];
        this.position = [stop.row.columns[2], stop.row.columns[3]];
        this.address = stop.row.columns[4];
    }
};

export default Stop;
