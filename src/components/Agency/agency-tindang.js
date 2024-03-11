import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserAgency from '../../list/userAgency';
import Agencymenu from './agency-menu';
import { getToken, removeToken } from '../../authentication/Auth';
import { useNavigate } from 'react-router-dom';
import Agencythongtinchitiet from './agency-thongtinchitiet';
// Import các module và components cần thiết

export default function Agencytindang() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const navigate = useNavigate();
    const handleLogout = () => {
        removeToken();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userLoginBasicInformationDto');
        navigate('/login');
    };
    const [realEstates, setRealEstates] = useState([]);

    const handleRealEstateClick = (estate) => {
        // Chuyển hướng đến trang khác khi người dùng bấm vào tên bất động sản
        navigate(`/agencythongtinchitiet/${estate.id}`);
    };

    useEffect(() => {
        axios.get('http://firstrealestate-001-site1.anytempurl.com/api/invester/getAllRealEstate')
            .then(response => {
                // Lọc tất cả các bất động sản có Investor ID: 2
                const estatesWithInvestorId2 = response.data.filter(estate => estate.investorId === 6);
                setRealEstates(estatesWithInvestorId2);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    return (
        <div className='container'>
            <Agencymenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserAgency}
                handleLogout={handleLogout}
            />
            <div className="col-md-9 ">
                <h1>Real Estates for Investor ID 2:</h1>
                <ul>
                    {realEstates.map((estate, index) => (
                        <li key={index}>
                            {/* Sử dụng onClick để gọi hàm xử lý khi bấm vào tên bất động sản */}
                            <h2 onClick={() => handleRealEstateClick(estate)}>{estate.realestateName}</h2>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
