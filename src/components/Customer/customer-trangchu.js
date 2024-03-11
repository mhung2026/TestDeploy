import React from 'react';
import CustomerFillter from './customer-fillter';
import Customertrangchubanvila from './customer-trangchu-banvila';
import Customerchaomung from './customer-chaomung';
import Customertrangchutinnoibat from './customer-trangchu-tinnoibat';


export default function Trangchu() {

    return (
        <div>
            {/* <CustomerFillter /> */}
            <Customertrangchubanvila /> {/* Đã fix xong */}
            <Customerchaomung />
            <Customertrangchutinnoibat />
        </div>
    );
}
