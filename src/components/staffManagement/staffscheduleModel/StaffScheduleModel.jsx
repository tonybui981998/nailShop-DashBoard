import React, { useEffect, useState } from "react";
import "./StaffScheduleModel.scss";

const StaffScheduleModel = ({ staffSelected, closeStaffSchedule }) => {
  const [schedule, setschedule] = useState([]);
  const [custonschedule, setcustomschedule] = useState([]);
  // check staff custom schedule
  const customcheking = () => {
    const today = new Date().toISOString().split("T")[0];
    const getcustomschedule = staffSelected.customerScheduleDtos.filter(
      (s) => s.date.slice(0, 10) > today /*s&& .isDayOff === false*/
    );
    if (getcustomschedule.length > 0) {
      setcustomschedule(getcustomschedule);
    }
  };
  // convert time
  const convertTime = (time) => {
    const [hour, min] = time.split(":");
    const check = hour < 12 ? "AM" : "PM";
    return `${parseInt(hour, 10)}:${min} ${check}`;
  };
  useEffect(() => {
    customcheking();
    setschedule(staffSelected.staffScheduleDtos);
  }, [staffSelected]);
  return (
    <div className="staff-schedule-overlay">
      <div className="staff-schedule-modal">
        <button className="close-btn" onClick={closeStaffSchedule}>
          ×
        </button>
        <h2 className="modal-title">
          Staff Schedule - {staffSelected.fullName}
        </h2>

        <div className="section">
          <h3 className="section-title">Custom Schedule</h3>
          {custonschedule.length > 0 ? (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {custonschedule.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date.slice(0, 10)}</td>
                    <td>{convertTime(item.startTime)}</td>

                    <td>{convertTime(item.endTime)}</td>
                    <td>{item.isDayOff ? "Day Off" : "Working"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-note">No upcoming custom schedule.</p>
          )}
        </div>

        <div className="section">
          <h3 className="section-title">Weekly Working Schedule</h3>
          {schedule.length > 0 ? (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.dayOfWeek}</td>
                    <td>{convertTime(item.startTime)}</td>
                    <td>{convertTime(item.endTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-note">No default working schedule set.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffScheduleModel;
