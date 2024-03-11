import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { storage } from "../../firebase/addimage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CallApi from '../CallApi';

export default function AgencyCustomerDetailPage() {
    const { customerId, realEstateId } = useParams();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [locationId, setlocationId] = useState(null);
    const [seturlimg, setseturlimg] = useState(null);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [filterRealEstate, setFilterRealEstate] = useState(null);
    const [filePreviews, setFilePreviews] = useState([]); // State for storing file previews

    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));

    useEffect(() => {
        const fetchRealEstate = async () => {
            try {
                const allRealEstateResponse = await CallApi.getAllRealEstate();
                const foundRealEstate = allRealEstateResponse.find(re => re.id === parseInt(realEstateId));
                setFilterRealEstate(foundRealEstate);
                const locationResponse = await CallApi.getAllLocation();
                const foundLocation = locationResponse.find(location => location.id === foundRealEstate.locationId);
                setlocationId(foundLocation)

            } catch (error) {
                console.error('Error fetching real estate data:', error);
            }
        };

        fetchRealEstate();
    }, [realEstateId]);

    useEffect(() => {
        // Generate file previews
        setFilePreviews(selectedFiles.map(file => {
            const src = URL.createObjectURL(file);
            return { name: file.name, src: src };
        }));
    }, [selectedFiles]);

    const handleFileChange = async (event) => {
        const files = event.target.files;
        const newFiles = Array.from(files);

        setUploadingFiles(true);
        setSelectedFiles(newFiles);
        setUploadingFiles(false);
    };

    const uploadFileToFirebase = async (file) => {
        const fileRef = ref(storage, `uploadedFiles/${userLoginBasicInformationDto.accountId}/${file.name}`);
        try {
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            console.log(`File uploaded successfully: ${url}`);
            setseturlimg(url);

            return url;
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            return '';
        }
    };

    const sendToSwagger = async () => {
        try {
            // Tải lên các tệp lên Firebase và thu thập URL của chúng
            const firebaseUrls = await Promise.all(selectedFiles.map(async file => {
                const url = await uploadFileToFirebase(file);
                return url;
            }));
    
            // Sử dụng URL trả về từ Firebase cho thuộc tính firebaseId
            const firebaseUrlsObject = seturlimg;
    
            // Tạo đối tượng chứa các thông tin cần gửi
            const requestData = {
                id: filterRealEstate.id,
                firebaseId: firebaseUrlsObject,
                investorId: filterRealEstate.investorId,
                payId: 1,
                locationId: filterRealEstate.locationId,
                directId: filterRealEstate.directId,
                realestateName: filterRealEstate.realestateName,
                address: filterRealEstate.address,
                roomNumber: filterRealEstate.roomNumber,
                length: filterRealEstate.length,
                width: filterRealEstate.width,
                perimeter: customerId,
                area: filterRealEstate.area,
                legalStatus: filterRealEstate.legalStatus,
                price: filterRealEstate.price,
                discription: filterRealEstate.discription,
                status: 6,
                listRealEstateImageUrl: filterRealEstate.realEstateImages,
                City: locationId.city,
                Ward: locationId.ward,
                District: locationId.district,
            };
    
            console.log('Sending data to Swagger:', requestData);
    
            // Gửi dữ liệu đến Swagger
            axios.put(`http://firstrealestate-001-site1.anytempurl.com/api/invester/updatePostById/${realEstateId}`, requestData)
                .then(response => {
                    console.log('Response from Swagger:', response.data);
                })
                .catch(error => {
                    console.error('Error sending data to Swagger:', error);
                });
        } catch (error) {
            console.error('Error uploading files to Firebase:', error);
        }
    };
    





    return (
        <div>
            <h1>Customer Details</h1>
            {/* File Upload Section */}
            <span>Vui lòng chọn ảnh</span>
            {uploadingFiles ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <input type="file" onChange={handleFileChange} multiple />
                 
                    <div>
                        {filePreviews.map((file, index) => (
                            <div key={index}>
                                <p>{file.name}</p>
                                {file.src && <img src={file.src} alt="File preview" style={{ width: "100px", height: "100px" }} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
               <button onClick={sendToSwagger}>Đã cọc</button>
        </div>
    );
}
