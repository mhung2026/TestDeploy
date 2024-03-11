import React from 'react';
import { Carousel } from 'antd';

const contentStyle = {
  height: '600px',
  color: '#fff',
  lineHeight: '300px',
  textAlign: 'center',
  background: '#364d79',
  width: '100%'
};

const images = [
  'https://www.casadecampo.com.do/wp-content/uploads/2023/11/5bdr_Exc_Villa_Amapola_-pool_view.jpg',
  'https://ezcloud.vn/wp-content/uploads/2019/03/villa-da-lat-dep-sieu-cap.webp',
  'https://hoanggiavu.vn/wp-content/uploads/2020/12/mau-villa-dep-nhat-2020-2021-9.jpg',
  'https://wikiland.vn/wp-content/uploads/BietThuPhuQuoc/Biet-thu-nghi-duong-Phu-Quoc.jpg',
];

const Header2 = () => (
  <Carousel autoplay>
    {images.map((imageUrl, index) => (
      <div key={index}>
        <img src={imageUrl} alt={`Image ${index + 1}`} style={contentStyle} />
      </div>
    ))}
  </Carousel>
);

export default Header2;
