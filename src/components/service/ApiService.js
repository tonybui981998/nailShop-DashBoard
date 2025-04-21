import axios from "axios";
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
};
