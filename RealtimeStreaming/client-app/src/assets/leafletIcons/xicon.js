import {Icon, Point} from 'leaflet';

export const xIcon = (size) => { 
    return new Icon({
        iconUrl: require('../icons/x-icon.png'),
        iconSize: new Point(size, size),
    });
};
