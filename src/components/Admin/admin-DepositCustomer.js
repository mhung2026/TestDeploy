import React, { useEffect, useState } from 'react';
import CallApi from '../CallApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function AdminDepositCustomer() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allReservationTime = await CallApi.GetAllReservationTime();
                const filteredData = allReservationTime.filter(item => {
                    const itemDate = format(new Date(item.date), "yyyy-MM-dd");
                    const selectedDateString = format(selectedDate, "yyyy-MM-dd");
                    return itemDate === selectedDateString;
                });

                const allReservation = await CallApi.getAllReservations();
                for (let reservation of filteredData) {
                    ['time1', 'time2', 'time3', 'time4'].forEach(timeSlot => {
                        if (reservation[timeSlot] !== null) {
                            const timeFilter = reservation[timeSlot];
                            const matchingReservations = allReservation.filter(res => 
                                format(new Date(res.bookingDate), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") &&
                                res.bookingTime === timeFilter && res.status === 1
                            );
                            reservation[`${timeSlot}_count`] = matchingReservations.length;
                        }
                    });
                }

                setFilteredReservations(filteredData);
                
            } catch (error) {
                console.error("Error at fetchData", error);
            }
        };
        if (selectedDate) {
            fetchData();
        }
    }, [selectedDate]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log("Ngày đã chọn:", format(date, "dd/MM/yyyy"));
    };

    useEffect(() => {
        console.log("Dữ liệu đã lọc:", filteredReservations);
    }, [filteredReservations]);

    const handleNavigate = (timeSlot, date) => {
        console.log("Date passed to handleNavigate:", date); // Debugging: check if date is correctly passed
        if (date) {
           
            const formattedDate = format(date, "yyyy-MM-dd");
            console.log("Formatted Date:", formattedDate); // Debugging: check formatted date
            navigate(`/reservation-details/${timeSlot}/${formattedDate}`);
        } else {
            console.error("Date is null or undefined. Cannot navigate."); // Handle null or undefined case
        }
    };

    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày"
            />
            
            <table>
                <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Số khách hàng xem đơn</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.map((reservation, index) => (
                        <React.Fragment key={index}>
                            {['time1', 'time2', 'time3', 'time4'].map((timeSlot, idx) => (
                                reservation[timeSlot] !== null && (
                                    <tr key={`${index}-${idx}`}>
                                        <td>{reservation[timeSlot]}</td>
                                        <td onClick={() => handleNavigate(reservation[timeSlot], selectedDate)}>
                                            {reservation[`${timeSlot}_count`] || 0}
                                        </td>
                                    </tr>
                                )
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
