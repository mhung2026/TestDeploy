import React, { useEffect, useState } from 'react';
import CallApi from '../CallApi';

export default function AdminAllAccount() {
    const [accountData, setAccountData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const callDataAllAccount = await CallApi.getAllAccount();
                setAccountData(callDataAllAccount);
                const callDataAllRole = await CallApi.getAllRole();
                setRoleData(callDataAllRole);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const getRoleNameByRoleId = (roleId) => {
        const role = roleData.find(role => role.id === roleId);
        return role ? role.roleName : 'Unknown';
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
        const year = date.getFullYear();
    
        // Đảm bảo ngày và tháng hiển thị với 2 chữ số bằng cách thêm '0' nếu cần
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
    
        return formattedDay + '/' + formattedMonth + '/' + year;
    };

    const filteredAccounts = selectedRoleId
        ? accountData.filter(account => account.roleId.toString() === selectedRoleId)
        : accountData;

    return (
        <div>
            <h2 style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>All Accounts</h2>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <select value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)}>
                    <option value="">All Roles</option>
                    {roleData.map(role => (
                        <option key={role.id} value={role.id}>{role.roleName}</option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Vai trò</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Ngày tạo</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAccounts.map(account => (
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>{account.username}</td>
                            <td>{getRoleNameByRoleId(account.roleId)}</td>
                            <td>{account.email}</td>
                            <td>{account.phoneNumber}</td>
                            <td>{account.address}</td>
                            <td>{formatDate(account.createAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
