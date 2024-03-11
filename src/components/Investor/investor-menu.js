import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../CallApi';
export default function InvestorMenu({ userLoginBasicInformationDto, UserMenu }) {
    const [InvesBalances, setIdInvestorWallet] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
               
                const getAllWallet = await CallApi.getAllWallet();
                const getIdInvestorWallet = getAllWallet.filter(IdInvestor => IdInvestor.investorId === userLoginBasicInformationDto.accountId);
                console.log('s',getIdInvestorWallet);
                const accountBalances = getIdInvestorWallet.map(wallet => wallet.accountBalance);
                setIdInvestorWallet(accountBalances);

            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="col-md-3 account">
            <span className='welcome'>Chào mừng, {userLoginBasicInformationDto.username}!</span>
            <span>Số dư: {InvesBalances.length > 0 ? InvesBalances : 0}</span>
            {/* <span>Your role is: {userLoginBasicInformationDto.roleName}</span>
            <span>Your role is: {userLoginBasicInformationDto.accountId}</span> */}
            <ul className="menu-list-investor">
                {UserMenu.map(menuItem => (
                    <li key={menuItem.id} className="menu-item-container">
                        <Link className="menu-item-investor" to={menuItem.link}>{menuItem.name}</Link>
                    </li>
                ))}
            </ul>

        </div>
    );
}
