import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetAdminColor,
  fetAdminStaff,
  fetAllService,
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
    await dispatch(fetAdminStaff());
    await dispatch(fetAdminColor());
  };

  useEffect(() => {
    const today = new Date();
    const loadData = async () => {
      await dispatch(fetAdminStaff());
      await dispatch(fetAdminColor());
      await dispatch(fetAllService());
      dispatch(handleDisplayStaffWorking(today));
    };

    loadData();
    const interval = setInterval(() => {
      const todayString = new Date().toDateString();
      if (todayString !== currentDate) {
        setCurrentDate(todayString);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
