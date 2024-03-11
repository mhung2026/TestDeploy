import React, { useState, useEffect } from 'react';
import CallApi from '../CallApi';
import LocationSelector from '../../location/LocationSelector';

export default function Agencydangtinpart1({ sendData }) {
    const [directs, setDirects] = useState([]);
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));

    const [errorMessage, setErrorMessage] = useState('');

    // Function to check if all required fields are filled
    const validateForm = () => {
        const { realestateName, address, description, length, width, numberOfRooms, price } = propertyInfo;
        if (realestateName === null || address === null || description === null || length === null || width === null || numberOfRooms === null || price === null) {
            setErrorMessage('Please fill in all required fields.');
            return false;
        }
        return true;
    };

    const [selectedLocation, setSelectedLocation] = useState({
        provinceName: '',
        districtName: '',
        wardName: '',
        // Thêm directsid vào selectedLocation
    });
    const [propertyInfo, setPropertyInfo] = useState({
        realestateName: '',
        address: '',
        discription: '',
        length: '',
        width: '',
        roomNumber: '',
        discount: '',
        area: '',
        price: '',
        // city: '', // Thêm provinceName vào propertyInfo
        // district: '', // Thêm districtName vào propertyInfo
        // ward: '', // Thêm wardName vào propertyInfo
        directId: '',
        firebaseId: "",
        investorId: userLoginBasicInformationDto.accountId,
        payId: '1',
        legalStatus: 'Sổ Hồng',
    });

    useEffect(() => {
        const fetchDirects = async () => {
            try {
                const callDataAllDirect = await CallApi.getAllDirect();
                setDirects(callDataAllDirect);
            } catch (error) {
                console.error('Error fetching directs:', error.message);
            }
        };

        fetchDirects();
    }, []);
    // Tính diện tích khi có sự thay đổi trong chiều dài hoặc chiều rộng
    useEffect(() => {
        const { length, width } = propertyInfo;
        if (length && width) {
            const area = parseFloat(length) * parseFloat(width);
            setPropertyInfo(prevState => ({
                ...prevState,
                area: area.toFixed(0), // Làm tròn đến 2 chữ số thập phân
            }));
        }
    }, [propertyInfo.length, propertyInfo.width]);

    useEffect(() => {
        if (validateForm()) {
            sendData(propertyInfo);
        }
    }, [propertyInfo, sendData]);

    const handleLocationSelect = (selectedLocation) => { // Thay đổi tham số truyền vào thành selectedLocation
        setSelectedLocation(selectedLocation); // Cập nhật selectedLocation
        setPropertyInfo(prevState => ({
            ...prevState,
            city: selectedLocation.provinceName, // Cập nhật provinceName
            district: selectedLocation.districtName, // Cập nhật districtName
            ward: selectedLocation.wardName, // Cập nhật wardName

        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPropertyInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleDirectSelect = (directId) => {
        setSelectedLocation({ ...selectedLocation, directId });
        setPropertyInfo(prevState => ({
            ...prevState,
            directId: directId // Cập nhật directsid trong propertyInfo
        }));
        console.log('Selected Direct ID:', directId);
    };

    const handlePriceInputChange = (e) => {
        const { name, value } = e.target;
        // Xử lý chỉ cho phép nhập số và dấu phẩy
        const regex = /^[0-9,]*$/;
        if (regex.test(value)) {
            // Loại bỏ các dấu phẩy để chuyển đổi về số nguyên
            const integerValue = parseInt(value.replace(/,/g, ''), 10);
            // Kiểm tra nếu là số nguyên thì thực hiện chuyển đổi định dạng
            if (!isNaN(integerValue)) {
                const formattedValue = integerValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                setPropertyInfo(prevState => ({
                    ...prevState,
                    [name]: formattedValue
                }));
            }
        }
    };
    return (
        <div className='thongtinchitietdangtin'>
            <div className='thongtinchitietdangtindulieu'>
                <div className='thongtinchitietdangtindulieutieude'>
                    <span className='tieude'>Thông tin tin cơ bản</span>
                    <input type="text" name="realestateName" value={propertyInfo.realestateName} onChange={handleInputChange} placeholder="Tên bất động sản" />
                </div>

                <div className='thongtinchitietdangtinluachon'>
                    <LocationSelector onSelect={handleLocationSelect} selectedLocation={selectedLocation} className='luachon' />
                    <select onChange={(e) => handleDirectSelect(e.target.value)}>
                        <option value="">Select Direct</option>
                        {directs.map(direct => (
                            <option key={direct.id} value={direct.id}>{direct.directName}</option>
                        ))}
                    </select>
                </div>
                <div style={{marginTop: '10px', marginBottom: '10px'}}>
                    <span className='' style={{fontSize: '16px'}}>Địa chỉ</span>
                    <input style={{marginTop: "10px"}} type="text" name="address" value={propertyInfo.address} onChange={handleInputChange} placeholder="Số nhà" />
                </div>
                <div>
                    <span className='tieude'>Thông tin bài viết</span>
                    <textarea name="discription" value={propertyInfo.discription} onChange={handleInputChange} placeholder="Mô tả" />
                </div>
                <div>
                    <span className='tieude'>Thông tin bất động sản</span>
                    <input type="text" name="length" value={propertyInfo.length} onChange={handleInputChange} placeholder="Chiều dài (đơn vị m)" />
                    <input type="text" name="width" value={propertyInfo.width} onChange={handleInputChange} placeholder="Chiều rộng (đơn vị m)" />
                    <input type="text" name="area" value={propertyInfo.area} placeholder="Diện tích (m^2)" readOnly />
                    <input type="text" name="roomNumber" value={propertyInfo.roomNumber} onChange={handleInputChange} placeholder="Số phòng" />
                    <input type="text" name="discount" value={propertyInfo.discount} onChange={handleInputChange} placeholder="Chiết Khấu" />
                    <input type="text" name="price" value={propertyInfo.price} onChange={handlePriceInputChange} placeholder="Mức giá" />
                </div>
            </div>
        </div>
    )
}
