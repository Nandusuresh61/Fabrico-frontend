import API from './api';

export const getAllTransactionsApi = (params) => {
    const queryString = new URLSearchParams(params).toString();
    return API.get(`/transactions?${queryString}`);
};

export const getTransactionByIdApi = (id) => {
    return API.get(`/transactions/${id}`);
};