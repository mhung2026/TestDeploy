import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CallApi from '../CallApi';

export default function AdminDetailBookingAgen() {
    const { id } = useParams(); // Lấy id từ URL
    const getAgencyId = parseInt(id);
    const [BookReservation, setBookReservation] = useState([]);
    const [realEstates, setRealEstates] = useState([]); // State to store real estates
    const [accounts, setAccounts] = useState([]); // State to store accounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllReservations = await CallApi.getAllReservations();
                const getAgenId = getAllReservations.filter(reservation => reservation.status === 1 && reservation.agencyId === getAgencyId);
                setBookReservation(getAgenId);
                const callDataRealEstateData = await CallApi.getAllRealEstate();
                setRealEstates(callDataRealEstateData);
                const callDataAllAccount = await CallApi.getAllAccount();
                setAccounts(callDataAllAccount); // Set accounts data
            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, [getAgencyId]);
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
        <div>
             {BookReservation.length > 0 ? (
                    BookReservation.map((reservation, index) => (
                        <div key={index} className=''>
                            <h1>Thông tin đặt chỗ</h1>
                            <p><b>Mã đơn hàng</b> {reservation.id}</p>
                            <p><b>Tên bất động sản: </b> {getRealEstateNameById(reservation.realEstateId)}</p>
                            <p><b>Tên khách hàng đặt chỗ: </b> {getUsernameByCustomerId(reservation.customerId)}</p>
                            <p><b>Ngày xem bất động sản: </b> {formatDate(reservation.bookingDate)}</p>
                            <p><b>Giờ xem bất động sản</b> {reservation.bookingTime}</p>
                            <p><b>Thông tin liên hệ người dẫn xem bất động sản: </b> {reservation.agencyId !== null ? getUsernameByCustomerId(reservation.agencyId) : 'Đang Cập Nhật'}</p>
                        </div>
                    ))
                ) : (
                    <p>Không có đơn đặt chỗ nào.</p>
                )}
        </div>
    );
}
