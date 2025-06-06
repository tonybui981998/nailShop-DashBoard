import React, { useEffect, useState } from "react";
import "./DashBoard.scss";
import { useDispatch, useSelector } from "react-redux";

import HashLoader from "react-spinners/HashLoader";
import CustomerFeedBack from "../../DisplayCoponents/CustomerFeedBack/ CustomerFeedBack";
import useDashBoardLogin from "./useDashBoardLogin";
import BookingCalender from "../../Bookingcomponent/BookingCalender/BookingCalender";
import StaffManagement from "../../\bStaffManagement/StaffMangementMain/StaffManagement";

const DashBoard = () => {
  const [active, setActive] = useState("booking");
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
    deletebooking,
    handleDisplayStaffWorking,
    reLoadAdmin,
  } = useDashBoardLogin();
  const dispatch = useDispatch();

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
          Booking
        </div>
        <div
          className={`options ${active === "staff" ? "active" : ""}`}
          onClick={() => setActive("staff")}
        >
          Staff Management
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
            deletebooking={deletebooking}
            handleDisplayStaffWorking={handleDisplayStaffWorking}
            reLoadAdmin={reLoadAdmin}
          />
        )}
        {active === "staff" && <StaffManagement AdminStaff={AdminStaff} />}
      </div>
    </div>
  );
};

export default DashBoard;
