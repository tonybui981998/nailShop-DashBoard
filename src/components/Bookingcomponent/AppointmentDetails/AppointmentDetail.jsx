import React, { useEffect, useState } from "react";
import moment from "moment";
import "./AppointmentDetail.scss";
import { useDispatch } from "react-redux";
import CreateNewBooking from "../CreateNewBooking/CreateNewBooking";
import {
  confirmcheckout,
  deleteService,
  getBookingConfirm,
} from "../../service/ApiService";
import HashLoader from "react-spinners/HashLoader";
import CustomerDetails from "../../CustomerDetailsModel/CustomerDetails";
import CheckOutModel from "../../CheckOutModel/CheckOutModel";
import SendMessageModel from "../../MessagesendModel/SendMessageModel";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const AppointmentDetail = ({
  selectEvent,
  closeModel,
  GetStaffWorkingDay,
  deletebooking,
  handleDisplayStaffWorking,
  reLoadAdmin,
  currentSelectedDate,
  setSelectEvent,
}) => {
  let [loading, setLoading] = useState(false);
  const [openBookNext, setOpenBookNext] = useState(false);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("confirmed");
  const [minuteLate, setMinuteLate] = useState();
  const [staffName, setStaffName] = useState();
  const [allServiceBooking, setAllServiceBooking] = useState(
    selectEvent.bookingService
  );
  const [opencustomerDetails, setOpenCustomerDetails] = useState(false);
  const [openChekoutModel, setOpenCheckOutModel] = useState(false);
  const [checkbookingexist, setcheckbookingexist] = useState();
  const fullDate = moment(selectEvent.start).format("ddd, D MMM, YYYY");
  const [openMessageModel, setOpenMessageModel] = useState(false);
  const [bookingConfirmData, setBookingConfirmData] = useState();
  const [openService, setOpenService] = useState();

  // open check out model
  const openChekOut = () => {
    setOpenCheckOutModel(true);
  };
  // close check out model
  const closeCheckout = () => {
    setOpenCheckOutModel(false);
  };
  // open customer details model
  const openCusDetails = () => {
    setOpenCustomerDetails(true);
  };
  // close customerDetails model
  const closeCusDetails = () => {
    setOpenCustomerDetails(false);
  };
  // open booking model
  const openBook = () => {
    setOpenBookNext(true);
  };
  // close booking model
  const closeBook = () => {
    setOpenBookNext(false);
  };
  // open send message model
  const openSendMessage = () => {
    setOpenMessageModel(true);
  };
  // close send message model
  const closeSendMessage = () => {
    setOpenMessageModel(false);
  };
  // get staff name
  const getStaffName = () => {
    const staffNames = GetStaffWorkingDay.find(
      (s) => s.id === selectEvent.resourceId
    );
    setStaffName(staffNames);
  };
  // open and close service button
  const serviceOpenclose = (index) => {
    setOpenService(openService === index ? null : index);
  };
  // delete booking
  const deleteBookingApoint = async (id) => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      await deletebooking(id);
      await reLoadAdmin();
      dispatch(handleDisplayStaffWorking(currentSelectedDate));
      closeModel();
    }, 3000);
  };

  const checkConfirmcheckout = async () => {
    const respond = await confirmcheckout(selectEvent.bookedId);
    setcheckbookingexist(respond.data.status);
  };
  useEffect(() => {
    getStaffName();
  }, []);
  useEffect(() => {
    checkConfirmcheckout();
  }, []);
  // display previous booking
  const getbookingConfirmData = async () => {
    const respond = await getBookingConfirm();
    console.log("check respond", respond);
    const matchData = respond.data.filter(
      (s) =>
        s &&
        s.cusName === selectEvent.title &&
        selectEvent.customerPhone === s.cusPhone
    );
    setBookingConfirmData(matchData);
  };
  useEffect(() => {
    getbookingConfirmData();
  }, []);

  // delete service
  const deleteEachService = async (service) => {
    const booking = {
      selectedService: service.selectedService,
      bookingId: service.bookingId,
    };

    const result = await deleteService(booking);
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      if (result.data.status === "success") {
        await reLoadAdmin();
        dispatch(handleDisplayStaffWorking(currentSelectedDate));
        const updateList = allServiceBooking.filter(
          (s) => s.selectedService != service.selectedService
        );
        setAllServiceBooking(updateList);
        selectEvent.bookingService = updateList;
      }
    }, 3000);
  };
  // format booking date
  const formatDate = (date) => {
    const format = new Date(date).toLocaleDateString("en-nz");
    return format;
  };
  // format start -end time
  const formatTime = (time) => {
    //console.log("check time time", time);
    const [hour, mins] = time?.split(":");
    const amp = hour < 12 ? "AM" : "PM";
    return `${hour}:${mins} `;
  };
  console.log("check booking confirm", bookingConfirmData);
  return (
    <div className="modal-overlay" onClick={closeBook}>
      <div className="appointment-detail" onClick={(e) => e.stopPropagation()}>
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
        <div className="header">
          <span>Appointment</span>
          <button onClick={closeModel}>Close</button>
        </div>

        <div
          style={{ cursor: "pointer" }}
          className="customer-name"
          onClick={() => openCusDetails()}
        >
          {selectEvent.title}
        </div>

        <div className="date-time-section">
          {allServiceBooking.map((service, index) => {
            const baseStart = moment(selectEvent.start);
            const prevDuration = allServiceBooking
              .slice(0, index)
              .reduce((acc, s) => acc + parseInt(s.duration), 0);
            const start = baseStart.clone().add(prevDuration, "minutes");
            const end = start
              .clone()
              .add(parseInt(service.duration), "minutes");

            return (
              <div key={index} className="service-block">
                <div className="service-header">
                  <span
                    className="remove-service-btn"
                    onClick={() => deleteEachService(service)}
                  >
                    −
                  </span>
                </div>
                <div className="time-range">
                  {start.format("hh:mma")} – {end.format("hh:mma")}
                </div>
                <div className="service-name">{service.selectedService}</div>
                <div className="service-name">
                  with {staffName?.fullName || "Unknown"}
                </div>
                <div className="price">
                  {service.price > 0 ? (
                    `$${service.price}`
                  ) : (
                    <span style={{ color: "green" }}>$</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <ul className="action-list">
          <li onClick={() => openSendMessage()}>Send text message</li>
          {checkbookingexist === "notfound" ? (
            <li onClick={() => openChekOut()}>Check out</li>
          ) : (
            <li
              style={{
                pointerEvents: "none",
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            >
              Check out
            </li>
          )}

          <li onClick={() => openBook()}>Book next</li>
          {checkbookingexist === "notfound" ? (
            <li onClick={() => deleteBookingApoint(selectEvent.bookedId)}>
              Cancel
            </li>
          ) : (
            <li
              style={{
                pointerEvents: "none",
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            >
              Cancel
            </li>
          )}
        </ul>

        <div className="technical-info">
          <strong>Upcomming appointment </strong>
          <p>
            {allServiceBooking.map((item, index) => {
              return (
                <div className="service" key={index}>
                  <div>{item.selectedService}</div>
                </div>
              );
            })}
          </p>
          <p>with {staffName?.fullName || "Unknown"}</p>
        </div>
        <div className="technical-info">
          <strong>Previous Appointments</strong>
        </div>

        {bookingConfirmData &&
          bookingConfirmData.map((booking, index) => (
            <div className="bookinghistory" key={index}>
              {booking.bookingStatus === "confirmed" ? (
                ""
              ) : (
                <div className="booking-summary">
                  <span className="value">{booking.bookingStatus}</span>
                </div>
              )}
              <div className="booking-summary">
                <span className="value">{formatDate(booking.bookingDate)}</span>
              </div>
              <div className="booking-summary" style={{ cursor: "pointer" }}>
                <span onClick={() => serviceOpenclose(index)} className="value">
                  {booking.service[0].selectedService}
                </span>
              </div>
              <div> with {staffName?.fullName || "Unknown"}</div>
              {openService === index && (
                <div className="service-list">
                  {booking.service.map((service, idx) => (
                    <div className="service-item" key={idx}>
                      <div>
                        <strong>Service:</strong> {service.selectedService}
                      </div>
                      <div>
                        <strong>Time:</strong> {service.duration} mins
                      </div>
                      <div>
                        <strong>Price:</strong> ${service.price}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        {openBookNext && (
          <CreateNewBooking
            closeBook={closeBook}
            selectEvent={selectEvent}
            reLoadAdmin={reLoadAdmin}
            currentSelectedDate={currentSelectedDate}
            handleDisplayStaffWorking={handleDisplayStaffWorking}
            closeModel={closeModel}
          />
        )}
        {opencustomerDetails && (
          <CustomerDetails
            selectEvent={selectEvent}
            closeCusDetails={closeCusDetails}
            reLoadAdmin={reLoadAdmin}
            currentSelectedDate={currentSelectedDate}
            handleDisplayStaffWorking={handleDisplayStaffWorking}
            setSelectEvent={setSelectEvent}
          />
        )}
        {openChekoutModel && (
          <CheckOutModel
            selectEvent={selectEvent}
            allServiceBooking={allServiceBooking}
            closeCheckout={closeCheckout}
            checkConfirmcheckout={checkConfirmcheckout}
          />
        )}
        {openMessageModel && (
          <SendMessageModel
            closeSendMessage={closeSendMessage}
            selectEvent={selectEvent}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail;
