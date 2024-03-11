import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CallApi from '../CallApi';

export default function Customertrangchubanvila() {
  const [realEstates, setRealEstates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CallApi.getAllRealEstate();
        setRealEstates(response);
        const locationResponse = await CallApi.getAllLocation();
        setLocations(locationResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getCityName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.city : '';
  };

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
    return '';
  };

  const getFrontImages = realEstate => {
    return realEstate.realEstateImages.filter(image => image.imageName === 'Ảnh Mặt Trước');
  };

  const getPrice = realEstate => {
    const price = realEstate.price;
    return price;
  };

  const getStatus = realEstate => {
    let status = '';
    switch (realEstate.status) {
      case 3:
      case 6:
        status = 'Sắp Mở Bán';
        break;
      default:
        status = ''; // Or any default status you want to show
        break;
    }
    return status;
  };

  const handleRealEstateClick = estate => {
    navigate(`/thongtinchitietbatdongsan/${estate.id}`);
  };

  const startIndex = (currentPage - 1) * 6;
  const endIndex = startIndex + 6;
  const currentEstates = realEstates.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const handleNextPage = () => {
    const maxPages = Math.ceil(realEstates.length / 6);
    setCurrentPage(currentPage < maxPages ? currentPage + 1 : maxPages);
  };

  return (
    <div>
      <div className="estate-container">
        <div className='main-title'>
          <div className="real-title">
            <div className='text-realtitle'>
              <span className='textso1'>NHÀ ĐẤT</span>
              <h2 className='textso2'>BÁN</h2>
            </div>
          </div>
        </div>
        <div className="estates-wrapper">
          {currentEstates.map((estate, index) => (
            <div key={index} className="estate-item">
              <div className="estate-info">
                <div className="image-container">
                  {getFrontImages(estate).map((image, imageIndex) => (
                    <div key={imageIndex} className="image-item">
                      <img src={image.imageUrl} alt={image.imageName} className="estate-image" />
                    </div>
                  ))}
                </div>
                <div onClick={() => handleRealEstateClick(estate)} className="estate-name">{estate.realestateName}</div>
                <span className="estate-discription">{limitWords(estate.discription, 15)}</span>
                <div className='thanhphoprice'>
                  <div className='logo-thanhpho'>
                    <img className='logo-location' src='/logotrangchu/location.png' alt="location" />
                    <span className='thanhpho'>{getCityName(estate.locationId)}</span>
                  </div>
                  <span className='price'>{getPrice(estate)}</span>
                </div>
                <span className='trangthaiban'>{getStatus(estate)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} className="page-number">
            Prev
          </button>
          {realEstates.length > 6 &&
            Array.from({ length: Math.ceil(realEstates.length / 6) }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.min(currentPage + 2, Math.ceil(realEstates.length / 6)))
              .map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`page-number ${currentPage === page ? 'active' : ''}`}>
                  {page}
                </button>
              ))}
          <button onClick={handleNextPage} className="page-number">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
