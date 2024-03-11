import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WardDropdown = ({ districtCode, onSelect }) => {
    const [wards, setWards] = useState([]);
    const token = 'cbd8c7df-c8d2-11ee-b1d4-92b443b7a897'; // Thay token của bạn vào đây

    useEffect(() => {
        const fetchWards = async () => {
            if (!districtCode) {
                setWards([]);
                return;
            }

            try {
                const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtCode}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': token
                    }
                });
                setWards(response.data.data);
            } catch (error) {
                console.error('Error fetching wards:', error);
            }
        };

        fetchWards();
    }, [districtCode]);

    return (
        <select className="custom-select" onChange={(e) => onSelect(e.target.value, e.target.options[e.target.selectedIndex].text)}>
            <option value="">Chọn phường</option>
            {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                </option>
            ))}
        </select>
    );
};

export default WardDropdown;
