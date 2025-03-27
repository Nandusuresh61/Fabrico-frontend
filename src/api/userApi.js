import API from "./api"

export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)
export const userLogoutApi = (data) => API.post("/users/logout", data)


// OTP API


export const verifyOtpApi = (data) => API.post("/users/verify-otp", data)
export const resendOtpApi = (data) => API.post("/users/resend-otp", data)

// Forgot Password APIs
export const sendForgotPasswordEmailApi = (data) => API.post("/users/forgot-password", data)
export const verifyForgotOtpApi = (data) => API.post("/users/verify-forgot-otp", data)
export const resendForgotOtpApi = (data) => API.post("/users/resend-forgot-otp", data)
export const resetPasswordApi = (data) => API.post("/users/reset-password", data)



export const googleAuthApi = (code) => API.post(`/users/google?code=${code}`, code)

export const updateProfileApi = (data) => API.post("/users/update-profile", data)
export const sendEmailUpdateOtpApi = (data) => API.post("/users/send-email-update-otp", data)
export const verifyEmailUpdateOtpApi = (data) => API.post("/users/verify-email-update", data)

export const changePasswordApi = (data) => API.post("/users/change-password", data)