import React from 'react';
import lienheItems from '../../list/listlienhe';

export default function Customerlienhe() {
    return (
        <div>
            <iframe
                className='mapcontact'
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105376076!2d106.80730271125371!3d10.841127589266952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1708750729574!5m2!1svi!2s"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className='customerlienhe'>
                <div className='col-md-6 customerlienheghichu '>
                    <span style={{fontWeight: 'bold', fontSize: '20px'}}>Gửi thông tin</span><br></br>
                    <span style={{fontStyle: 'italic'}}>Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho chúng tôi. Chúng tôi sẽ trả lời bạn sau khi nhận được.</span><br></br>
                    <span style={{fontWeight: 'bold'}}>Họ và tên</span><br></br>
                    <input></input>
                    <span style={{fontWeight: 'bold'}}>Nội dung</span>
                    <input></input>
                    <button>Gửi tin nhắn</button>
                </div>
                <div className='col-md-6 infocontactshop'>
                    <span style={{fontWeight: 'bold', color: 'red', fontSize: '20px'}}>Thông tin liên hệ</span>
                    {lienheItems.map((item, index) => (
                        <div key={index} className='infocontactshopinfo'>
                            <img src={item.logoSrc} alt={item.title} style={{ width: '15px', height: '15px' }} />
                            <a href={item.title === 'Điện thoại' ? 'tel:' + item.content : (item.title === 'Email' ? 'mailto:' + item.content : '')} key={index}>
                                <span style={{fontWeight: 'bold'}}>{item.title}</span>
                                <span>: {item.content}</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
