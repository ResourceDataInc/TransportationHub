import {Icon, Point} from 'leaflet';

export const redBusIcon = (size) => {
    return new Icon({
        iconUrl: require('../icons/red-bus.png'),
        iconSize: new Point(size, size),
    });
};
