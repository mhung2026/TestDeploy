import React from 'react';
import listGioiThieuPart2 from '../../list/listgioithieupart2';

export default function Customergioithieupart2() {
    return (
        <div className="serviceContainer">
            <div className="serviceHeader">
                <div className='dvcc'>
                    <span className='dv'>Dịch vụ</span>
                    <span className='cc'>cung cấp</span>
                </div>
                <span className='textdvcc'>Hiện thực hóa ước mơ sở hữu ngôi nhà hoàn hảo của khách hàng, thổi hồn vào từng công trình bằng kinh nghiệm, sự chuyên nghiệp của chúng tôi.</span>
            </div>
            <div className="itemContainer">
                {listGioiThieuPart2.map((item, index) => (
                    <div key={index} className="item">
                        <img src={item.imageSrc} alt={item.title} className="itemImage" />
                        <div className="itemInfo">
                            <span className="itemTitle">{item.title}</span>
                            <span className="itemDescription">{item.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
