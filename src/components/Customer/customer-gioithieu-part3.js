import React from 'react';

export default function Customergioithieupart3() {
    return (
        <div className='main3'>
            <div className='col-md-4 main-content-part3'>
                <img className='main-image' src='/logogioithieu/anhgioithieu3.png' />
            </div>
            <div className='col-md-8 side-content-part3'>
                <div className='side-content-part3-main'>
                    <div className='head-des'>
                        <span className='heading-part3'>về viet vilass</span>
                        <span className='description-part3'>AntLand là một nhà cung cấp dịch vụ bất động sản toàn cầu được niêm yết trên thị trường chứng khoán Việt Nam. Chúng tôi có một mạng lưới quốc tế với hơn 700 văn phòng.</span>
                    </div>
                    <span className='sub-heading'>GIÁ CẢ (84%)</span>
                    <div className="progressbar-part3">
                        <div className="progressbar-fill" style={{ width: '84%' }}></div>
                    </div>

                    <span className='sub-heading'>CHẤT LƯỢNG (95%)</span>
                    <div className="progressbar-part3">
                        <div className="progressbar-fill" style={{ width: '95%' }}></div>
                    </div>

                    <span className='sub-heading'>THƯƠNG HIỆU (60%)</span>
                    <div className="progressbar-part3">
                        <div className="progressbar-fill" style={{ width: '60%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
