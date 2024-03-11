import React, { useState, useEffect } from 'react';
import CallApi from '../CallApi';
import axios from 'axios';
import CustomerMenu from './customer-menu';
import UserCustomer from '../../list/userCustomer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerLichsudatdon() {
    const [realEstates, setRealEstates] = useState([]); // State to store real estates
    const [accounts, setAccounts] = useState([]); // State to store accounts
    const [customerReservation, setCustomerReservation] = useState([]);
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const customerId = userLoginBasicInformationDto.accountId;

    useEffect(() => {
        async function fetchData() {
            try {
                const callDataReservations = await CallApi.getAllReservations();
                const filteredReservations = callDataReservations.filter(reservation => reservation.status === 2 && reservation.customerId === customerId);
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
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Tên bất động sản</th>
                            <th>Tên khách hàng đặt chỗ</th>
                            <th>Ngày xem bất động sản</th>
                            <th>Giờ xem bất động sản</th>
                            <th>Thông tin liên hệ người dẫn xem</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerReservation.map((reservation, index) => (
                            <tr key={index}>
                                <td>{reservation.id}</td>
                                <td>{getRealEstateNameById(reservation.realEstateId)}</td>
                                <td>{getUsernameByCustomerId(reservation.customerId)}</td>
                                <td>{formatDate(reservation.bookingDate)}</td>
                                <td>{reservation.bookingTime}</td>
                                <td>{getUsernameByCustomerId(reservation.agencyId)}</td>
                                <td>{reservation.status === 2 ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
