import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate từ react-router-dom
import AgencyMenu from './agency-menu';
import UserAgency from '../../list/userAgency';
import CallApi from '../CallApi';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AgencyDatcocmuaban() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const getAgencyId = parseInt(userLoginBasicInformationDto.accountId);
    const [bookReservations, setBookReservations] = useState([]);
    const [realEstates, setRealEstates] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển trang

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
                setAccounts(callDataAllAccount);
            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, [getAgencyId]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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

    const handleCustomerNameClick = (customerId, realEstateId) => {
        navigate(`/customer/${customerId}/realestate/${realEstateId}`); // Sử dụng navigate để chuyển trang
    };

    const filteredReservations = bookReservations.filter(reservation =>
        getRealEstateNameById(reservation.realEstateId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUsernameByCustomerId(reservation.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(reservation.bookingDate).includes(searchTerm.toLowerCase()) ||
        reservation.bookingTime.includes(searchTerm)
    );

    return (
        <div className='outer-container'>
            <div className='container'>
                <AgencyMenu
                    userLoginBasicInformationDto={userLoginBasicInformationDto}
                    UserMenu={UserAgency}
                />
                <div className='col-md-9 '>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    {filteredReservations.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên bất động sản</th>
                                    <th>Tên khách hàng</th>
                                    <th>Ngày xem</th>
                                    <th>Giờ xem</th>
                                    <th>Người dẫn xem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservations.map((reservation, index) => (
                                    <tr key={index}>
                                        <td>{getRealEstateNameById(reservation.realEstateId)}</td>
                                        {/* Sử dụng sự kiện onClick trực tiếp */}
                                        <td onClick={() => handleCustomerNameClick(reservation.customerId, reservation.realEstateId)}>{getUsernameByCustomerId(reservation.customerId)}</td>
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
                   
                </div>
            </div>
        </div>
    );
}
