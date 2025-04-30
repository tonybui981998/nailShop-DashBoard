import React, { useEffect, useState } from "react";
import moment from "moment";
import "./AppointmentDetail.scss";
import { useDispatch } from "react-redux";
import CreateNewBooking from "../CreateNewBooking/CreateNewBooking";
import { deleteService } from "../../service/ApiService";
import HashLoader from "react-spinners/HashLoader";
import CustomerDetails from "../../CustomerDetailsModel/CustomerDetails";
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
  const fullDate = moment(selectEvent.start).format("ddd, D MMM, YYYY");
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
  // get staff name
  const getStaffName = () => {
    const staffNames = GetStaffWorkingDay.find(
      (s) => s.id === selectEvent.resourceId
    );
    setStaffName(staffNames);
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

  useEffect(() => {
    getStaffName();
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
            console.log("check service", service);
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

        <div className="status-section">
          <div className="status-label">Status</div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="status-dropdown"
          >
            <option value="did-not-come">Did not come</option>
            <option value="confirmed">Confirmed</option>
            <option value="come-late">Come late</option>
          </select>

          {status === "come-late" && (
            <input
              type="number"
              placeholder="Minutes late"
              value={minuteLate}
              onChange={(e) => setMinuteLate(e.target.value)}
              className="late-minutes-input"
              min="1"
            />
          )}
        </div>

        <ul className="action-list">
          <li>Send text message</li>
          <li>Check out</li>
          <li onClick={() => openBook()}>Book next</li>
          <li onClick={() => deleteBookingApoint(selectEvent.bookedId)}>
            Cancel
          </li>
        </ul>

        <div className="technical-info">
          <strong>Upcomming appointment - {status}</strong>
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
          <strong>Previous appointment</strong>
          <p>{fullDate} - Not started</p>
          <p>with {staffName?.fullName || "Unknown"}</p>
        </div>

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
      </div>
    </div>
  );
};

export default AppointmentDetail;
