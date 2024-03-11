import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../authentication/Auth';
import InvestorMenu from './investor-menu';
import UserInvestor from '../../list/userInvestor';
export default function Quanlitindang() { // Sửa tên component thành Quanlitindang
    const [realEstates, setRealEstates] = useState([]);
    const token = getToken();
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    useEffect(() => {
        const fetchRealEstates = async () => {
            try {
                const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/invester/getAllRealEstate', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const filteredRealEstates = response.data.filter(realEstate => realEstate.investorId === userLoginBasicInformationDto.accountId);
                setRealEstates(filteredRealEstates);
            } catch (error) {
                console.error('Error fetching real estates:', error.message);
            }
        };

        fetchRealEstates();
    }, [token]);

    return (
        <div className=' container' >
            <InvestorMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserInvestor}

            />
            <div className="col-md-9">
                <div className='listreal'>
                    <h2>Danh sách bất động sản đăng tin</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='titlecontent'>STT</th>
                                <th className='titlecontent'>Tên bất động sản</th>
                                {/* <th>Trạng thái</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {realEstates.map(realEstate => (
                                <tr key={realEstate.id}>
                                    <td>{realEstate.id}</td>
                                    <td>{realEstate.realestateName}</td>
                                    {/* <td>
                                    <a href='/chinhsuatindang'><button>Edit</button></a>
                                    <a href='/chinhsuatindang'><button>Delete</button></a>
                                </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}