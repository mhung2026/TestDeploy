import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../authentication/Auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            navigate('/trangchu');
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            setLoading(true);
            if (!username || !password) {
                toast.error('Vui lòng nhập tài khoản và mật khẩu');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'http://firstrealestate-001-site1.anytempurl.com/api/account/login',
                {
                    email: username,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json-patch+json',
                        accept: '*/*',
                    },
                }
            );

            const { accessToken, userLoginBasicInformationDto } = response.data;
            // Lưu thông tin vào localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userLoginBasicInformationDto', JSON.stringify(userLoginBasicInformationDto));
            // Lưu token vào Auth
            saveToken(accessToken);
            console.log('Login successful. Token:', accessToken);

            window.location.reload();
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
                toast.error('Tài khoản hoặc mật khẩu không đúng');
            } else {
                console.error('Login failed:', error.message);
                toast.error('Tài khoản hoặc mật khẩu không đúng');
            }
        }
    };

    return (
        <div className='thongtindangnhap'>
            <h2 className='tieudedangnhap'>ĐĂNG NHẬP</h2>
            <div className='loinhac'>
                <span className='loinhacott'>Nếu bạn chưa tài khoản,</span>
                <a className='loinhacdangki' href='dangki'>đăng kí tại đây</a>
            </div>
            <div className='dangnhap'>
                <input className='dangnhapemail'
                    type="text"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input className='dangnhapmk'
                    type="password"
                    placeholder="Mật Khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='dangnhapthanhcong' onClick={handleLogin} disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
            <div className='ghinho'>
                <div className='ghinhotaikhoan'>
                    <input className='ghinhodangnhap' type='checkbox'></input>
                    <span>Ghi nhớ đăng nhập</span>
                </div>
                <a className='quenmatkhau' href='quenmatkhau'>Quên mật khẩu</a>

            </div>
            <div className='dangnhapbangacc'>
                <span className='dangnhapkhac'>Hoặc đăng nhập bằng</span>
                <button className='dangnhapaccnut'>
                    <img src='logodangnhap/search.png' className='dangnhapbanggg'></img>
                </button>
            </div>

            <ToastContainer /> {/* Container để hiển thị thông báo */}
        </div>
    );
};

export default Login;
