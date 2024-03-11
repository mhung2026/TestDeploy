// AuthRoleFilter.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthRoleManager from './AuthRoleManager';
import { getToken } from './Auth';

const AuthRoleFilter = ({ children }) => {
    const accessToken = getToken();
    const userRole = AuthRoleManager.getUserRole();
    const allowedPages = AuthRoleManager.getAllowedPages();
    const location = useLocation();

    // Kiểm tra xem người dùng có quyền truy cập hay không
    const isAuthorized = userRole && allowedPages.length > 0 && AuthRoleManager.isPageAllowed(location.pathname);

    console.log('User Role:', userRole);
    console.log('Is Authorized:', isAuthorized);

    if (!accessToken || !isAuthorized) {
        // Nếu không có token hoặc không có quyền truy cập, chuyển hướng về trang đăng nhập
        return <Navigate to="/dangnhap" />;
    }

    return children;
};

export default AuthRoleFilter;
