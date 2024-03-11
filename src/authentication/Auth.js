// Auth.js
const TOKEN_KEY = 'token';

const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export { saveToken, getToken, removeToken };
