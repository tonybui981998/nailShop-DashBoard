import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./SelectStaffTime.scss";

const SelectStaffTime = ({
  closeSelectTime,
  AdminStaff,
  selectStaffId,
  customerSelectDate,
  previousService,
  selectedStartTime,
  setSelectedStartTime,
  calculatedEndTime,
  setCalculatedEndTime,
}) => {
  const [StaffTimeSlot, setStaffTimeSlot] = useState([]);
  // const [selectedStartTime, setSelectedStartTime] = useState("");
  //onst [calculatedEndTime, setCalculatedEndTime] = useState("");

  useEffect(() => {
    generateStaffTimeSlot();
  }, [AdminStaff, selectStaffId, customerSelectDate]);

  const generateStaffTimeSlot = () => {
    if (!selectStaffId || !customerSelectDate) {
      return;
    }

    const staffSelected = AdminStaff.find(
      (s) => s.id === parseInt(selectStaffId)
    );
    if (!staffSelected) {
      return;
    }

    const selectedDate = dayjs(customerSelectDate).format("YYYY-MM-DD");

    const checkStaffWorkingDay = staffSelected.staffScheduleDtos?.find(
      (s) => s.dayOfWeek === dayjs(customerSelectDate).format("dddd")
    );

    if (!checkStaffWorkingDay) {
      setStaffTimeSlot([]);

      return;
    }

    const startHour = parseInt(
      checkStaffWorkingDay.startTime.split(":")[0],
      10
    );
    const endHour = parseInt(checkStaffWorkingDay.endTime.split(":")[0], 10);

    let getCurrentTime = dayjs(customerSelectDate)
      .hour(startHour)
      .minute(0)
      .second(0);
    const timeSlot = [];

    while (getCurrentTime.hour() < endHour) {
      timeSlot.push(getCurrentTime.format("HH:mm"));
      getCurrentTime = getCurrentTime.add(15, "minute");
    }

    const bookedSlots =
      staffSelected.bookingDtos
        ?.filter(
          (booking) =>
            dayjs(booking.bookingDate).format("YYYY-MM-DD") === selectedDate &&
            booking.staffId === staffSelected.id
        )
        .map((booking) => ({
          startTime: booking.startTime.slice(0, 5),
          endTime: booking.endTime.slice(0, 5),
        })) || [];

    const availableSlots = timeSlot.filter((slot) => {
      return !bookedSlots.some(
        (booked) => slot >= booked.startTime && slot < booked.endTime
      );
    });

    setStaffTimeSlot(availableSlots);
  };

  const handleSelectTime = (time) => {
    setSelectedStartTime(time);

    // Tính tổng duration tất cả service
    let totalDuration = 0;
    if (previousService && previousService.length > 0) {
      totalDuration = previousService.reduce(
        (sum, service) => sum + parseInt(service.duration),
        0
      );
    }
    const [hour, minute] = time.split(":").map(Number);
    const startTotalMinutes = hour * 60 + minute;
    const endTotalMinutes = startTotalMinutes + totalDuration;

    const endHour = Math.floor(endTotalMinutes / 60);
    const endMinute = endTotalMinutes % 60;

    const formattedEndHour = endHour.toString().padStart(2, "0");
    const formattedEndMinute = endMinute.toString().padStart(2, "0");

    setCalculatedEndTime(`${formattedEndHour}:${formattedEndMinute}`);
  };

  return (
    <div className="modal-overlay" onClick={closeSelectTime}>
      <div className="select-time-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={closeSelectTime}>Cancel</button>
          <span>Select time</span>
          <button className="save-btn" onClick={() => closeSelectTime()}>
            Save
          </button>
        </div>

        <div className="form-group">
          <label>Available Time Slots</label>
          <div className="time-slot-list">
            {StaffTimeSlot.length > 0 ? (
              StaffTimeSlot.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  className={`time-slot-btn ${
                    selectedStartTime === time ? "selected" : ""
                  }`}
                  onClick={() => handleSelectTime(time)}
                >
                  {time}
                </button>
              ))
            ) : (
              <div className="no-slot-message">No available time slots.</div>
            )}
          </div>
        </div>

        {selectedStartTime && (
          <div className="selected-time-info">
            <p>
              <strong>Start Time:</strong> {selectedStartTime}
            </p>
            <p>
              <strong>End Time:</strong> {calculatedEndTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectStaffTime;
