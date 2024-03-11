import React, { useState, useEffect } from 'react';
import CallApi from '../CallApi';
import axios from 'axios';
import CustomerMenu from './customer-menu';
import UserCustomer from '../../list/userCustomer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Customerdondat() {
    const [realEstates, setRealEstates] = useState([]); // State to store real estates
    const [accounts, setAccounts] = useState([]); // State to store accounts
    const [customerReservation, setCustomerReservation] = useState([]);
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const customerId = userLoginBasicInformationDto.accountId;

    useEffect(() => {
        async function fetchData() {
            try {
                const callDataReservations = await CallApi.getAllReservations();
                const filteredReservations = callDataReservations.filter(reservation => reservation.status === 1 && reservation.customerId === customerId);
                setCustomerReservation(filteredReservations);
                const callDataRealEstateData = await CallApi.getAllRealEstate();
                setRealEstates(callDataRealEstateData);
                const callDataAllAccount = await CallApi.getAllAccount();
                setAccounts(callDataAllAccount); // Set accounts data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [customerId]);

    const cancelReservation = async (id, reservation) => {
        try {
            const requestData = {
                status: 0,
                realEstateId: reservation.realEstateId,
                customerId: reservation.customerId,
                agencyId: reservation.agencyId,
                bookingDate: reservation.bookingDate,
                bookingTime: reservation.bookingTime
            };
            await axios.put(`http://firstrealestate-001-site1.anytempurl.com/api/reservation/UpdateReservation/${id}`, requestData);
            toast.success('Cập nhật thành công!', {
                onClose: () => window.location.reload() // Reload trang sau khi toast đóng
            });
            window.location.reload();
        } catch (error) {

            console.error("Error updating reservation:", error);
            toast.error('Cập nhật thất bại!', {
                onClose: () => window.location.reload() // Tùy chọn, có thể không cần reload nếu lỗi
            });
        }
    };

    const getRealEstateNameById = (realEstateId) => {
        const realEstate = realEstates.find(item => item.id === realEstateId);
        return realEstate ? realEstate.realestateName : 'Unknown';
    };
    const getUsernameByCustomerId = (customerId) => {
        const account = accounts.find(item => item.id === customerId);
        return account ? account.username : 'Unknown';
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

    return (
        <div className='container'>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <CustomerMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserCustomer}
            />
            <div>
                {customerReservation.length > 0 ? (
                    customerReservation.map((reservation, index) => (
                        <div key={index} className=''>
                            <h1>Thông tin đặt chỗ</h1>
                            <p><b>Mã đơn hàng</b> {reservation.id}</p>
                            <p><b>Tên bất động sản: </b> {getRealEstateNameById(reservation.realEstateId)}</p>
                            <p><b>Tên khách hàng đặt chỗ: </b> {getUsernameByCustomerId(reservation.customerId)}</p>
                            <p><b>Ngày xem bất động sản: </b> {formatDate(reservation.bookingDate)}</p>
                            <p><b>Giờ xem bất động sản</b> {reservation.bookingTime}</p>
                            <p><b>Thông tin liên hệ người dẫn xem bất động sản: </b> {reservation.agencyId !== null ? getUsernameByCustomerId(reservation.agencyId) : 'Đang Cập Nhật'}</p>
                            <button onClick={() => cancelReservation(reservation.id, reservation)}>Hủy đặt</button>

                        </div>
                    ))
                ) : (
                    <p style={{marginTop: '10px'}}>Không có đơn đặt chỗ nào.</p>
                )}
            </div>
        </div>
    );
}
