import React, { useState, useEffect } from 'react';
import CallApi from '../CallApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function AdminAgencyBooking() {
    const [agencyAccounts, setAgencyAccounts] = useState([]);
    const navigate = useNavigate(); // Sử dụng useNavigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllAcc = await CallApi.getAllAccount();
                const getAllAccAgency = getAllAcc.filter(
                    AccAgency => AccAgency.roleId === 1
                );
                const getAllRes = await CallApi.getAllReservations();
                // Lọc ra những reservation có agencyId
                const getAgenBook = getAllRes.filter(
                    reservation => reservation.agencyId !== null && reservation.status === 1
                );

                // Lập bản đồ để đếm số lần booking cho mỗi Agency
                const bookingCounts = getAgenBook.reduce((acc, curr) => {
                    acc[curr.agencyId] = (acc[curr.agencyId] || 0) + 1;
                    return acc;
                }, {});

                // Thêm thông tin booking vào mỗi Agency
                const agencyWithBooking = getAllAccAgency.map(agency => ({
                    ...agency,
                    bookingCount: bookingCounts[agency.id] || 0 // Thêm số lượng booking hoặc 0 nếu không có booking nào
                }));

                setAgencyAccounts(agencyWithBooking);
            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, []);

    const handleBookingClick = (agencyId) => {
        navigate(`/admin-DetailBookingAgen/${agencyId}`); // Thay đổi ở đây
    };


    return (
        <div  className='container1'>
            <table className='thongtindanhsach' >
                <thead>
                    <tr>
                        <th>Agency ID</th>
                        <th>Agency Name</th>
                        <th>Số đơn được booking</th> {/* Đã loại bỏ onClick event */}
                    </tr>
                </thead>
                <tbody>
                    {agencyAccounts.map((agency, index) => (
                        <tr key={index}>
                            <td>{agency.id}</td>
                            <td>{agency.username}</td>
                            <td onClick={() => handleBookingClick(agency.id)} style={{ cursor: 'pointer' }}>{agency.bookingCount}</td> {/* Sửa đổi tại đây */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
