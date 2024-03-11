import React from 'react';

const UserProfile = ({ userInfo }) => {
    const handleLogout = () => {
        // Assuming you are storing the token in local storage
        const accessToken = localStorage.getItem('accessToken');
        console.log('Before Logout - Token:', accessToken);

        localStorage.removeItem('accessToken');
        console.log('After Logout - Token:', localStorage.getItem('accessToken'));

        // Additional logic to redirect or perform other actions if needed
    };

    return (
        <div>
            <h2>User Profile</h2>
            {userInfo && (
                <div>
                    <p>Username: {userInfo.username}</p>
                    <p>Role: {userInfo.roleName}</p>
                </div>
            )}
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default UserProfile;
