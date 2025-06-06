import React, { useEffect, useState } from "react";
import "./WorkingHoursModel.scss";
import { padStart } from "@fullcalendar/core/internal";

const WorkingHoursModel = ({ staff }) => {
  const [customHours, setcustomHours] = useState([]);
  const [staffschedule, setstaffschedule] = useState();
  // conver date
  const convertDate = (date) => {
    const dateconvert = new Date(date).toLocaleDateString("en-NZ", {
      weekday: "long",
    });
    return dateconvert;
  };
  const convertdisplayDate = (date) => {
    const dates = new Date(date);
    const convert = dates.toISOString().split("T")[0];
    return convert;
  };
  // convert hours and time
  const convertTime = (time) => {
    const [hours, mins] = time.split(":");
    const hour = parseInt(hours, 10);
    const min = padStart(mins);
    const check = hour <= 12 ? "AM" : "PM";
    return `${hour}:${min} ${check}`;
  };
  useEffect(() => {
    setcustomHours(staff.customerScheduleDtos);
    setstaffschedule(staff.staffScheduleDtos);
  }, [staff]);

  return (
    <div className="hoursmodel">
      <div className="title">{staff.fullName} Schedule</div>
      <div className="main-title">Regular Timetable</div>
      <table>
        <thead>
          <tr>
            <th>Working day</th>
            <th>startTime</th>
            <th>endTime</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {staffschedule &&
            staffschedule.map((s, index) => {
              return (
                <tr key={index}>
                  <td>{s.dayOfWeek}</td>
                  <td>{convertTime(s.startTime)}</td>
                  <td>{convertTime(s.endTime)}</td>
                  <td>0</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {customHours.length > 0 && (
        <>
          <div className="custom-title">Custom Schedule</div>
          <table>
            <thead>
              <tr>
                <th>Working day</th>
                <th>Working date</th>
                <th>startTime</th>
                <th>endTime</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {customHours.map((s, index) => {
                return (
                  <tr key={index}>
                    <td>{convertDate(s.date)}</td>
                    <th>{convertdisplayDate(s.date)}</th>
                    <td>{convertTime(s.startTime)}</td>
                    <td>{convertTime(s.endTime)}</td>
                    <td>0</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default WorkingHoursModel;
