import {Icon, Point} from 'leaflet';

export const greyBusIcon = (size) => {
    return new Icon({
        iconUrl: require('../icons/grey-bus.png'),
        iconSize: new Point(size, size),
    });
};
