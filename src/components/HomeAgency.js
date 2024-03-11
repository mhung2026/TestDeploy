import React from 'react';

export default function HomeAgency() {
    const handleLogout = () => {
        // Assuming you are storing the token in local storage
        localStorage.removeItem('accessToken');

        // Additional logic to redirect or perform other actions if needed
    };

    return (
        <div>
            <button>Profile</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
