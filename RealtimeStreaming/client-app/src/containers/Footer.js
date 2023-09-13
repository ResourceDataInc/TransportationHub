import React, { useState } from 'react';
import { RoutesApi } from '../api/RoutesApi';

export const Footer = () => {
    const [path, setPath] = useState([]);

    const handleClick = async () => {
        const routeApi = new RoutesApi(13, 0);
        const data = await routeApi.getRoute();

        setPath(data);
    };

    /*
    return (
        <div className='row' id='footer'>
            <div className='col-12'>
                <button onClick={handleClick}>Test Route Path API</button>
                <p>{path}</p>
            </div>
        </div>
    )
    */
}