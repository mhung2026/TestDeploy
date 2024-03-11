import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomerMenu({ userLoginBasicInformationDto, UserMenu, handleLogout }) {
    return (
        <div className="col-md-3 account">
            <span className='welcome'>Chào mừng, {userLoginBasicInformationDto.username}!</span>
            {/* <span>Your role is: {userLoginBasicInformationDto.roleName}</span>
            <span>Your role is: {userLoginBasicInformationDto.accountId}</span> */}
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
