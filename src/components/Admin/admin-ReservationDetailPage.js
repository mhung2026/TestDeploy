import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CallApi from '../CallApi';
import { format } from 'date-fns';
import axios from 'axios'; // Import axios for making HTTP requests
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReservationDetailPage() {
    const { timeSlot, date } = useParams(); 
    const [matchingBookings, setMatchingBookings] = useState([]);
    const [selectedRealEstateId, setSelectedRealEstateId] = useState(''); 
    const [filerAllAgency, setFilerAllAgency] = useState([]);
    const [selectedAgencyId, setSelectedAgencyId] = useState('');
    const [realEstates, setRealEstates] = useState([]);
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const getCustomerBooking = await CallApi.getAllReservations();
                const callDataRealEstateData = await CallApi.getAllRealEstate();
                setRealEstates(callDataRealEstateData);
                const filteredBookings = getCustomerBooking.filter(booking => {
                    return format(new Date(booking.bookingDate), 'yyyy-MM-dd') === date && booking.bookingTime === timeSlot && booking.status === 1;
                });
                setMatchingBookings(filteredBookings);

                const getAllAgency = await CallApi.getAllAccount();
                setAccounts(getAllAgency);
                const filterAllAgency = getAllAgency.filter(allAgency => allAgency.roleId === 1 && allAgency.status === true);
                setFilerAllAgency(filterAllAgency);
                
            } catch (error) {
                console.error('Error fetching reservation details:', error);
            }
        };

        if (timeSlot && date) {
            fetchDetails();
        }
    }, [timeSlot, date]);

    const handleRealEstateIdChange = (e) => {
        setSelectedRealEstateId(e.target.value);
    };

    const handleAgencyIdChange = (e) => {
        const value = e.target.value;
        setSelectedAgencyId(value === "cancel" ? null : value);
    };
    const getRealEstateNameById = (realEstateId) => {
        const realEstate = realEstates.find(item => item.id === realEstateId);
        return realEstate ? realEstate.realestateName : 'Dữ liệu đang tải';
    };

    const getUsernameByCusAgenId = (customerId) => {
        const account = accounts.find(item => item.id === customerId);
        return account ? account.username : 'Dữ liệu đang tải';
    };
    const handleAdjustment = async () => {
        try {
            // Chỉ thực hiện điều chỉnh nếu mã bất động sản được chọn
            if (selectedRealEstateId) {
                const bookingsToUpdate = matchingBookings.filter(booking => booking.realEstateId === parseInt(selectedRealEstateId));
                await Promise.all(bookingsToUpdate.map(async booking => {
                    const data = {
                        realEstateId: booking.realEstateId, // Sử dụng realEstateId của booking
                        customerId: booking.customerId,
                        agencyId: selectedAgencyId,
                        status: 1, // Assuming 1 is the new status to be updated
                        bookingDate: date,
                        bookingTime: timeSlot
                    };
                    console.log('Data to be sent:', data); // Console log the data to be sent
                    await axios.put(`http://firstrealestate-001-site1.anytempurl.com/api/reservation/UpdateReservation/${booking.id}`, data);
                }));

                toast.success('Điều chỉnh đặt chỗ cho đại lý thành công', {
                    onClose: () => window.location.reload() // Reset trang web khi thông báo tắt
                });
            } else {
                toast.error('Vui lòng chọn mã Bất động sản trước khi điều chỉnh đặt chỗ cho đại lý.');
            }
        } catch (error) {
            console.error('Lỗi khi điều chỉnh đặt chỗ cho đại lý:', error);
            toast.error('Đã xảy ra lỗi khi điều chỉnh đặt chỗ cho đại lý');
        }
    };

    const uniqueRealEstateIds = [...new Set(matchingBookings.map(booking => booking.realEstateId))];
    const filteredBookings = selectedRealEstateId
        ? matchingBookings.filter(booking => booking.realEstateId === parseInt(selectedRealEstateId))
        : matchingBookings;

    return (
        <div>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2>Chi tiết Đơn Đặt Chỗ cho Khoảng Thời Gian: {timeSlot}</h2>
            <p>Ngày: {date}</p>
            <select onChange={handleRealEstateIdChange} value={selectedRealEstateId}>
                <option value="">Chọn mã Bất động sản</option>
                {uniqueRealEstateIds.map((realEstateId, index) => (
                    <option key={index} value={realEstateId}>{getRealEstateNameById(realEstateId)}</option>
                ))}
            </select>
            <select onChange={handleAgencyIdChange} value={selectedAgencyId}>
                <option value="">Chọn mã Đại lý</option>

                {filerAllAgency.map((agency, index) => (
                    <option key={index} value={agency.id}>{getUsernameByCusAgenId(agency.id)}</option>
                ))}
                <option value="cancel">Hủy</option> {/* Tùy chọn hủy */}
            </select>
            <button onClick={handleAdjustment}>Điều chỉnh đặt chỗ cho đại lý</button>
            <table>
                <thead>
                    <tr>
                        <th>Mã Khách hàng</th>
                        <th>Mã Bất động sản</th>
                        <th>Mã Đại lý</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking, index) => (
                        <tr key={index}>
                            <td>{getUsernameByCusAgenId(booking.customerId)}</td>
                            <td>{getRealEstateNameById(booking.realEstateId)}</td>
                            <td>{booking.agencyId}</td>
                            <td>{booking.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
