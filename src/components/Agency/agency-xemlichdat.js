import React, { useState, useEffect } from 'react';
import AgencyMenu from './agency-menu';
import UserAgency from '../../list/userAgency';
import CallApi from '../CallApi';
import axios from 'axios'; // Import axios for making HTTP requests
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDetailBookingAgen() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const getAgencyId = parseInt(userLoginBasicInformationDto.accountId);
    const [bookReservations, setBookReservations] = useState([]);
    const [realEstates, setRealEstates] = useState([]); // State to store real estates
    const [accounts, setAccounts] = useState([]); // State to store accounts

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllReservations = await CallApi.getAllReservations();
                const filteredReservations = getAllReservations.filter(reservation => reservation.status === 1);
                const getAgenId = filteredReservations.filter(AgenId => AgenId.agencyId === getAgencyId);
                setBookReservations(getAgenId);
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

    const handleCompleteClick = async () => {
        if (window.confirm("Bạn có chắc chắn muốn đánh dấu tất cả các đơn đặt chỗ này là đã hoàn thành không?")) {
            try {
                await Promise.all(bookReservations.map(async reservation => {
                    await axios.put(`http://firstrealestate-001-site1.anytempurl.com/api/reservation/UpdateReservation/${reservation.id}`, {
                        realEstateId: reservation.realEstateId,
                        customerId: reservation.customerId,
                        status: 2,
                        bookingDate: reservation.bookingDate,
                        bookingTime: reservation.bookingTime,
                        agencyId: reservation.agencyId
                    });
                }));

                toast.success('Cập nhật thành công!', {
                    onClose: () => window.location.reload()
                });
            } catch (error) {
                console.error('Error updating reservations', error);
                toast.error('Cập nhật thất bại!', {
                    onClose: () => window.location.reload()
                });
            }
        }
    };

    return (
        <div className='outer-container'>
            <div className='container'>
                <AgencyMenu
                    userLoginBasicInformationDto={userLoginBasicInformationDto}
                    UserMenu={UserAgency}
                />
                <div className='col-md-9 '>
                    <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    {bookReservations.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Tên bất động sản</th>
                                    <th>Tên khách hàng</th>
                                    <th>Ngày xem</th>
                                    <th>Giờ xem</th>
                                    <th>Người dẫn xem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookReservations.map((reservation, index) => (
                                    <tr key={index}>
                                        <td>{reservation.id}</td>
                                        <td>{getRealEstateNameById(reservation.realEstateId)}</td>
                                        <td>{getUsernameByCustomerId(reservation.customerId)}</td>
                                        <td>{formatDate(reservation.bookingDate)}</td>
                                        <td>{reservation.bookingTime}</td>
                                        <td>{reservation.agencyId !== null ? getUsernameByCustomerId(reservation.agencyId) : 'Đang cập nhật'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ marginTop: '10px', marginLeft: '3px' }}>Không có đơn đặt chỗ nào.</p>
                    )}
                    {bookReservations.length > 0 && (
                        <button onClick={handleCompleteClick}>Đánh dấu tất cả đã hoàn thành</button>
                    )}
                </div>
            </div>
        </div>
    );
}
