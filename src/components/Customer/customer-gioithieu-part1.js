// React Component
import React, { useState } from 'react';


const ContentSection = ({ title, content, isActive, onClick }) => {
    return (
        <div className={`ContentSection ${isActive ? 'active' : ''}`} onClick={onClick}>
            <h2>{title}</h2>
            {isActive && <p>{content}</p>}
        </div>
    );
};

const App = () => {
    const [activeSection, setActiveSection] = useState(null);

    const handleClick = (title) => {
        setActiveSection(activeSection === title ? null : title);
    };

    return (
        <div className='TrangGioiThieu'>
            <div className='col-md-5 gioithieupart1'>
                <div className='dangcapvietvillas'>
                    <div className='dangcap'>
                        <span className='textdang'>đẳng</span>
                        <span className='textcap'>cấp</span>
                    </div>
                    <span className='textviet'>Viet</span>
                    <span className='vietvillas'>Villas</span>
                </div>
                <ContentSection className='content-section'
                    title="Đẳng cấp dành cho bạn"
                    content="Bạn đang tìm một căn hộ sang trọng đẳng cấp và hơn hết gắn bó với thiên nhiên? Không có nơi nào khác có thể thay so sánh với căn hộ tại Vinhouse. Thành phố của thiên đường nằm giữa lòng thiên nhiên. Ở đây bạn sẽ có những khoảnh khắc hạnh phúc cùng gia đình khi được sống giữa một môi trường kết hợp thiên nhiên với sự hiện đại, đủ mọi tiện ích nhưng không thể thiếu không gian trải nghiệm vui đùa, luyện tập thể dục thể thao, nơi mà bạn có thể hít những làn không khí trong lành nhất vào mỗi sáng để bắt đầu một ngày mới tuyệt vời."
                    isActive={activeSection === "Đẳng cấp"}
                    onClick={() => handleClick("Đẳng cấp")}
                />
                <ContentSection
                    title="Chăm sóc sức khỏe"
                    content="Chăm sóc sức khỏe cư dân luôn được đặt lên hàng đầu với quy mô dự án giành tới 2 tầng để làm trung tâm chăm sóc sức khỏe liên hoàn bao gồm các hạng mục."
                    isActive={activeSection === "Chăm sóc sức khỏe"}
                    onClick={() => handleClick("Chăm sóc sức khỏe")}
                />
                <ContentSection
                    title="Tiện ích giải trí"
                    content="Với nhiều cây xanh, thác nước, vườn hoa và điểm nhấn là những hàng cọ Mỹ xanh mát, Chung cư Vinhouse khác biệt hẳn những dự án dọc đường Lê Văn Lương khác. Trái tim của tòa nhà chính là 24 tiện ích cao cấp dành riêng cho cư dân tại tầng 6."
                    isActive={activeSection === "Tiện ích giải trí"}
                    onClick={() => handleClick("Tiện ích giải trí")}
                />
            </div>
            <div className='col-md-7 infoimage '>
                <img src='/logogioithieu/sec_about_1_image.png' alt='Sec About 1' />
            </div>
        </div>
    );
};

export default App;
