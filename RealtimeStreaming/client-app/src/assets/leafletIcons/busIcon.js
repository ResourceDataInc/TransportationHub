import L, {Icon, Point} from 'leaflet';

const busIcon = new Icon({
    iconUrl: require('../icons/icons8-bus-material-rounded-16.png'),
    iconRetinaUrl: require('../icons/icons8-bus-material-rounded-16.png'),
    iconSize: new Point(15, 15),
    //iconAnchor: null,
    //popupAnchor: null,
    //shadowUrl: null,
    //shadowSize: null,
    //shadowAnchor: null,
});

export { busIcon };