import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import duan from '../list/duan';
import tintuc from '../list/tintuc';
import '@fortawesome/fontawesome-free/css/all.css';
import { getToken } from '../authentication/Auth';
import listheaderCustomer from '../list/listheaderCustomer';
import listheaderAgency from '../list/listheaderAgency';
import listheaderInvestor from '../list/listheaderInvestor';

export default function Header() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const checkRoleID = userLoginBasicInformationDto ? userLoginBasicInformationDto.roleName : null;
    const token = getToken();
    // console.log('Token:', token);

    let headerItems;
    if (checkRoleID === 'Agency') {
        headerItems = listheaderAgency;
    } else if (checkRoleID === 'Customer') {
        headerItems = listheaderCustomer;
    } else if (checkRoleID === 'Investor') {
        headerItems = listheaderInvestor;
    } else {
        // Default to customer if role is not defined
        headerItems = listheaderCustomer;
    }

    return (
        <nav class="navbar navbar-default navbar-trans navbar-expand-lg fixed-top">
            <div class="container">
                <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDefault" aria-controls="navbarDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <a class="navbar-brand text-brand" href="/trangchu">Estate<span class="color-b">Agency</span></a>

                <div class="navbar-collapse collapse justify-content-center" id="navbarDefault">
                    <ul class="navbar-nav">

                        <li class="nav-item">
                            <a class="nav-link active" href="/trangchu">Trang chủ</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link " href="/gioithieu">Giới thiệu</a>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="/tintuc" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Tin tức</a>
                            <div class="dropdown-menu">
                                {tintuc.map((tintuc) => (
                                    <li key={tintuc.id}><Link className='text-drop' to={tintuc.link}>{tintuc.title}</Link></li>
                                ))}
                            </div>
                        </li>


                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="/tintuc" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dự án</a>
                            <div class="dropdown-menu">
                                {duan.map((duan) => (
                                    <li key={duan.id}><Link className='text-drop' to={duan.link}>{duan.name}</Link></li>
                                ))}
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link " href="/lienhe">Liên hệ</a>
                        </li>
                    </ul>
                </div>

                <div class="navbar-toggle-wrapper">
                    <button type="button" class="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01">
                        <div class="header-content">
                            <div class="container-login">
                                {token && userLoginBasicInformationDto ? (
                                    <div class="dropdown">
                                        <span class="login-link">
                                            {userLoginBasicInformationDto.username}
                                        </span>
                                        <div class="dropdown-menu">
                                            {headerItems.map((item) => (
                                                <Link class="dropdown-item" to={item.link} key={item.id}>{item.name}</Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link class='login-link' to='/dangnhap'>Đăng Nhập</Link>
                                )}{!token && (
                                    <Link class='register-link' to='/dangki'>Đăng Ký</Link>
                                )}
                            </div>
                        </div>
                    </button>
                </div>



            </div>
        </nav>
    )
}
