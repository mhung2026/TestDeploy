import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CallApi from '../CallApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminAllReservation() {
    const [ReservationData, setReservation] = useState([]);
    const [realEstates, setRealEstates] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [IdRoleAgency, setIdRoleAgency] = useState([]);
    const [selectedAgencyId, setSelectedAgencyId] = useState({}); // State mới để lưu trữ agencyId được chọn

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllReservation = await CallApi.getAllReservationAdmin();
                const getReservation = getAllReservation.filter(reservation => reservation.status === 1);
                setReservation(getReservation);
                const callDataRealEstateData = await CallApi.getAllRealEstate();
                setRealEstates(callDataRealEstateData);
                const callDataAllAccount = await CallApi.getAllAccount();
                setAccounts(callDataAllAccount);
                const callDataRoleIdAgency = callDataAllAccount.filter(account => account.roleId === 1);
                setIdRoleAgency(callDataRoleIdAgency);
            } catch (error) {
                console.error("Error at fetchData", error);
            }
        };
        fetchData();
    }, []);

    const getRealEstateNameById = (realEstateId) => {
        const realEstate = realEstates.find(item => item.id === realEstateId);
        return realEstate ? realEstate.realestateName : 'Dữ liệu đang tải';
    };

    const getUsernameByCustomerId = (customerId) => {
        const account = accounts.find(item => item.id === customerId);
        return account ? account.username : 'Dữ liệu đang tải';
    };
    const getUsernameByAgencyId = (agencyId) => {
        const account = accounts.find(item => item.id === agencyId);
        return account ? account.username : 'Chưa Chọn Agency';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

    const isAgencyAssigned = (agencyId) => {
        return ReservationData.some(res => res.agencyId === agencyId);
    };

    // Cập nhật hàm này để lưu agencyId được chọn vào state
    const handleAgencyChange = (reservationId, agencyId) => {
        // Kiểm tra nếu giá trị được chọn là rỗng thì thiết lập agencyId thành null
        const updatedAgencyId = agencyId === '' ? null : agencyId;
        setSelectedAgencyId(prev => ({ ...prev, [reservationId]: updatedAgencyId }));
    };


    // Hàm mới để xử lý khi nhấn nút "Lưu"
    const saveReservation = async (res) => {
        const agencyId = selectedAgencyId[res.id];
        const payload = {
            realEstateId: res.realEstateId,
            customerId: res.customerId,
            status: 1,
            bookingDate: res.bookingDate,
            bookingTime: res.bookingTime,
            agencyId: agencyId
        };

        try {
            await axios.put(`http://firstrealestate-001-site1.anytempurl.com/api/reservation/UpdateReservation/${res.id}`, payload);
            toast.success('Cập nhật thành công!', {
                onClose: () => window.location.reload() // Reload trang sau khi toast đóng
            });
        } catch (error) {
            console.error("Error at saveReservation", error);
            toast.error('Cập nhật thất bại!', {
                onClose: () => window.location.reload() // Tùy chọn, có thể không cần reload nếu lỗi
            });
        }
    };

    return (
        <div className='container1'> 
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h1 style={{fontSize: '30px'}}>DANH SÁCH PHÔI PHỐI AGENCY</h1>
            <table className='thongtindanhsach'>
                <thead>
                    <tr>
                        <th>Tên bất động sản</th>
                        <th>Tên khách hàng</th>
                        <th>Ngày xem</th>
                        <th>Giờ xem</th>
                        <th>Người dẫn xem</th>
                        <th>Chọn người dẫn xem</th>
                        <th>Lưu</th> {/* Thêm tiêu đề cột "Lưu" */}
                    </tr>
                </thead>
                <tbody>
                {ReservationData.map(res => (
                    <tr key={res.id}>
                        <td>{getRealEstateNameById(res.realEstateId)}</td>
                        <td>{getUsernameByCustomerId(res.customerId)}</td>
                        <td>{formatDate(res.bookingDate)}</td>
                        <td>{res.bookingTime}</td>
                        <td>{getUsernameByAgencyId(res.agencyId)}</td>
                        <td>
                            <select onChange={(e) => handleAgencyChange(res.id, e.target.value)} value={selectedAgencyId[res.id] || ''}>
                                <option value="">Tất cả Agency</option>
                                {IdRoleAgency.filter(agency => !isAgencyAssigned(agency.id) || agency.id === res.agencyId).map((agency) => (
                                    <option key={agency.id} value={agency.id}>{agency.username}</option>
                                ))}
                                <option value="">Hủy</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={() => saveReservation(res)}>Lưu</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
