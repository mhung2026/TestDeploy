// Home2.js
import React from 'react';
import { getToken, removeToken } from '../authentication/Auth';
import { useNavigate } from 'react-router-dom';

const Home2 = () => {
    const accessToken = getToken();
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userLoginBasicInformationDto');
        // Navigate to the Login page after logout
        navigate('/login');
    };

    const handleAccountClick = () => {
        // Navigate to Home.js when "Account" button is clicked
        navigate('/home');
    };

    return (
        <div>
            <h2>Home 2

            </h2>
            <h2>Welcome, {userLoginBasicInformationDto.username}!</h2>
            <p>Your token is: {accessToken}</p>
            <p>Your role is: {userLoginBasicInformationDto.roleName}</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleAccountClick}>Account</button>
        </div>
    );
};

export default Home2;
