import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserInvestor from '../../list/userInvestor';
import InvestorMenu from './investor-menu';
import { removeToken } from '../../authentication/Auth';
import { useNavigate } from 'react-router-dom';

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
        navigate(`/investorthongtinchitiet/${estate.id}`);
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
            <InvestorMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserInvestor}
                handleLogout={handleLogout}
            />
            <div className="col-md-9 listrealfix ">
                <h1 style={{fontSize: '24px'}}>Danh sách tin đăng đã đăng</h1>
                <div className='listreal1'>
                    <table className="table1">
                        <thead>
                            <tr>
                                {/* <th>STT</th> */}
                                <th>Tên bất động sản</th>
                                {/* <th>Trạng thái</th> */}

                            </tr>
                        </thead>
                        <tbody>
                            {realEstates.map((estate, index) => (
                                <tr key={estate.id}>
                                    <li key={index}>
                                        {/* Sử dụng onClick để gọi hàm xử lý khi bấm vào tên bất động sản */}
                                        {/* <td>{estate.id}</td> */}
                                        {/* <td>{estate.realestateName}</td> */}
                                        <p onClick={() => handleRealEstateClick(estate)}>{estate.realestateName}</p>

                                    </li>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
