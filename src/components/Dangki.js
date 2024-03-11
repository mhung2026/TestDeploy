import React, { Component } from 'react';
import axios from 'axios';
import FormValidation from './FormValidation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Dangki extends Component {
    state = {
        roleId: null,
        roleSelected: false,
        formData: {
            taiKhoan: '',
            matKhau: '',
            xacNhanMatKhau: '',
            soDienThoai: '',
            email: '',
            diaChi: ''
        },
    };

    handleRoleChange = (id) => {
        this.setState({ roleId: id, roleSelected: true });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!FormValidation.validateFormData(this.state.formData)) {
            return;
        }

        // Tạo postData để gửi lên server
        const postData = {
            roleId: this.state.roleId,
            username: this.state.formData.taiKhoan,
            password: this.state.formData.matKhau,
            phoneNumber: this.state.formData.soDienThoai,
            email: this.state.formData.email,
            address: this.state.formData.diaChi,
            createAt: new Date().toISOString(),
            status: true
        };

        try {
            const response = await axios.post('http://firstrealestate-001-site1.anytempurl.com/api/account/TaoTaiKhoan', postData);
            console.log('Đăng ký thành công:', response.data);
            toast.success('Đăng kí thành công!', {
                onClose: () =>  window.location.href = '/dangnhap'  // Reload trang sau khi toast đóng
            });
           
        } catch (error) {
            console.error('Đăng ký thất bại:', error);
            toast.success('Đăng kí thành công!', {
                onClose: () =>  window.location.href = '/dangnhap'  // Reload trang sau khi toast đóng
            });
        }
    };

    render() {
        const { roleSelected, formData } = this.state;

        return (
            <div>
              <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                {!roleSelected && (
                    <div className='rolemoi'>
                        {/* UI để chọn vai trò */}
                        <h2 className='chonrole'>Chọn Vai Trò</h2>
                        <div className='taorole'>
                            <button onClick={() => this.handleRoleChange(3)} style={{ marginRight: '20px', padding: ' 24px', borderRadius: '10px' }}>Customer</button>
                            <button onClick={() => this.handleRoleChange(2)} style={{ marginRight: '20px', padding: ' 24px', borderRadius: '10px' }}>Investor</button>
                        </div>
                    </div>
                )}
                {roleSelected && (
                    <div className='formdangkytaikhoan'>
                        {/* Form đăng ký */}
                        <h2>Đăng ký tài khoản</h2>
                        <form onSubmit={this.handleSubmit}>
                            {/* Các trường input cho form */}
                            <div>
                                <label>Email:</label>
                                <input type="email" name="email" value={formData.email} onChange={this.handleChange} />
                            </div>
                            <div>
                                <label>Họ Và Tên:</label>
                                <input type="text" name="taiKhoan" value={formData.taiKhoan} onChange={this.handleChange} />
                            </div>
                            {/* Thêm các trường input khác ở đây */}
                            <div>
                                <label>Mật khẩu:</label>
                                <input type="password" name="matKhau" value={formData.matKhau} onChange={this.handleChange} />
                            </div>
                            <div>
                                <label>Xác nhận lại mật khẩu:</label>
                                <input type="password" name="xacNhanMatKhau" value={formData.xacNhanMatKhau} onChange={this.handleChange} />
                            </div>
                            <div>
                                <label>Số điện thoại:</label>
                                <input type="text" name="soDienThoai" value={formData.soDienThoai} onChange={this.handleChange} />
                            </div>
                          
                            <div>
                                <label>Địa chỉ:</label>
                                <input type="text" name="diaChi" value={formData.diaChi} onChange={this.handleChange} />
                            </div>
                            <button type="submit">Đăng Ký</button>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}
