import React, { useEffect } from 'react';
import { Popup, Rectangle, useMap } from 'react-leaflet';

export const RectangleMarker = (props) => {
    const { bus, latitude, longitude } = props;
    const xOffset = 0.00015;
    const yOffset = 0.0002;
    const map = useMap();

    useEffect(() => {
        console.log(map.getZoom())
    })

    const status = () => {
        return 'green'
    };

    return (
        <div>
            <Rectangle 
                bounds={[[latitude - xOffset, longitude - yOffset], [latitude + xOffset, longitude + yOffset]]} 
                color={'black'}
                weight={1}
                fillColor={status()}
                fillOpacity={1}
            >
                <Popup>This is bus number {bus.row.columns[0]}</Popup>
            </Rectangle>
        </div>
    )
};
