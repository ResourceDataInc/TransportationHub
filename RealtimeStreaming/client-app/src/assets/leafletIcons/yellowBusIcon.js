import {Icon, Point} from 'leaflet';

export const yellowBusIcon = (size) => { 
    return new Icon({
        iconUrl: require('../icons/yellow-bus.png'),
        iconSize: new Point(size, size),
    });
};
