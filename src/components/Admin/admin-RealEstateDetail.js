// RealEstateDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CallApi from '../CallApi';

export default function AdminRealEstateDetail() {
    const { id } = useParams();
    
    const [realEstate, setRealEstate] = useState(null);

    useEffect(() => {
        const fetchRealEstateDetail = async () => {
            try {
                const realEstateResponse = await CallApi.getAllRealEstate();
                const findIdRes = realEstateResponse.find(IdRealestate => IdRealestate.id === parseInt(id));
                setRealEstate(findIdRes); // Set realEstate with the found result
            } catch (error) {
                console.error('Error fetching real estate detail:', error);
            }
        };

        fetchRealEstateDetail();
    }, [id]);

    if (!realEstate) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Real Estate Detail</h2>
            <p>ID: {realEstate.id}</p>
            <p>Name: {realEstate.perimeter}</p>
       {/* Trong JSX */}
<img src={realEstate.firebaseId} alt="Ảnh Đặt Cọc" style={{ maxWidth: '400px', height: 'auto' }} />

            <button>Duyệt</button>
            {/* Add more details as needed */}
        </div>
    );
}
