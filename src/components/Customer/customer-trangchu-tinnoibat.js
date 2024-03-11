import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Customertrangchubanvila() {
  const [realEstates, setRealEstates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState('');
  const [showAllEstates, setShowAllEstates] = useState(false); // Trạng thái để kiểm soát việc hiển thị tất cả các căn hộ

  useEffect(() => {
    axios.get('http://firstrealestate-001-site1.anytempurl.com/api/invester/getAllRealEstate')
      .then(response => {
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        const latestRealEstates = sortedData.slice(0, 10);
        setRealEstates(latestRealEstates);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
    axios.get('http://firstrealestate-001-site1.anytempurl.com/api/location/getAllLocation')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error fetching location data: ', error);
      });
  }, []);
  useEffect(() => {
    if (realEstates.length > 0 && locations.length > 0) {
      const cities = getCity();
      if (cities.length > 0) {
        setCity(cities[0]); // Lấy thành phố đầu tiên từ mảng cities
      }
    }
  }, [realEstates, locations]);

  // Hàm giới hạn số từ trong một chuỗi
  const limitWords = (text, limit) => {
    if (text) {
      const words = text.split(' ');
      const truncatedWords = words.slice(0, limit);
      const truncatedText = truncatedWords.join(' ');
      if (words.length > limit) {
        return truncatedText + ' .....';
      }
      return truncatedText;
    }
    return "";
  };
  const getCity = () => {
    const cities = realEstates.map(estate => {
      const location = locations.find(location => location.id === getLocationID(estate));
      return location ? location.city : null;
    });
    return cities.filter(city => city !== null); // Lọc bỏ các giá trị null nếu có
  };
  const getLocationID = (realEstate) => {
    const locationID = realEstate.locationId;
    console.log("Status:", locationID);
    return locationID;
  }
  // Hàm lấy hình ảnh mặt trước của imageName từ danh sách realEstateImages
  const getFrontImages = (realEstate) => {
    return realEstate.realEstateImages.filter(image => image.imageName === 'Ảnh Mặt Trước');

  };
  const getPrice = (realEstates) => {
    const price = realEstates.price;
    return price;
  }
  const getStatus = (realEstate) => {
    // Xác định trạng thái
    const status = realEstate.status === 1 ? 'Sắp Mở Bán' : '';
    console.log("Status:", status);
    return status;
  };



  // Hàm xử lý sự kiện khi nhấn vào nút "Xem Thêm"
  const handleShowAllEstates = () => {
    setShowAllEstates(true); // Thiết lập trạng thái hiển thị tất cả các căn hộ
  };

  // Hàm xử lý sự kiện khi nhấn vào nút "Thu gọn"
  const handleHideAllEstates = () => {
    setShowAllEstates(false); // Thiết lập trạng thái để ẩn tất cả các căn hộ
  };

  return (
    // JSX
    <div>

      <div className="estate-container">
        <div className='main-title'>
          <div class="real-title">
            <div className='text-realtitle'>
              <span className='textso1'>NHÀ ĐẤT</span>
              <h2 className='textso2'>NỔI BẬT</h2>
            </div>
          </div>
        </div>
        {/* <h1 className="investor-heading">Real Estates for Investor ID 2:</h1> */}
        <div className="estates-wrapper">

          {realEstates.map((estate, index) => (
            <div key={index} className="estate-item" style={{ display: showAllEstates ? 'block' : (index < 6 ? 'block' : 'none') }}>
              <div className="estate-info">
                <div className="image-container">
                  {getFrontImages(estate).map((image, imageIndex) => (
                    <div key={imageIndex} className="image-item">
                      <img src={image.imageUrl} alt={image.imageName} className="estate-image" />
                    </div>
                  ))}
                </div>

                <Link to={estate.link} className="estate-name">{estate.realestateName}</Link>
                <span className="estate-discription">{limitWords(estate.discription, 15)}</span>
                <div className='thanhphoprice'>
                  <div className='logo-thanhpho'>
                    <img className='logo-location' src='/logotrangchu/location.png' />
                    <span className='thanhpho'>{city}</span>
                  </div>
                  <span className='price'>{getPrice(estate)}</span>

                </div>
                <span className='trangthaiban'>{getStatus(estate)}</span>

              </div>

            </div>
          ))}
        </div>
        {/* Nút "Xem Thêm" */}
        {!showAllEstates && realEstates.length > 3 && (
          <div className="button-container">
            <button onClick={handleShowAllEstates} className="show-more-button">
              Xem Thêm
            </button>
          </div>
        )}

        {/* Nút "Thu Gọn" */}
        {showAllEstates && (
          <div className="button-container">
            <button onClick={() => setShowAllEstates(false)} className="show-more-button">
              Thu Gọn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
