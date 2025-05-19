import React, { useEffect, useState } from "react";
import "./CreateNewBooking.scss";
import { useDispatch, useSelector } from "react-redux";
import AllServiceModel from "../AllServiceModel/AllServiceModel";
import SelectStaffTime from "../SelectStaffTimeModel/SelectStaffTime";
import { fetStaffBooking } from "../../redux/CounterSlice";
import HashLoader from "react-spinners/HashLoader";
import { toast } from "react-toastify";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const CreateNewBooking = ({
  closeBook,
  selectEvent,
  reLoadAdmin,
  currentSelectedDate,
  handleDisplayStaffWorking,
  closeModel,
}) => {
  const { AdminStaff, GetAllServices } = useSelector((state) => state.counter);
  const [requested, setRequested] = useState(false);
  const [previousService, setPreviousService] = useState(
    selectEvent.bookingService
  );
  const [loading, setLoading] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [calculatedEndTime, setCalculatedEndTime] = useState("");
  const [customerName, setCustomerName] = useState(selectEvent.title);
  const [customerSelectDate, setCustomerSelectDate] = useState();
  const [GetStaffWorkingDay, setGetStaffWorkingDay] = useState();
  const [openModel, setOpenModel] = useState(false);
  const [totalPriceService, setTotalPriceService] = useState();
  const [selectStaffId, setSelectStaffId] = useState();
  const [openSelectTimeModel, setOpenSelectTimeModel] = useState(false);
  const [cusBookingNote, setcusbookingnote] = useState();
  const dispatch = useDispatch();
  // open select time model
  const openSelectTime = () => {
    setOpenSelectTimeModel(true);
  };
  // close select time model
  const closeSelectTime = () => {
    setOpenSelectTimeModel(false);
  };
  // openModel
  const openServiceModel = () => {
    setOpenModel(true);
  };
  // close model
  const closeServiceModel = () => {
    setOpenModel(false);
  };
  const handleReemoveService = (service) => {
    const result = previousService.filter((s) => s.selectedService !== service);
    setPreviousService(result);
  };

  const GetStaffWorkingbyDay = (customerSelectDate) => {
    const today = new Date(customerSelectDate);
    const dayName = today.toLocaleDateString("en-NZ", { weekday: "long" });
    const staffWorking = AdminStaff.filter((s) =>
      s.staffScheduleDtos?.some((d) => d.dayOfWeek === dayName)
    );
    setGetStaffWorkingDay(staffWorking);
  };
  const getTotalPrice = (previousService) => {
    const Totalprice = previousService.reduce(
      (total, priceeach) => total + priceeach.price,
      0
    );
    setTotalPriceService(Totalprice);
  };
  useEffect(() => {
    getTotalPrice(previousService);
  }, [previousService]);
  useEffect(() => {
    GetStaffWorkingbyDay(customerSelectDate);
  }, [customerSelectDate]);
  useEffect(() => {
    setSelectedStartTime(null);
    setCalculatedEndTime(null);
  }, [selectStaffId]);
  const submitAppointment = async () => {
    setLoading(true);
    const data = {
      customerName: customerName,
      customerPhone: selectEvent.customerPhone,
      email: selectEvent.email,
      BookingDate: customerSelectDate,
      StartTime: selectedStartTime + ":00",
      EndTime: calculatedEndTime + ":00",
      TotalPrice: totalPriceService,
      BookingNote: cusBookingNote,
      StaffId: parseInt(selectStaffId),
      bookingServices: previousService.map((s) => ({
        selectedService: s.selectedService,
        duration: s.duration,
        price: s.price,
        BookingId: s.bookingId,
      })),
    };
    setTimeout(async () => {
      setLoading(false);
      const result = await dispatch(fetStaffBooking(data));
      if (result.payload === "Create success") {
        await reLoadAdmin();
        dispatch(handleDisplayStaffWorking(currentSelectedDate));
      } else {
        toast.error("sorry something wrong");
      }
      closeBook();
      closeModel();
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={closeBook}>
      <div
        className="create-booking-modal"
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
          <button onClick={closeBook}>Cancel</button>
          <span>Create appointment</span>
          <button className="save-btn" onClick={() => submitAppointment()}>
            Save
          </button>
        </div>

        <div className="form-group">
          <label>Day *</label>
          <input
            type="date"
            value={customerSelectDate}
            onChange={(e) => setCustomerSelectDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Customer *</label>
          <input
            type="text"
            disabled
            placeholder="Customer required"
            value={customerName}
          />
        </div>

        <div className="services-list">
          <label className="form-label">Services *</label>
          {previousService.map((srv, index) => (
            <div className="service-item" key={index}>
              <input type="text" value={srv.selectedService} readOnly />
              <button
                type="button"
                onClick={() => handleReemoveService(srv.selectedService)}
              >
                &minus;
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-service-btn"
            onClick={() => {
              openServiceModel();
            }}
          >
            + Add another service
          </button>
        </div>

        {customerSelectDate && (
          <div className="form-group with-staff">
            <label>With staff *</label>
            <select
              value={selectStaffId}
              onChange={(e) => setSelectStaffId(e.target.value)}
            >
              <option>-- Select staff --</option>
              {GetStaffWorkingDay?.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.fullName}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedStartTime && calculatedEndTime && (
          <>
            <div className="display-time">Start Time : {selectedStartTime}</div>
            <div className="display-time">End Time : {calculatedEndTime}</div>
          </>
        )}
        {selectStaffId && (
          <button
            type="button"
            className="select-time-btn"
            onClick={() => openSelectTime()}
          >
            + Select time
          </button>
        )}

        <div className="form-group">
          <label>Booking note</label>
          <textarea
            value={cusBookingNote}
            onChange={(e) => setcusbookingnote(e.target.value)}
            placeholder="Enter booking notes..."
          ></textarea>
        </div>
      </div>
      {openModel && (
        <AllServiceModel
          closeServiceModel={closeServiceModel}
          GetAllServices={GetAllServices}
          setPreviousService={setPreviousService}
        />
      )}
      {openSelectTimeModel && (
        <SelectStaffTime
          closeSelectTime={closeSelectTime}
          AdminStaff={AdminStaff}
          selectStaffId={selectStaffId}
          customerSelectDate={customerSelectDate}
          previousService={previousService}
          selectedStartTime={selectedStartTime}
          setSelectedStartTime={setSelectedStartTime}
          calculatedEndTime={calculatedEndTime}
          setCalculatedEndTime={setCalculatedEndTime}
        />
      )}
    </div>
  );
};

export default CreateNewBooking;
