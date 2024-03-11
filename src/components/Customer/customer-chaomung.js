import React, { useState } from 'react';
import listLogoChaomung from '../../list/listLogoChaomung';
export default function Customerchaomung() {
    const [showVideoPopup, setShowVideoPopup] = useState(false);

    const openVideoPopup = () => {
        setShowVideoPopup(true);
    };

    const closeVideoPopup = () => {
        setShowVideoPopup(false);
    };

    return (
        <div className="chaomung">
            <div className="col-md-6">
                <div className='khungchu'>
                    <div className='khungchaomung'>
                        <span className='text-chaomung'>Chào mừng đến</span>
                        <span className='textvietvillas'> VIET VILLAS</span>
                    </div>
                    <span className='text-chaomung'>NƠI TỐT NHẤT ĐỂ TÌM CĂN HỘ BẠN MONG MUỐN.<br /></span>
                    <div className='khunggioithieu'>
                        <span className='text-gioithieu'>Thành phố của thiên đường nằm giữa lòng thiên nhiên. Ở đây bạn sẽ có những khoảnh khắc hạnh phúc cùng gia đình khi được sống giữa một môi trường kết hợp thiên nhiên với sự hiện đại, đủ mọi tiện ích nhưng không thể thiếu không gian trải nghiệm vui đùa, luyện tập thể dục thể thao, nơi mà bạn có thể hít những làn không khí trong lành nhất vào mỗi sáng để bắt đầu một ngày mới tuyệt vời.</span>
                    </div>
                </div>
                <div className="listLogoContainer">
                    {listLogoChaomung.map((item, index) => (
                        <div className={`gioithieu${index + 1}`} key={index}>

                            <img className='anhlogotrangchu' src={item.imageSrc} alt="Image" />
                            <div className='motatrangchu1'>
                                <span className='tieudegioithieu'>{item.title}</span>
                                <span className='textmota'>{item.description}</span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            <div class="col-md-6-containertrangchu">
                <img class='anhvideo' src="./logotrangchu/anhgioithieu.png" alt="Video Thumbnail" onClick={openVideoPopup} />
                <button class="xemthem-btn" onClick={openVideoPopup}>Xem Video</button>

            </div>
            {showVideoPopup && (
                <div className="video-popup">
                    <div className="video-popup-inner">
                        <button onClick={closeVideoPopup}>Đóng</button>
                        <iframe
                            width="100%"
                            height="315"
                            src="https://www.youtube.com/embed/ve_-FbNvy0w?autoplay=1" // Thay {YOUR_VIDEO_ID} bằng ID của video YouTube bạn muốn chèn
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
