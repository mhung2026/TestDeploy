// AuthRoleManager.js
class AuthRoleManager {
    static roles = {
        Agency: {
            allowedPages: ['/acencytindang', '/agencythongtinchitiet', '/agencythongtinchitiet/:estateName'],
        },
        Investor: {
            allowedPages: ['/home2', '/home'],
        },
        Customer: {
            allowedPages: ['/customer1', '/customer2', '/customer3'],
        },
    };

    static getUserRole() {
        const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
        return userLoginBasicInformationDto ? userLoginBasicInformationDto.roleName : null;
    }

    static getAllowedPages() {
        const userRole = this.getUserRole();
        const allowedPages = userRole ? this.roles[userRole].allowedPages : [];
        console.log('Allowed Pages:', allowedPages);
        return allowedPages;
    }

    static isPageAllowed(page) {
        const allowedPages = this.getAllowedPages();
        const normalizedPage = `/${page.split('/').pop()}`; // Lấy phần cuối của URL và thêm '/' vào trước
        console.log('Normalized Page:', normalizedPage);
        console.log('Is Page Allowed:', allowedPages.includes(normalizedPage));
        return allowedPages.includes(normalizedPage);
    }
}

export default AuthRoleManager;
