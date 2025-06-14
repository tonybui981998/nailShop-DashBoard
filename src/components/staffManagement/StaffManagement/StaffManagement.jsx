import React, { useState } from "react";
import "./StaffManagement.scss";
import StaffScheduleModel from "../staffscheduleModel/StaffScheduleModel";
import AddStaffModel from "../addStaffModel/AddStaffModel";
import EditStaffModel from "../editStaffModel/EditStaffModel";

const StaffManagement = ({
  AdminStaff,
  reLoadAdmin,
  handleDisplayStaffWorking,
}) => {
  console.log("check staff", AdminStaff);
  const [staffSelected, setstaffSelected] = useState();
  const [staffschedule, setstaffschedule] = useState(false);
  const [addstaff, setaddStaff] = useState(false);
  const [editStaffmodel, seteditStaffModel] = useState(false);
  // open staff schedule
  const openStaffSchedule = (data) => {
    setstaffschedule(true);
    setstaffSelected(data);
  };
  // close staff schedule
  const closeStaffSchedule = () => {
    setstaffschedule(false);
  };
  // open add staff model
  const openAddModel = () => {
    setaddStaff(true);
  };
  // close add staff model
  const closeAddModel = () => {
    setaddStaff(false);
  };
  // open edit staff model
  const openEditStaffModel = (staff) => {
    setstaffSelected(staff);
    seteditStaffModel(true);
  };
  // close edit model
  const closeEditStaffModel = () => {
    seteditStaffModel(false);
  };
  return (
    <div className="staff-management">
      <div className="header">
        <h2>Staff Management</h2>
        <button className="add-btn" onClick={() => openAddModel()}>
          + Add Staff
        </button>
      </div>

      <table className="staff-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {AdminStaff?.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.id}</td>
              <td>{staff.fullName}</td>
              <td>{staff.phoneNumber || "—"}</td>
              <td>
                <span
                  className={`status-badge ${
                    staff.isActive === "available" ? "available" : "inactive"
                  }`}
                >
                  {staff.isActive}
                </span>
              </td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => openStaffSchedule(staff)}
                >
                  View
                </button>
              </td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => openEditStaffModel(staff)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {staffschedule && (
        <StaffScheduleModel
          staffSelected={staffSelected}
          closeStaffSchedule={closeStaffSchedule}
        />
      )}
      {addstaff && (
        <AddStaffModel
          reLoadAdmin={reLoadAdmin}
          handleDisplayStaffWorking={handleDisplayStaffWorking}
          closeAddModel={closeAddModel}
        />
      )}
      {editStaffmodel && (
        <EditStaffModel
          staffSelected={staffSelected}
          closeEditStaffModel={closeEditStaffModel}
          handleDisplayStaffWorking={handleDisplayStaffWorking}
          reLoadAdmin={reLoadAdmin}
        />
      )}
    </div>
  );
};

export default StaffManagement;
