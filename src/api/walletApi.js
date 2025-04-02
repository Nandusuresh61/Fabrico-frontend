import API from "./api"

export const getWalletApi = () => API.get("/wallet")
export const getWalletTransactionsApi = () => API.get("/wallet/transactions")
