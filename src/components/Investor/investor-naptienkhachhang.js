import React, { useState, useEffect } from 'react';
import InvestorMenu from './investor-menu';
import UserInvestor from '../../list/userInvestor';
import CallApi from '../CallApi';
import axios from 'axios';
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

export default function CustomerNaptienkhachhang() {
    const [userLoginBasicInformationDto, setUserLoginBasicInformationDto] = useState({});
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');
    const [paymentCheckInterval, setPaymentCheckInterval] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false); // Thêm biến trạng thái để theo dõi thanh toán

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
        setUserLoginBasicInformationDto(userData);
        setDescription(userData.username + " Ma Giao Dich " + generateRandomString(4));
    }, []);

    useEffect(() => {
        return () => {
            if (paymentCheckInterval) {
                clearInterval(paymentCheckInterval);
            }
        };
    }, [paymentCheckInterval]);

    const handlePayment = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0 || !description) {
            alert("Please enter a valid amount and fill in all the payment details!");
            return;
        }

        const encodedDescription = encodeURIComponent(description);
        const url = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${numericAmount}&addInfo=${encodedDescription}`;
        setPaymentUrl(url);
        console.log("Payment URL:", url);

        // Bắt đầu kiểm tra thanh toán sau khi tạo URL
        let checkInterval = setInterval(async () => {
            await checkPayment(checkInterval); // Truyền `checkInterval` để có thể dừng nó sau khi thanh toán thành công
        }, 5000); // Kiểm tra mỗi 5 giây

        // Dừng kiểm tra sau 120 giây
        // setTimeout(() => {
        //     clearInterval(checkInterval);
        //     if (!paymentSuccess) { // Chỉ thông báo nếu thanh toán chưa thành công
        //         setPaymentUrl(''); // Ẩn QR code khi quá thời gian
        //         alert('Payment QR Code is no longer valid.');
        //     }
        // }, 120000); // 120 giây
    };

    async function checkPayment(checkInterval) {
        try {
            const callDataAllPayment = await CallApi.getAllPayMent();
            const callDataAllWallet = await CallApi.getAllWallet();
            
            if (callDataAllPayment && callDataAllPayment.data && callDataAllPayment.data.length > 0) {
                const numericAmount = parseFloat(amount);
                const lastPayment = callDataAllPayment.data[callDataAllPayment.data.length - 1];
                const lastPaymentAmount = parseFloat(lastPayment.Price);
    
                if (lastPaymentAmount === numericAmount && lastPayment.Content.includes(description)) {
                    setPaymentSuccess(true); // Cập nhật biến trạng thái
    
                    // Kiểm tra nếu userLoginBasicInformationDto.accountId có trong dữ liệu callDataAllWallet.investorId
                    const walletData = callDataAllWallet.find(wallet => wallet.investorId === userLoginBasicInformationDto.accountId);
    
                    if (walletData) {
                        // Nếu tài khoản đã tồn tại, cập nhật số dư
                        const getIdWallet = walletData.id;
                        const updatedAmount = parseFloat(walletData.accountBalance) + numericAmount;
                        const dataToSend = {
                            "status": true,
                            accountBalance: updatedAmount
                        };
                        try {
                            await axios.put('http://firstrealestate-001-site1.anytempurl.com/api/Wallet/UpdateWallet/'+getIdWallet, dataToSend);
                            console.log("Wallet updated successfully!");
                            
                            // Gửi dữ liệu đến API WalletHistory
                            const walletHistoryData = {
                                walletId: getIdWallet,
                                description: `Bạn đã nạp thành công ${numericAmount} vào tài khoản`
                            };
                            await axios.post('http://firstrealestate-001-site1.anytempurl.com/api/WalletHistory/CreateWalletHistory', walletHistoryData);
                            console.log("Wallet history created successfully!");
                        } catch (error) {
                            console.error("Error updating wallet or creating wallet history:", error);
                            // Xử lý lỗi ở đây nếu cần
                        }
                    } else {
                        // Nếu không có tài khoản, tạo mới
                        const dataToSend = {
                            investorId: userLoginBasicInformationDto.accountId,
                            accountBalance: numericAmount
                        };
                        try {
                            await axios.post('http://firstrealestate-001-site1.anytempurl.com/api/Wallet/CreateWallet', dataToSend);
                            console.log("New wallet created successfully!");
                            
                            // Gửi dữ liệu đến API WalletHistory
                            const walletHistoryData = {
                                walletId: walletData.id,
                                description: `Bạn đã nạp thành công ${numericAmount} vào tài khoản`
                            };
                            await axios.post('http://firstrealestate-001-site1.anytempurl.com/api/WalletHistory/CreateWalletHistory', walletHistoryData);
                            console.log("Wallet history created successfully!");
                        } catch (error) {
                            console.error("Error creating new wallet or creating wallet history:", error);
                            // Xử lý lỗi ở đây nếu cần
                        }
                    }
    
                    clearInterval(checkInterval); // Dừng kiểm tra khi thanh toán thành công
                    // Xóa dữ liệu sau khi thanh toán thành công
                    setAmount('');
                    setDescription('');
                    setPaymentUrl('');
                    alert("Payment successful!");
                } else {
                    console.log("Payment not successful. Please check the details or try again.");
                }
            } else {
                console.log('No payment data available.');
            }
        } catch (error) {
            console.error('Error during payment check:', error.message);
            clearInterval(checkInterval); // Dừng kiểm tra nếu có lỗi
        }
    }
    
    



    return (
        <div className='container'>
             <InvestorMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserInvestor}
            />
            <div className='col-md-9 thanhtoanphi'>
                <div className='payment-form'>
                    <h2>Thực hiện thanh toán</h2>
                    <div className='input-container' >
                        <label>Số tiền bạn muốn nạp để thanh toán:</label>
                        <input  type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <button onClick={handlePayment} style={{marginBottom: '20px'}}>Thanh toán</button>
                    {paymentUrl && (
                        <div>
                            <h3 style={{ marginTop: '20px', fontSize: "24px" }}>Quét mã bên dưới để thanh toán </h3>
                            <img src={paymentUrl} alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
