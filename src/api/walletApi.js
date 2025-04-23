import API from "./api"

export const getWalletApi = () => API.get("/wallet")
export const getWalletTransactionsApi = () => API.get("/wallet/transactions")

// wallet payment
export const processWalletPaymentApi = (orderId) => API.post("/wallet/process-payment", { orderId })
export const checkWalletBalanceApi = (amount) => API.get(`/wallet/check-balance?amount=${amount}`)