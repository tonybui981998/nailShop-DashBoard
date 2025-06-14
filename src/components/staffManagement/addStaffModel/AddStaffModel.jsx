import React, { useEffect, useState } from "react";
import "./AddStaffModel.scss";
import { toast } from "react-toastify";
import { AddNewStaff } from "../../service/ApiService";
import { useDispatch } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const AddStaffModel = ({
  closeAddModel,
  handleDisplayStaffWorking,
  reLoadAdmin,
}) => {
  const dispatch = useDispatch();
  let [loading, setLoading] = useState(false);
  const [staffFormData, setstaffFormData] = useState({
    fullName: "",
    phoneNumber: "",
    isActive: "available",
  });
  const [staffWorkingday, setstaffWorkingday] = useState();
  const [schedule, setSchedule] = useState([
    { dayOfWeek: "Monday", startTime: "", endTime: "" },
    { dayOfWeek: "Tuesday", startTime: "", endTime: "" },
    { dayOfWeek: "Wednesday", startTime: "", endTime: "" },
    { dayOfWeek: "Thursday", startTime: "", endTime: "" },
    { dayOfWeek: "Friday", startTime: "", endTime: "" },
    { dayOfWeek: "Saturday", startTime: "", endTime: "" },
    { dayOfWeek: "Sunday", startTime: "", endTime: "" },
  ]);
  const checkstaffWorkingday = () => {
    const workday = schedule.filter((s) => s.startTime && s.endTime);
    if (workday) {
      setstaffWorkingday(workday);
    }
  };
  useEffect(() => {
    checkstaffWorkingday();
  }, [schedule]);
  // validation
  const validation = () => {
    if (!staffFormData.fullName || !staffFormData.phoneNumber) {
      toast.warn("please fill all the information");
      return false;
    }
    if (schedule.length < 0) {
      toast.warn("please fill the staff hour");
      return false;
    }
    return true;
  };
  // add staff button
  const addStaffButton = async () => {
    setLoading(true);
    const check = validation();
    const data = {
      fullName: staffFormData.fullName,
      phoneNumber: staffFormData.phoneNumber,
      isActive: staffFormData.isActive,
      staffScheduleDtos: staffWorkingday.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime + ":00",
        endTime: s.endTime + ":00",
      })),
    };
    if (check) {
      try {
        const respond = await AddNewStaff(data);
        if (respond.data.status === "success") {
          setLoading(false);
          toast.success("Add staff success");
          reLoadAdmin();
          setTimeout(() => {
            closeAddModel();
          }, 1500);
        } else {
          setLoading(false);
          toast.warn("Something wrong , try again later");
        }
      } catch (e) {
        console.log(e);
      }
    }
    console.log("check data", data);
  };
  return (
    <div className="add-staff-form">
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
      <div className="model">
        <button className="close-btn" onClick={closeAddModel}>
          ×
        </button>
        <h2 className="form-title">Add New Staff</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={staffFormData.fullName}
            onChange={(e) =>
              setstaffFormData({ ...staffFormData, fullName: e.target.value })
            }
            placeholder="Enter full name"
            name="fullName"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            value={staffFormData.phoneNumber}
            onChange={(e) =>
              setstaffFormData({
                ...staffFormData,
                phoneNumber: e.target.value,
              })
            }
            type="text"
            placeholder="Enter phone number"
            name="phoneNumber"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" defaultValue="available">
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
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr key={item.dayOfWeek}>
                  <td>{item.dayOfWeek}</td>
                  <td>
                    <input
                      value={item.startTime}
                      onChange={(e) => {
                        const update = [...schedule];
                        update[index].startTime = e.target.value;
                        setSchedule(update);
                      }}
                      type="time"
                    />
                  </td>
                  <td>
                    <input
                      value={item.endTime}
                      onChange={(e) => {
                        const update = [...schedule];
                        update[index].endTime = e.target.value;
                        setSchedule(update);
                      }}
                      type="time"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-actions">
          <button className="save-btn" onClick={() => addStaffButton()}>
            Save
          </button>
          <button className="cancel-btn" onClick={closeAddModel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModel;
