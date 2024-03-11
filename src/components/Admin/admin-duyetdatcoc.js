import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import CallApi from '../CallApi';

export default function AdminDuyetdatcoc() {
    const [realEstatesWithPerimeter, setRealEstatesWithPerimeter] = useState([]);
    const navigate = useNavigate(); // Sử dụng hook useNavigate

    useEffect(() => {
        const fetchRealEstate = async () => {
            try {
                const allRealEstateResponse = await CallApi.getAllRealEstate();
                const realEstatesWithPerimeter = allRealEstateResponse.filter(re => re.perimeter);
                setRealEstatesWithPerimeter(realEstatesWithPerimeter);
            } catch (error) {
                console.error('Error fetching real estate data:', error);
            }
        };

        fetchRealEstate();
    }, []);

    // Hàm xử lý chuyển hướng khi nhấp vào tên real estate
    const handleRealEstateClick = (realEstateId) => {
        navigate(`/real-estate/${realEstateId}`);
    };

    return (
        <div>
            <h2>Admin duyệt đặt cọc</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {realEstatesWithPerimeter.map(realEstate => (
                        <tr key={realEstate.id}>
                            <td>{realEstate.id}</td>
                            <td onClick={() => handleRealEstateClick(realEstate.id)} style={{ cursor: 'pointer' }}>{realEstate.perimeter}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </table>
          
        </div>
    );
}
