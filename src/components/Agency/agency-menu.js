import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Agencymenu({ userLoginBasicInformationDto, UserMenu, handleLogout }) {
    const navigate = useNavigate();

    // Kiểm tra nếu userLoginBasicInformationDto không tồn tại, thực hiện redirect
    if (!userLoginBasicInformationDto) {
        navigate('/trangchu');
        return null; // return null để không render gì cả nếu chuyển hướng
    }

    return (
        <div className="col-md-3 account">
            <span className='welcome'>Chào mừng, {userLoginBasicInformationDto.username}!</span>
            <ul className="menu-list-investor">
                {UserMenu.map(menuItem => (
                    <li key={menuItem.id} className="menu-item-container">
                        <Link className="menu-item-investor" to={menuItem.link}>{menuItem.name}</Link>
                    </li>
                ))}
            </ul>

        </div>
    );
}
