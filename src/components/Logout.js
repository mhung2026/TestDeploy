import { useEffect } from 'react';
import { removeToken } from '../authentication/Auth';

export default function Logout() {
    useEffect(() => {
        removeToken();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userLoginBasicInformationDto');
        window.location.href = '/trangchu';
    }, []);

    return null;
}
