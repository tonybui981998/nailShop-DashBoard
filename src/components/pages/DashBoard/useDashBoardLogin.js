import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetAdminColor,
  fetAdminStaff,
  fetBookingCancle,
  handleClockOut,
  handleDisplayStaffWorking,
} from "../../redux/CounterSlice";

const useDashBoardLogin = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  const { AdminStaff, GetStaffWorkingDay, GetAdminColorCheck } = useSelector(
    (state) => state.counter
  );
  const reLoadAdmin = async () => {
    const result = await dispatch(fetAdminStaff());
    if (result != null) {
      const today = new Date();
      dispatch(handleDisplayStaffWorking(today));
    }
    dispatch(fetAdminColor());
  };
  useEffect(() => {
    reLoadAdmin();
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== currentDate) {
        setCurrentDate(today);
        useeffect();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const clockOut = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(handleClockOut());
      navigate("/");
    }, 2500);
  };
  // delete booking
  const deletebooking = async (id) => {
    await dispatch(fetBookingCancle(id));
  };

  return {
    clockOut,
    loading,
    AdminStaff,
    GetStaffWorkingDay,
    GetAdminColorCheck,
    deletebooking,
    handleDisplayStaffWorking,
    reLoadAdmin,
  };
};

export default useDashBoardLogin;
