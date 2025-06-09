import React from "react";
import "./AddStaffModel.scss";

const AddStaffModel = ({ closeAddModel }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <div className="add-staff-form">
      <div className="model">
        <button className="close-btn" onClick={closeAddModel}>
          ×
        </button>
        <h2 className="form-title">Add New Staff</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Enter full name" />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" placeholder="Enter phone number" />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select defaultValue="available">
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="onleave">On Leave</option>
          </select>
        </div>

        <div className="schedule-section">
          <h3>Weekly Schedule</h3>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Off</th>
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day, index) => (
                <tr key={index}>
                  <td>{day}</td>
                  <td>
                    <input type="time" />
                  </td>
                  <td>
                    <input type="time" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-actions">
          <button className="save-btn">Save</button>
          <button className="cancel-btn" onClick={closeAddModel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModel;
