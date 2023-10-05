class Stop {
    constructor(stop) {
        this.id = stop.row.columns[0];
        this.latitude = stop.row.columns[2];
        this.longitude = stop.row.columns[3];
        this.position = [stop.row.columns[2], stop.row.columns[3]];
        this.address = stop.row.columns[4];

        if (stop.row.columns[6]['ARRIVAL'] === null) {
            this.arrivalDelay = null
        } else {
            this.arrivalDelay = stop.row.columns[6]['ARRIVAL']['DELAY']; 
        };

        if (stop.row.columns[6]['DEPARTURE'] === null) {
            this.departureDelay = null
        } else {
            this.departureDelay = stop.row.columns[6]['DEPARTURE']['DELAY']; 
        };
    }
};

export default Stop;
