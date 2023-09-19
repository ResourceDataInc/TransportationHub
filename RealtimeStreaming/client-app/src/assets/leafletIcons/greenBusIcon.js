import {Icon, Point} from 'leaflet';

export const greenBusIcon = (size) => { 
    return new Icon({
        iconUrl: require('../icons/green-bus.png'),
        iconSize: new Point(size, size),
    });
};
