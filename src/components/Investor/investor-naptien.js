import React, { useState, useEffect } from 'react';
import CallApi from '../CallApi';

const BANK_ID = '970422';
const ACCOUNT_NO = '0965150379';
const TEMPLATE = 'compact';
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
export default function PaymentComponent() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState(userLoginBasicInformationDto.username + " code " + generateRandomString(4)); // Thay đổi giá trị mặc định của description
    const [paymentUrl, setPaymentUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const callDataAllPayment = await CallApi.getAllPayMent();
                if (callDataAllPayment && callDataAllPayment.data && callDataAllPayment.data.length > 0) {
                    const lastPayment = callDataAllPayment.data[callDataAllPayment.data.length - 1];
                    console.log('last payment:', lastPayment);

                } else {
                    console.log('Không có dữ liệu thanh toán.');
                }
            } catch (error) {
                console.error('Error fetching payments:', error.message);
            }
        };

        fetchData();
    }, []);

    const handlePayment = async () => {
        if (amount <= 0 || !description) {
            alert("Vui lòng điền đầy đủ thông tin thanh toán!");
            return;
        }

        const encodedDescription = encodeURIComponent(description);
        const url = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodedDescription}`;
        setPaymentUrl(url);
        console.log("URL thanh toán:", url);

        // Biến flag để kiểm soát việc gọi checkPayment()
        let paymentSuccessful = false;

        const checkPayment = async () => {
            if (paymentSuccessful) {
                clearInterval(intervalId);
                return;
            }

            const callDataAllPayment = await CallApi.getAllPayMent();
            const checkthantoan = callDataAllPayment.data[callDataAllPayment.data.length - 1];
            const interamount = parseInt(amount);
            try {
                if (checkthantoan.Price === interamount && checkthantoan.Content.includes(description)) {
                    clearInterval(intervalId);
                    alert("Thanh toán thành công!");
                    paymentSuccessful = true; // Đặt biến flag thành true khi thanh toán thành công
                } else {
                    console.log("Thanh toán không thành công.");
                }
            } catch (error) {
                console.error('Error during payment check:', error.message);
            }
        };

        const intervalId = setInterval(checkPayment, 1000);
        await checkPayment(); // Kiểm tra lần đầu tiên ngay sau khi nhấn nút Thanh toán
    };


    return (
        <div className='payment-form'>
            <h2>Thanh toán tiền</h2>
            <div>
                <label>Số tiền:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <button onClick={handlePayment}>Thanh toán</button>
            {paymentUrl && (
                <div>
                    <h3 style={{marginTop: '20px'}}>Mã QR thanh toán</h3>
                    <img src={paymentUrl} alt="QR Code" />
                </div>
            )}
        </div>
    );
}
