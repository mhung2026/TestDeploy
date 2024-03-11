import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Agencydangtinpart1 from './investor-dangtinpart1';
import Agencydangtinpart2 from './investor-dangtinpart2';
import UserInvestor from '../../list/userInvestor';
import InvestorMenu from './investor-menu';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CallApi from '../CallApi';
export default function Agencydangtinmain() {


    const [IdWallet, setIdWallet] = useState(null);
    const [DataAllWallet, setDataAllWallet] = useState(null);
    const [Amout, setAmout] = useState(null);
    const [dataFromPart1, setDataFromPart1] = useState(null);
    const [dataFromPart2, setDataFromPart2] = useState(null);
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllWallet = await CallApi.getAllWallet();
                setDataAllWallet(getAllWallet);
                const getIdInvestor = getAllWallet.filter(IdAmount => IdAmount.investorId === userLoginBasicInformationDto.accountId);

                setIdWallet(getIdInvestor);
                const getAmout = getIdInvestor.map(amount => amount.accountBalance)
                setAmout(getAmout);

            } catch (error) {
                console.error("Error at fetchData", error);
            }
        };
        fetchData();
    }, []);


    const handleSendDataPart1 = (data) => {
        setDataFromPart1(data);
    };

    const handleSendDataPart2 = (data) => {
        setDataFromPart2(data);
    };
    const updateWallet = async () => {
        try {
            const walletData = DataAllWallet.find(wallet => wallet.investorId === userLoginBasicInformationDto.accountId);
            const getIdWallet = walletData.id;
            const numericAmount = parseFloat(Amout);
            const updatedAmount = parseFloat(numericAmount - 1000);
           
            const requestData = {
                "status": true,
                accountBalance: updatedAmount
            };
            await axios.put('http://firstrealestate-001-site1.anytempurl.com/api/Wallet/UpdateWallet/' + getIdWallet, requestData);
            toast.success('Bạn đã bị trừ 1000');
        } catch (error) {
            console.error('Error updating wallet:', error);
        }
    };

    const handleSendDataToSwagger = () => {
        if (dataFromPart1) {
            if (Amout < 1000) {
                toast.error('Số dư không đủ để đăng tin');
            } else {
                const requestData = {
                    ...dataFromPart1,
                    listRealEstateImageUrl: dataFromPart2,
                };
                console.log("Data sent to Swagger:", requestData);
                axios.post('http://firstrealestate-001-site1.anytempurl.com/api/invester/createNewRealEstate/' + userLoginBasicInformationDto.accountId, requestData)
                    .then(response => {
                        console.log('Data sent to Swagger:', response.data);
                        updateWallet(); // Gọi hàm để cập nhật ví
                    })
                    .catch(error => {
                        toast.error('Vui lòng điền đầy đủ thông tin cần thiết trước khi gửi.');
                        console.error('Error sending data to Swagger:', error);
                    });
            }
        } else {
            console.error('No data available to send to Swagger');
            // Hiển thị thông báo lỗi cho người dùng
        }
    };


    return (

        <div className='container'>
            <InvestorMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserInvestor}

            />
            <div className='thongtindangtin'>
                <div className='thongtindangtinbds'>
                    <h2 style={{fontSize: '24px', marginBottom:'20px', marginTop: '10px'}}>Thông tin chi tiết dự án bất động sản</h2>
                    <Agencydangtinpart1 sendData={handleSendDataPart1} />
                </div>
                <div className='thongtindangtinhinhanh'>
                    <h2 style={{fontSize: '24px', marginBottom:'20px', marginTop: '10px'}}>Hình ảnh bất động sản</h2>
                    <Agencydangtinpart2 sendData={handleSendDataPart2} />
                    <button onClick={handleSendDataToSwagger} style={{ backgroundColor: '#90c908' }}>Đăng tin</button>
                    <ToastContainer />

                </div>
            </div>

        </div>
    )
}
