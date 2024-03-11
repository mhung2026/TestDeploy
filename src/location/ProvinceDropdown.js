import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProvinceDropdown = ({ onSelect }) => {
    const [provinces, setProvinces] = useState([]);
    const token = 'cbd8c7df-c8d2-11ee-b1d4-92b443b7a897'; // Thay token của bạn vào đây

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': token
                    }
                });
                const tphcmHanoiProvinces = response.data.data.filter(province =>
                    province.ProvinceName.includes('Hồ Chí Minh') ||
                    province.ProvinceName.includes('Hà Nội')
                );
                setProvinces(tphcmHanoiProvinces);
                //   setProvinces(response.data.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <select className="custom-select" onChange={(e) => onSelect(e.target.value, e.target.options[e.target.selectedIndex].text)}>
            <option value="">Chọn tỉnh</option>
            {provinces.map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                </option>
            ))}
        </select>
    );
};

export default ProvinceDropdown;
