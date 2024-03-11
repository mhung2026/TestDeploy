import React, { useState, useEffect } from 'react';
import LocationSelector from '../../location/LocationSelector';
import dientichList from '../../list/dientichList ';
import huongList from '../../list/huongList';
export default function Customerfillter() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        provinceCode: '',
        provinceName: '',
        districtCode: '',
        districtName: '',
        wardCode: '',
        wardName: '',
    });

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        console.log('Selected Location:', location);
    };
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown); // Đảo ngược trạng thái hiển thị dropdown
    };

    return (
        <div className='fillter'>
            <div className='fillter1'>
                <div className='loccanhoban'>
                    <span className='canhoban'>LỌC CĂN HỘ BÁN</span>
                </div>
                <LocationSelector onSelect={handleLocationSelect} selectedLocation={selectedLocation} />
                <div className='dthtk'>
                    <select className='ct-button-fillter' onClick={toggleDropdown}>
                        <option className='text-fillter' value="">Chọn diện tích</option>
                        {dientichList.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                    </select>

                    <select className='ct-button-fillter' onClick={toggleDropdown}>
                        <option className='text-fillter' value="">Chọn hướng</option>
                        {huongList.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <button className='ct-button-fillters'>TÌM KIẾM</button>

                </div>
            </div>
        </div>
    );
}
