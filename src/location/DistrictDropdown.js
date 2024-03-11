import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Token có thể được định nghĩa ở một nơi khác trong ứng dụng
const token = 'cbd8c7df-c8d2-11ee-b1d4-92b443b7a897';

const DistrictDropdown = ({ provinceCode, onSelect }) => {
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!provinceCode) {
                setDistricts([]);
                return;
            }

            try {
                const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceCode}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': token
                    }
                });
                setDistricts(response.data.data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };

        fetchDistricts();
    }, [provinceCode]);

    return (
        <select className="custom-select" onChange={(e) => onSelect(e.target.value, e.target.options[e.target.selectedIndex].text)}>
            <option value="">Chọn quận</option>
            {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                </option>
            ))}
        </select>
    );
};

export default DistrictDropdown;
