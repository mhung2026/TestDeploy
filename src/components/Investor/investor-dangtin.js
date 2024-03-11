import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, removeToken } from '../../authentication/Auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LocationSelector from '../../location/LocationSelector';
import Avatar from "@mui/material/Avatar";
import { storage } from "../../firebase/addimage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
import UserInvestor from '../../list/userInvestor';
import InvestorMenu from './investor-menu';
const Home = () => {
    const [directs, setDirects] = useState([]);
    const [selectedDirect, setSelectedDirect] = useState('');
    const [selectedDirectId, setSelectedDirectId] = useState('');

    const [successMessage, setSuccessMessage] = useState("");
    const [previewImage, setPreviewImage] = useState([]);
    const [previewImages1, setPreviewImages1] = useState([]);
    const [previewImages2, setPreviewImages2] = useState([]);
    const [previewImages3, setPreviewImages3] = useState([]);
    const [previewImages4, setPreviewImages4] = useState([]);

    const PreviewImage = ({ previewImages, handleImageChange, handleSubmit }) => {
        const defaultImage = 'logoinvestor/no-image-news.png'; // Đường dẫn của ảnh mặc định

        // console.log("PreviewImages:", previewImages);

        return (
            <div className="App123">
                {previewImages && previewImages.length > 0 ? (
                    <>
                        <img src={previewImages[0]} alt="Preview" style={{ width: '300px', height: '300px' }} />
                        <input className='chontep' type="file" onChange={handleImageChange} />
                    </>
                ) : (
                    <>
                        <img src={defaultImage} alt="Default" style={{ width: '200px', height: '200px' }} />
                        <input className='chontep' type="file" onChange={handleImageChange} />
                    </>
                )}
            </div>
        );
    };

    const resetImages = () => {
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setImage5(null);
        setPreviewImage([]);
        setPreviewImages1([]);
        setPreviewImages2([]);
        setPreviewImages3([]);
        setPreviewImages4([]);
        setUr(null);
        setUrl(null);
        setUrl2(null);
        setUrl23(null);
        setUrl1234(null);
    };
    function formatPrice(price) {
        // Loại bỏ tất cả các dấu phân cách hàng nghìn và chỉ giữ lại ký tự số
        const numericPrice = price.replace(/\D/g, '');

        // Định dạng lại chuỗi giá trị với dấu phân cách hàng nghìn
        const formattedPrice = numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        console.log("TEST numericPrice: ", numericPrice);
        console.log("TEST price: ", formattedPrice);
        return formattedPrice;
    }

    const formatAndSetPrice = (price) => {
        const numericPrice = price.replace(/\D/g, ''); // Loại bỏ tất cả các ký tự không phải số
        const formattedPrice = formatPrice(numericPrice); // Định dạng giá trị price
        setPropertyInfo({ ...propertyInfo, price: formattedPrice }); // Cập nhật giá trị price đã được định dạng vào state
    };


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
        // console.log('Selected Location:', location);
    };

    const accessToken = getToken();
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userLoginBasicInformationDto');
        navigate('/login');
    };

    const [propertyInfo, setPropertyInfo] = useState({
        realestateName: '',
        address: '',
        roomNumber: '',
        discription: '',
        length: '',
        width: '',
        area: '',
        price: '',
        discount: '',
    });

    const [hardcodedValues, setHardcodedValues] = useState({
        firebaseId: "",
        payId: 1,
        locationId: 0,
        directId: 2,
        perimeter: "50",
        legalStatus: "Sổ Đỏ",
        status: 1,
        ward: selectedLocation.wardName,
        district: selectedLocation.districtName,
        city: selectedLocation.provinceName,
        listRealEstateImageUrl: [],
    });

    const calculateArea = () => {
        const length = parseFloat(propertyInfo.length);
        const width = parseFloat(propertyInfo.width);
        if (!isNaN(length) && !isNaN(width)) {
            const area = length * width;
            setPropertyInfo(prevState => ({
                ...prevState,
                area: area.toString() + ' m²', // Thêm " m²" vào giá trị diện tích
            }));
        }
    };
    useEffect(() => {
        console.log('ward:', selectedLocation.wardName);
        console.log('district:', selectedLocation.districtName);
        console.log('city:', selectedLocation.provinceName);
        setHardcodedValues(prevState => ({
            ...prevState,
            ward: selectedLocation.wardName,
            district: selectedLocation.districtName,
            city: selectedLocation.provinceName,
        }));
    }, [selectedLocation]);

    // Sử dụng useEffect để gọi hàm tính diện tích mỗi khi chiều dài hoặc chiều rộng thay đổi
    useEffect(() => {
        calculateArea();
    }, [propertyInfo.length, propertyInfo.width]);
    const submitDataToSwagger = async () => {
        try {
            const downloadURL = await handleSubmit();
            const downloadURL2 = await handleSubmit1();
            const downloadURL3 = await handleSubmit2();
            const downloadURL4 = await handleSubmit3();
            const downloadURL5 = await handleSubmit4();

            const dataToSubmit = {
                ...hardcodedValues,
                ...propertyInfo,
                listRealEstateImageUrl: [
                    { imageName: "Ảnh Mặt Trước", imageUrl: downloadURL, status: true },
                    { imageName: "Ảnh Bên Trái", imageUrl: downloadURL2, status: true },
                    { imageName: "Ảnh Bên Phải", imageUrl: downloadURL3, status: true },
                    { imageName: "Ảnh Sơ Đồ Đất", imageUrl: downloadURL4, status: true },
                    { imageName: "Ảnh Sơ Đồ Đất", imageUrl: downloadURL5, status: true }
                ],
            };
            const jsonString = JSON.stringify(dataToSubmit);
            console.log('Selected Location:', selectedLocation);
            console.log('City:', selectedLocation.provinceName);
            console.log('District:', selectedLocation.districtName);
            console.log('Ward:', selectedLocation.wardName);
            console.log('Data to submit:', dataToSubmit);
            await axios.post(
                'http://firstrealestate-001-site1.anytempurl.com/api/invester/createNewRealEstate/' + userLoginBasicInformationDto.accountId,
                jsonString,
                {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json-patch+json',
                    },
                }
            );
            console.log('Data pushed to Swagger successfully.');
        } catch (error) {
            console.error('Failed to push data to Swagger:', error.message);
        }
    };
    useEffect(() => {
        const fetchDirects = async () => {
            try {
                const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/direct/getAllDirect');
                setDirects(response.data); // Lưu trữ dữ liệu từ API vào state
            } catch (error) {
                console.error('Error fetching directs:', error.message);
            }
        };

        fetchDirects();
    }, []);

    const handleDirectChange = (e) => {
        const selectedDirectName = e.target.value;
        setSelectedDirect(selectedDirectName);
        // Tìm ID tương ứng của hướng
        const selectedDirectObject = directs.find(direct => direct.directName === selectedDirectName);
        if (selectedDirectObject) {
            setSelectedDirectId(selectedDirectObject.id);
            console.log("ID của hướng Tây Nam là:", selectedDirectObject.id);
            // Cập nhật state hardcodedValues với directId mới
            setHardcodedValues(prevState => ({
                ...prevState,
                directId: selectedDirectObject.id
            }));
        } else {
            setSelectedDirectId('');
        }
    };

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [image5, setImage5] = useState(null);
    const [downloadURLs, setDownloadURLs] = useState([]);
    const [ur, setUr] = useState(null);
    const [url, setUrl] = useState(null);
    const [url2, setUrl2] = useState(null);
    const [url23, setUrl23] = useState(null);
    const [x, setUrl1234] = useState(null);
    const handleImageChange = (e, setter, setPreviewImages) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const fileName = file.name; // Trích xuất tên tệp từ thuộc tính name của đối tượng file
            // Use FileReader to read file data and set preview image URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImages(prevImages => [...prevImages, reader.result]); // Add preview image URL to the array
            };
            reader.readAsDataURL(file);
            setter(file); // Set corresponding image state with selected file

            console.log('Selected file name:', fileName); // In tên tệp đã chọn ra console
        }
    };

    const imageName = propertyInfo.realestateName ? propertyInfo.realestateName.toLowerCase().replace(/\s+/g, '-') : "default";
    const handleSubmit = async () => {
        const imageRef1 = ref(storage, `Ảnh Mặt Trước-id-${userLoginBasicInformationDto.accountId}/${imageName}`);
        try {
            await uploadBytes(imageRef1, image1);
            const downloadURL = await getDownloadURL(imageRef1);

            setUr(downloadURL);

            // console.log('Download URL for Ảnh Mặt Trước:', downloadURL);

            setImage1(null);
            setHardcodedValues(prevState => ({
                ...prevState,

            }));
            return downloadURL;
        } catch (error) {
            console.log(error.message);
        }
    };




    const handleSubmit1 = async () => {
        const imageRef2 = ref(storage, `Ảnh Bên Trái-id-${userLoginBasicInformationDto.accountId}/${imageName}`);
        try {
            await uploadBytes(imageRef2, image2);
            const downloadURL2 = await getDownloadURL(imageRef2);

            setUrl(downloadURL2);
            setHardcodedValues(prevState => ({
                ...prevState,

            }));
            console.log(`Download URL for image Ảnh Bên Trái:`, downloadURL2);
            setImage2(null);
            return downloadURL2;
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit2 = async () => {
        const imageRef3 = ref(storage, `Ảnh Bên Phải-id-${userLoginBasicInformationDto.accountId}/${imageName}`);
        try {
            await uploadBytes(imageRef3, image3);
            const downloadURL3 = await getDownloadURL(imageRef3);
            setHardcodedValues(prevState => ({
                ...prevState,

            }));

            setUrl2(downloadURL3);
            console.log(`Download URL for image Ảnh Bên Phải:`, downloadURL3);
            setImage3(null);
            return downloadURL3;
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit3 = async () => {
        const imageRef4 = ref(storage, `Ảnh Sơ Đồ Đất-id-${userLoginBasicInformationDto.accountId}/${imageName}`);
        try {
            await uploadBytes(imageRef4, image4);
            const downloadURL4 = await getDownloadURL(imageRef4);
            setHardcodedValues(prevState => ({
                ...prevState,

            }));

            setUrl23(downloadURL4);
            console.log(`Download URL for image Ảnh Sơ Đồ Đất:`, downloadURL4);
            setImage4(null);
            return downloadURL4;
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit4 = async () => {
        const imageRef5 = ref(storage, `Ảnh Sổ Hồng-id-${userLoginBasicInformationDto.accountId}/${imageName}`);
        try {
            await uploadBytes(imageRef5, image5);
            const downloadURL5 = await getDownloadURL(imageRef5);
            setHardcodedValues(prevState => ({
                ...prevState,

            }));

            setUrl1234(downloadURL5);
            console.log(`Download URL for image Ảnh Sổ Hồng:`, downloadURL5);
            setImage5(null);
            return downloadURL5;
        } catch (error) {
            console.log(error.message);
        }
    };



    const fetchImages = async () => {
        try {
            const response = await axios.get("http://firstrealestate-001-site1.anytempurl.com/api/invester/getAllRealEstate");
            const imageUrls = response.data;
            setUr(imageUrls[0]);
            setUrl(imageUrls[1]);
        } catch (error) {
            console.error("Error fetching images:", error.message);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleSubmitData = async () => {
        try {
            // if (!image1 || !image2 || !image3 || !image4 || !image5) {
            //     console.log('Vui lòng chọn đủ tất cả các hình ảnh trước khi đăng tin.');
            //     return;
            // }

            resetImages();
            setPropertyInfo({
                realestateName: '',
                address: '',
                roomNumber: '',
                discription: '',
                length: '',
                width: '',
                area: '',
                price: '',
                discount: '',

            })
            await submitDataToSwagger();
            ;
            console.log({
                hardcodedValues,
                propertyInfo,
                //     downloadURLsArray,
            });
            setSuccessMessage("Đăng tin thành công!");
        } catch (error) {

            console.error('Failed to submit data:', error.message);
        }
    };

    return (
        <div className='container'>
            <InvestorMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserInvestor}
                handleLogout={handleLogout}
            />
            <div className="col-md-9 dangtinlist">
                <div className='trangdangtin'>
                    <span className='dangtin'>Trang Đăng Tin</span>
                </div>
                <div className='thongitnbatdongsan'>
                    <span className='tieude'>Thông tin tin cơ bản</span>
                    <span className='tieude1'>Tên bất động sản</span>
                    <input
                        className='select-location'
                        type="text"
                        value={propertyInfo.realestateName}
                        onChange={(e) => setPropertyInfo({ ...propertyInfo, realestateName: e.target.value })}
                    />
                    <div className="select-location">
                        <span className='tieude1'>Địa chỉ</span>
                        <LocationSelector onSelect={handleLocationSelect} selectedLocation={selectedLocation} />
                    </div>
                    <span className='tieude1'>Số nhà</span>
                    <input
                        className='sonha'
                        type="text"
                        value={propertyInfo.address}
                        onChange={(e) => setPropertyInfo({ ...propertyInfo, address: e.target.value })}
                    />
                </div>
                <div className='thongtinbaiviet'>
                    <span className='tieude'>Thông tin bài viết</span>
                    <span className='tieude1'>Mô tả</span>
                    <textarea className='mota'
                        value={propertyInfo.discription}
                        onChange={(e) => setPropertyInfo({ ...propertyInfo, discription: e.target.value })}
                    ></textarea>
                </div>
                <div className='thongtinbatdongsan1'>
                    <span className='tieude'>Thông tin bất động sản</span>
                    <div className='cdcrdt'>
                        <div className='chieudai'>
                            <span className='tieude1'>Chiều dài</span>
                            <input
                                type="text"
                                value={propertyInfo.length ? (propertyInfo.length.endsWith('m') ? propertyInfo.length : propertyInfo.length + ' m') : ''}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    let cursorPosition = e.target.selectionStart;

                                    // Kiểm tra nếu con trỏ nằm sau chữ 'm', thì xóa hết dữ liệu trước khi nhập liệu mới
                                    if (inputValue.includes('m') && cursorPosition > inputValue.indexOf('m') + 1) {
                                        e.target.value = inputValue.slice(0, inputValue.indexOf('m') + 1);
                                        cursorPosition = inputValue.indexOf('m') + 1;
                                    }

                                    // Loại bỏ ký tự 'm' và các ký tự không hợp lệ khác
                                    const newValue = inputValue.replace(/[^\d.]/g, '');

                                    // Cập nhật giá trị vào state
                                    setPropertyInfo({ ...propertyInfo, length: newValue });

                                    // Di chuyển con trỏ lên trước chữ 'm'
                                    if (newValue.includes('m')) {
                                        cursorPosition--;
                                    }

                                    // Sử dụng setTimeout để đảm bảo con trỏ được di chuyển sau khi giá trị đã được cập nhật vào trường input
                                    setTimeout(() => {
                                        e.target.setSelectionRange(cursorPosition, cursorPosition);
                                    });
                                }}
                            />
                        </div>

                        <div className='chieurong'>
                            <span className='tieude1'>Chiều rộng</span>
                            <input
                                type="text"
                                value={propertyInfo.width ? (propertyInfo.width.endsWith('m') ? propertyInfo.width : propertyInfo.width + ' m') : ''}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    let cursorPosition = e.target.selectionStart;

                                    // Kiểm tra nếu con trỏ nằm sau chữ 'm', thì xóa hết dữ liệu trước khi nhập liệu mới
                                    if (inputValue.includes('m') && cursorPosition > inputValue.indexOf('m') + 1) {
                                        e.target.value = inputValue.slice(0, inputValue.indexOf('m') + 1);
                                        cursorPosition = inputValue.indexOf('m') + 1;
                                    }

                                    // Loại bỏ ký tự 'm' và các ký tự không hợp lệ khác
                                    const newValue = inputValue.replace(/[^\d.]/g, '');

                                    // Cập nhật giá trị vào state
                                    setPropertyInfo({ ...propertyInfo, width: newValue });

                                    // Di chuyển con trỏ lên trước chữ 'm'
                                    if (newValue.includes('m')) {
                                        cursorPosition--;
                                    }

                                    // Sử dụng setTimeout để đảm bảo con trỏ được di chuyển sau khi giá trị đã được cập nhật vào trường input
                                    setTimeout(() => {
                                        e.target.setSelectionRange(cursorPosition, cursorPosition);
                                    });
                                }}
                            />
                        </div>

                        <div className='dientich'>
                            <span className='tieude1'>Diện tích</span>
                            <input
                                type="text"
                                value={propertyInfo.area}
                                readOnly
                                onChange={(e) => setPropertyInfo({ ...propertyInfo, area: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className='spck'>
                        <div className='sophong'>
                            <span className='tieude1'>Số phòng</span>
                            <input
                                type="text"
                                value={propertyInfo.roomNumber}
                                onChange={(e) => setPropertyInfo({ ...propertyInfo, roomNumber: e.target.value })}
                            />
                        </div>
                        <div className='chietkhau'>
                            <span className='tieude1'>Chiết Khấu</span>
                            <input
                                type="text"
                                value={propertyInfo.discount}
                                onChange={(e) => setPropertyInfo({ ...propertyInfo, discount: e.target.value })}
                            />
                        </div>
                        <div className='mucgia'>
                            <span className='tieude1'>Mức giá</span>
                            <input
                                type="text"
                                value={propertyInfo.price}
                                onChange={(e) => formatAndSetPrice(e.target.value)}
                            />
                        </div>
                        <div className='dropdown'>
                            <select className='chonhuong' id="directSelect" value={selectedDirect} onChange={handleDirectChange}>
                                <option value="">Chọn Hướng</option>
                                {directs.map(direct => (
                                    <option key={direct.id} value={direct.directName}>{direct.directName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <span className='chonbatdongsan'>Chọn các ảnh bất động sản</span>
                    <div className="image-grid">

                        <div className="image-section">
                            <span>Hình ảnh mặt trước</span>
                            <PreviewImage
                                previewImages={previewImage}
                                handleImageChange={(e) => handleImageChange(e, setImage1, setPreviewImage)}
                                handleSubmit={handleSubmit}
                            />
                        </div>

                        <div className="image-section">
                            <span>Hình ảnh bên trái</span>
                            <PreviewImage
                                previewImages={previewImages1}
                                handleImageChange={(e) => handleImageChange(e, setImage2, setPreviewImages1)}
                                handleSubmit={handleSubmit1}
                            />
                        </div>

                        <div className="image-section">
                            <span>Hình ảnh bên phải</span>
                            <PreviewImage
                                previewImages={previewImages2}
                                handleImageChange={(e) => handleImageChange(e, setImage3, setPreviewImages2)}
                                handleSubmit={handleSubmit2}
                            />
                        </div>

                        <div className="image-section">
                            <span>Hình ảnh sơ đồ đất</span>
                            <PreviewImage
                                previewImages={previewImages3}
                                handleImageChange={(e) => handleImageChange(e, setImage4, setPreviewImages3)}
                                handleSubmit={handleSubmit3}
                            />
                        </div>

                        <div className="image-section">
                            <span>Hình ảnh sổ hồng</span>
                            <PreviewImage
                                previewImages={previewImages4}
                                handleImageChange={(e) => handleImageChange(e, setImage5, setPreviewImages4)}
                                handleSubmit={handleSubmit4}
                            />
                        </div>
                    </div>


                </div>

                <div className='trangdangtin'>
                    <button className='button-dangtin' onClick={handleSubmitData}>ĐĂNG TIN</button>
                    <p>{successMessage}</p>
                </div>

            </div>
        </div>
    );
}

export default Home;