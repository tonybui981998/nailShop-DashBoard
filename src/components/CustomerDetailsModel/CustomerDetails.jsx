import React, { useState } from "react";
import "./CustomerDetails.scss";
import { updateBookingInfor } from "../service/ApiService";
import HashLoader from "react-spinners/HashLoader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const CustomerDetails = ({
  selectEvent,
  closeCusDetails,
  reLoadAdmin,
  currentSelectedDate,
  handleDisplayStaffWorking,
  setSelectEvent,
}) => {
  const [loading, setloading] = useState(false);
  const [edited, setEdited] = useState(false);
  const [tempCusDetails, setTempCusDetails] = useState({
    title: selectEvent.title,
    email: selectEvent.email,
    customerPhone: selectEvent.customerPhone,
  });
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const dispatch = useDispatch();
  //console.log("check checl", selectEvent);
  // submit button
  const submit = () => {
    const data = {
      id: selectEvent.bookedId,
      customerName: tempCusDetails.title,
      customerPhone: tempCusDetails.customerPhone,
      email: tempCusDetails.email,
    };
    setTimeout(() => {
      setloading(true);
    }, 300);
    setTimeout(async () => {
      setloading(false);
      const result = await updateBookingInfor(data);
      if (result.data.status === "success") {
        setSelectEvent({
          ...selectEvent,
          title: tempCusDetails.title,
          email: tempCusDetails.email,
          customerPhone: tempCusDetails.customerPhone,
        });
        await reLoadAdmin();
        dispatch(handleDisplayStaffWorking(currentSelectedDate));
        closeCusDetails();
      } else {
        toast.error(result.data.message);
      }
      console.log("check data", result);
    }, 3000);
  };
  return (
    <div className="customer-details-overlay" onClick={closeCusDetails}>
      <div
        className="customer-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
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
        <div className="modal-header">
          <span>Customer Details</span>
          <button onClick={closeCusDetails} className="close-btn">
            Close
          </button>
        </div>
        <div className="detail-item">
          <label>Name:</label>
          <input
            value={tempCusDetails.title}
            onChange={(e) => {
              setTempCusDetails({
                ...tempCusDetails,
                title: e.target.value,
              });
              setEdited(true);
            }}
          ></input>
        </div>
        <div className="detail-item">
          <label>Email:</label>
          <input
            value={tempCusDetails.email}
            onChange={(e) => {
              setTempCusDetails({
                ...tempCusDetails,
                email: e.target.value,
              });
              setEdited(true);
            }}
          ></input>
        </div>
        <div className="detail-item">
          <label>Phone:</label>
          <input
            value={tempCusDetails.customerPhone}
            onChange={(e) => {
              setTempCusDetails({
                ...tempCusDetails,
                customerPhone: e.target.value,
              });
              setEdited(true);
            }}
          ></input>
        </div>
        {edited && (
          <button className="button" onClick={() => submit()}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
