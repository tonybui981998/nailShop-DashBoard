import React, { useState } from "react";
import "./StaffManagement.scss";
import { FaUser } from "react-icons/fa";
import WorkingHoursModel from "../workingHoursModel/WorkingHoursModel";

const StaffManagement = ({ AdminStaff }) => {
  const [active, setactive] = useState(null);
  const [workHoursDetails, setworkHoursDetails] = useState();
  // open hour details model
  const displayStaffHours = (id) => {
    setactive((prevId) => (prevId === id ? null : id));
  };
  return (
    <div className="staff-management">
      <h2>Staff Management</h2>
      <table className="staff-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Full Name</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Working Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {AdminStaff.map((staff, index) => {
            return (
              <>
                <tr key={index}>
                  <td>
                    <FaUser className="avatar-icon" />
                  </td>
                  <td>{staff.fullName}</td>
                  <td>{staff.isActive}</td>
                  <td>{staff.phoneNumber || "null"}</td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() => displayStaffHours(staff.id)}
                    >
                      See details
                    </button>
                  </td>
                  <td>
                    <button className="action-btn">View</button>
                    <button className="action-btn edit">Edit</button>
                  </td>
                </tr>{" "}
                {active === staff.id && (
                  <tr className="working-hours-row">
                    <td colSpan={6}>
                      <div className="working-hours-wrapper">
                        <WorkingHoursModel staff={staff} />
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
