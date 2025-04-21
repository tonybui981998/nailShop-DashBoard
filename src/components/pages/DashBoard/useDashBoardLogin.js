import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetAdminColor,
  fetAdminStaff,
  handleClockOut,
  handleDisplayStaffWorking,
} from "../../redux/CounterSlice";

const useDashBoardLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  const { AdminStaff, GetStaffWorkingDay, GetAdminColorCheck } = useSelector(
    (state) => state.counter
  );
  useEffect(() => {
    useeffect();
  }, []);
  const useeffect = async () => {
    const result = await dispatch(fetAdminStaff());
    if (result != null) {
      dispatch(handleDisplayStaffWorking());
    }
    dispatch(fetAdminColor());
  };
  const clockOut = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(handleClockOut());
      navigate("/");
    }, 2500);
  };

  return {
    clockOut,
    loading,
    AdminStaff,
    GetStaffWorkingDay,
    GetAdminColorCheck,
  };
};

export default useDashBoardLogin;
