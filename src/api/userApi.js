import API from "./api"

export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)
export const userLogoutApi = (data) => API.post("/users/logout", data)


// OTP API


export const verifyOtpApi = (data) => API.post("/users/verify-otp", data)
export const resendOtpApi = (data) => API.post("/users/resend-otp", data)