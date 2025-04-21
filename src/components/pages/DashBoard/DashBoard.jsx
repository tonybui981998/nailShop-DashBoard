import React, { useEffect, useState } from "react";
import "./DashBoard.scss";
import { useDispatch, useSelector } from "react-redux";

import HashLoader from "react-spinners/HashLoader";
import CustomerFeedBack from "../../DisplayCoponents/CustomerFeedBack/ CustomerFeedBack";
import useDashBoardLogin from "./useDashBoardLogin";
import BookingCalender from "../../Bookingcomponent/BookingCalender/BookingCalender";

const DashBoard = () => {
  const [active, setActive] = useState("staffDisplay");
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const {
    clockOut,
    loading,
    AdminStaff,
    GetStaffWorkingDay,
    GetAdminColorCheck,
  } = useDashBoardLogin();
  const dispatch = useDispatch();
  // console.log("check admin", AdminStaff);
  //console.log("check staff working day", GetStaffWorkingDay);
  //console.log("check color", GetAdminColorCheck);
  return (
    <div className="dashboard">
      {loading && (
        <div className="overlay">
          <HashLoader
            color={"red"}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <div className="top-menu">
        <div
          className={`options ${active === "feedback" ? "active" : ""}`}
          onClick={() => setActive("feedback")}
        >
          Customer Feedback
        </div>

        <div
          className={`options ${active === "booking" ? "active" : ""}`}
          onClick={() => setActive("booking")}
        >
          Staff
        </div>

        <div className="options" onClick={clockOut}>
          Log Out
        </div>
      </div>

      <div className="content-area">
        {active === "feedback" && <CustomerFeedBack />}
        {active === "booking" && (
          <BookingCalender
            GetStaffWorkingDay={GetStaffWorkingDay}
            GetAdminColorCheck={GetAdminColorCheck}
          />
        )}
      </div>
    </div>
  );
};

export default DashBoard;
