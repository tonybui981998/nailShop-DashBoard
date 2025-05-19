import axios from "axios";
import { data } from "react-router-dom";
const api = import.meta.env.VITE_API_KEY;
// user login
const getLogin = (data) => {
  const apiUserLogin = import.meta.env.VITE_API_USERLOGIN;
  try {
    const respond = axios.post(`${api}${apiUserLogin}`, data);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// get customer feedback
const getCustomerFeedBack = () => {
  const apiFeedBack = import.meta.env.VITE_API_FEEDBACK;
  try {
    const respond = axios.get(`${api}${apiFeedBack}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// delete feedback
const deleteFeedBack = (id) => {
  const apiDelete = import.meta.env.VITE_API_DELETE;
  try {
    const respond = axios.delete(`${api}${apiDelete}/${id}`);
  } catch (e) {
    console.log(e);
  }
};
// get all customer required
const GetAllRequired = () => {
  const apiRequired = import.meta.env.VITE_API_REQUIRED;
  try {
    const respond = axios.get(`${api}${apiRequired}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// delete required
const DeleteRequired = (id) => {
  const apiDelete = import.meta.env.VITE_API_REQUIREDELETE;
  try {
    const respond = axios.delete(`${api}${apiDelete}/${id}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
//admin get staff
const getadMinStaff = async () => {
  const apiStaff = import.meta.env.VITE_API_ADMINSTAFF;
  try {
    const respond = await axios.get(`${api}${apiStaff}`);

    return respond;
  } catch (e) {
    console.log(e);
  }
};
/// create payroll
const getAdminCreatePayroll = async (data) => {
  const apiPayroll = import.meta.env.VITE_API_PAYROLL;
  try {
    const respond = await axios.post(`${api}${apiPayroll}`, data);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// get payroll history
const getPayrollHistory = async () => {
  const apiPayroll = import.meta.env.VITE_API_HISTORYPAYROLL;
  try {
    const respond = await axios.get(`${api}${apiPayroll}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// get admin information
const getAdminColor = async () => {
  const apiColor = import.meta.env.VITE_APU_COLORCHECK;
  try {
    const respond = await axios.get(`${api}${apiColor}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// delete whole booking appointment
const deleteAppointment = async (id) => {
  const apiDelete = import.meta.env.VITE_API_BOOKDELETE;
  try {
    const respond = await axios.delete(`${api}${apiDelete}/${id}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// delete each service
const deleteService = async (data) => {
  const apiDelete = import.meta.env.VITE_API_DELETESERVICE;
  try {
    const respond = await axios.delete(`${api}${apiDelete}`, { data });
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// all service
const getAllService = async () => {
  const apiService = import.meta.env.VITE_API_MENU;
  try {
    const respond = await axios.get(`${api}${apiService}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
const staffmakeBooking = async (data) => {
  const apiService = import.meta.env.VITE_API_BOOKING;
  console.log("check data", data);
  try {
    const respond = await axios.post(`${api}${apiService}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// client update infor
const updateBookingInfor = async (data) => {
  const apiService = import.meta.env.VITE_API_UPDATECLIENTINFO;
  try {
    const respond = await axios.put(`${api}${apiService}`, data);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// check voucher
const checkvoucher = async (data) => {
  const apiVoucher = import.meta.env.VITE_API_CHECKVOUCHER;
  try {
    const respond = await axios.post(`${api}${apiVoucher}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// check out
const checkout = async (data) => {
  const apicheckout = import.meta.env.VITE_API_CHECKOUT;
  try {
    const respond = await axios.post(`${api}${apicheckout}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// check to confirm checkout
const confirmcheckout = async (id) => {
  const apicheckout = import.meta.env.VITE_API_CHECKCONFIRMCHECKOUT;
  try {
    const respond = await axios.get(`${api}${apicheckout}/${id}`);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// admin send email
const adminEmail = async (data) => {
  const apiMessage = import.meta.env.VITE_API_SENDMESSAGE;
  try {
    const respond = await axios.post(`${api}${apiMessage}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return respond;
  } catch (e) {
    console.log(e);
  }
};
// get booking confirm
const getBookingConfirm = async () => {
  const apiConfirmbooking = import.meta.env.VITE_API_CONFIRMBOOKING;
  try {
    const respond = await axios.get(`${api}${apiConfirmbooking}`);
    //console.log("check respond ", respond);
    return respond;
  } catch (e) {
    console.log(e);
  }
};
export {
  getLogin,
  getCustomerFeedBack,
  deleteFeedBack,
  GetAllRequired,
  DeleteRequired,
  getadMinStaff,
  getAdminCreatePayroll,
  getPayrollHistory,
  getAdminColor,
  deleteAppointment,
  deleteService,
  getAllService,
  staffmakeBooking,
  updateBookingInfor,
  checkvoucher,
  checkout,
  confirmcheckout,
  adminEmail,
  getBookingConfirm,
};
