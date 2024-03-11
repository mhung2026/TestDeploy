import Avatar from "@mui/material/Avatar";
import React, { useState, useEffect } from 'react';
import { storage } from "../../firebase/addimage";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function Agencydangtinpart2({ sendData }) {
  const [frontImages, setFrontImages] = useState([]);
  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);
  const [diagramImages, setDiagramImages] = useState([]);
  const [certificateImages, setCertificateImages] = useState([]);
  const [listRealEstateImageUrl, setListRealEstateImageUrl] = useState([]);

  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingLeft, setUploadingLeft] = useState(false);
  const [uploadingRight, setUploadingRight] = useState(false);
  const [uploadingDiagram, setUploadingDiagram] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);

  const handleImageChange = async (e, setImageFunction, setUploadingFunction) => {
    const selectedImages = e.target.files;
    const newImages = [];

    await clearImagesInStorage(setImageFunction);

    setUploadingFunction(true);

    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
      const imageObjectURL = URL.createObjectURL(image);
      newImages.push({ file: image, url: imageObjectURL });
      uploadImageToFirebase(image, setImageFunction, setUploadingFunction);
    }

    setImageFunction(newImages);
  };

  const getImageName = (setImageFunction) => {
    switch (setImageFunction) {
      case setFrontImages:
        return 'Ảnh Mặt Trước';
      case setLeftImages:
        return 'Ảnh Mặt Trái';
      case setRightImages:
        return 'Ảnh Mặt Phải';
      case setDiagramImages:
        return 'Ảnh Sơ Đồ Đất';
      case setCertificateImages:
        return 'Ảnh Sổ Hồng';
      default:
        return 'Ảnh không xác định';
    }
  };

  const uploadImageToFirebase = (image, setImageFunction, setUploadingFunction) => {
    const folder = getImageFolder(setImageFunction);
    const imageRef = ref(storage, `${folder}/${image.name}`);

    console.time("uploadTime");

    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            const imageName = getImageName(setImageFunction);
            const imageUrl = url;
            const status = true;
            const updatedList = [...listRealEstateImageUrl, { imageName, imageUrl, status }];
            setListRealEstateImageUrl(updatedList);

            console.log(`"${imageName}" đã được tải lên thành công:`, imageUrl);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          })
          .finally(() => {
            setUploadingFunction(false);
            console.timeEnd("uploadTime");
          });
      })
      .catch((error) => {
        console.log(error.message);
        setUploadingFunction(false);
      });
  };

  useEffect(() => {
    sendData(listRealEstateImageUrl);
    console.log("listRealEstateImageUrl:", listRealEstateImageUrl);
  }, [listRealEstateImageUrl]);

  const clearImagesInStorage = async (setImageFunction) => {
    const folder = getImageFolder(setImageFunction);
    const images = getImageState(setImageFunction);

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageRef = ref(storage, `${folder}/${image.file.name}`);
      await deleteObject(imageRef);
    }
  };

  const getImageState = (setImageFunction) => {
    switch (setImageFunction) {
      case setFrontImages:
        return frontImages;
      case setLeftImages:
        return leftImages;
      case setRightImages:
        return rightImages;
      case setDiagramImages:
        return diagramImages;
      case setCertificateImages:
        return certificateImages;
      default:
        return [];
    }
  };

  const getImageType = (setImageFunction) => {
    switch (setImageFunction) {
      case setFrontImages:
        return 'Ảnh mặt trước';
      case setLeftImages:
        return 'Ảnh mặt trái';
      case setRightImages:
        return 'Ảnh mặt phải';
      case setDiagramImages:
        return 'Ảnh đất';
      case setCertificateImages:
        return 'Ảnh sổ hồng';
      default:
        return '';
    }
  };

  const getImageFolder = (setImageFunction) => {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    switch (setImageFunction) {
      case setFrontImages:
        return 'Ảnh mặt trước' + `-${userLoginBasicInformationDto.accountId}`;
      case setLeftImages:
        return 'Ảnh mặt trái' + `-${userLoginBasicInformationDto.accountId}`;
      case setRightImages:
        return 'Ảnh mặt phải' + `-${userLoginBasicInformationDto.accountId}`;
      case setDiagramImages:
        return 'Ảnh mặt sơ đồ đất' + `-${userLoginBasicInformationDto.accountId}`;
      case setCertificateImages:
        return 'Ảnh sổ hồng' + `-${userLoginBasicInformationDto.accountId}`;
      default:
        return '';
    }
  };

  return (
    <div className="hinhanh1">
      <br />
      <div className="hinhanhtongquan">
        {/* Ảnh mặt trước */}
        <div className="hinhanhtongquanmattruoc">
          <b style={{}}>Ảnh mặt trước:</b>
          <div className="image-container1">
            {uploadingFront ? ( // Nếu đang tải ảnh mặt trước, hiển thị loading
              <div className="loading-indicator">Đang tải ảnh mặt trước...</div>
            ) : (
              frontImages.map((image, index) => (
                <Avatar key={index} src={image.url} sx={{ width: 300, height: 300 }} variant="square" />
              ))
            )}
          </div>
          <input type="file" onChange={(e) => handleImageChange(e, setFrontImages, setUploadingFront)} multiple />
        </div>
        <br />
        {/* Ảnh mặt trái */}
        <div className="hinhanhtongquanmattrai">
          <b>Ảnh mặt trái:</b>
          <div className="image-container1">
            {uploadingLeft ? ( // Nếu đang tải ảnh mặt trái, hiển thị loading
              <div className="loading-indicator">Đang tải ảnh mặt trái...</div>
            ) : (
              leftImages.map((image, index) => (
                <Avatar key={index} src={image.url} sx={{ width: 300, height: 300 }} variant="square" />
              ))
            )}
          </div>
          <input type="file" onChange={(e) => handleImageChange(e, setLeftImages, setUploadingLeft)} multiple />
        </div>
        <br />
        {/* Ảnh mặt phải */}
        <div className="hinhanhtongquanmatphai">
          <b>Ảnh mặt bên phải:</b>
          <div className="image-container1">
            {uploadingRight ? ( // Nếu đang tải ảnh mặt phải, hiển thị loading
              <div className="loading-indicator">Đang tải ảnh mặt phải...</div>
            ) : (
              rightImages.map((image, index) => (
                <Avatar key={index} src={image.url} sx={{ width: 300, height: 300 }} variant="square" />
              ))
            )}
          </div>
          <input type="file" onChange={(e) => handleImageChange(e, setRightImages, setUploadingRight)} multiple />
        </div>
        <br />
        {/* Ảnh sơ đồ đất */}
        <div className="hinhanhtongquansododat">
          <b>Ảnh sơ đồ đất:</b>
          <div className="image-container1">
            {uploadingDiagram ? ( // Nếu đang tải ảnh sơ đồ đất, hiển thị loading
              <div className="loading-indicator">Đang tải ảnh sơ đồ đất...</div>
            ) : (
              diagramImages.map((image, index) => (
                <Avatar key={index} src={image.url} sx={{ width: 300, height: 300 }} variant="square" />
              ))
            )}
          </div>
          <input type="file" onChange={(e) => handleImageChange(e, setDiagramImages, setUploadingDiagram)} multiple />
        </div>
        <br />
        {/* Ảnh sổ hồng */}
        <div className="hinhanhtongquansohong">
          <b>Sổ hồng:</b>
          <div className="image-container1">
            {uploadingCertificate ? ( // Nếu đang tải ảnh sổ hồng, hiển thị loading
              <div className="loading-indicator">Đang tải ảnh sổ hồng...</div>
            ) : (
              certificateImages.map((image, index) => (
                <Avatar key={index} src={image.url} sx={{ width: 300, height: 300 }} variant="square" />
              ))
            )}
          </div>
          <input type="file" onChange={(e) => handleImageChange(e, setCertificateImages, setUploadingCertificate)} multiple />
        </div>
      </div>
    </div>
  );

}
