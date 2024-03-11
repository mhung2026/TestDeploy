// CallApi.js
import axios from 'axios';

class CallApi {
    static async getAllReservations() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/reservation/GetAllReservation');
            return response.data;
        } catch (error) {
            console.error('Error fetching reservation data:', error);
            return null;
        }
    }

    static async getAllRealEstate() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/invester/getAllRealEstate');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }

    static async getAllAccount() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/admin/getAllAccount');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async getAllDirect() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/direct/getAllDirect');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async getAllPayMent() {
        try {
            const response = await axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=JPPSQ-fot0J0W9wj8yXHWkwPtJfFOgDwaki7KoH__NkhHNKlGpJ_H3L_IXiCrPzykz3xWCkiXfCDKQnQPGIdhktQJkVynN4fm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnEdV-cB_VcJYh-rThqV7h8GNPA--8n4PWO8ONvoG2LKHDSU-2n4lGV_Y-LbotBxADHIex1tkTLww5QZfCIS2f6d6sJ333kZUNtz9Jw9Md8uu&lib=Me84qEHdJVNIFNFlpsmPH2c5RV3tBGefZ');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async getAllReservationAdmin() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/admin/GetAllReservation');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async getAllRole() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/role/getAllRole');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async getAllWallet() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/Wallet/GetAllWallet');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async getAllWalletHistorylWallet() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/WalletHistory/GetAllWalletHistory');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async getAllLocation() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/location/getAllLocation');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }
    static async GetAllReservationTime() {
        try {
            const response = await axios.get('http://firstrealestate-001-site1.anytempurl.com/api/ReservationTime/GetAllReservationTime');
            return response.data;
        } catch (error) {
            console.error('Error fetching real estate data:', error);
            return null;
        }
    }

    
    static findReservationById(reservationData, id) {
        if (!reservationData) return null;
        return reservationData.find(reservation => reservation.customerId === id);
    }


}

export default CallApi;
