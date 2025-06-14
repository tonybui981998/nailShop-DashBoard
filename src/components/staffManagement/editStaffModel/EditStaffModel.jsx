import React, { useEffect, useState } from "react";
import "./EditStaffModel.scss";
import { customstaffschedule, staffschedule } from "../StaffSchedule";
import { customSchedule, staffInfor } from "../../service/ApiService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { HubConnectionBuilder } from "@microsoft/signalr";

const EditStaffModel = ({
  staffSelected,
  closeEditStaffModel,
  handleDisplayStaffWorking,
  reLoadAdmin,
}) => {
  const dispatch = useDispatch();
  const [active, setactive] = useState("weekly");
  const [staffWorkingday, setStaffworkingDay] = useState();
  const [staffCustomSchedule, setCustomSchedule] = useState();
  const [schedule, setSchedule] = useState(staffschedule);
  const [customschedule, setcustomschedule] = useState(customstaffschedule);
  const [formData, setFromData] = useState({
    fullName: staffSelected.fullName,
    phoneNumber: staffSelected.phoneNumber,
    isActive: staffSelected.isActive,
  });

  const transferdata = () => {
    const convertTime = (time) => {
      const [hour, min] = time?.split(":");
      return `${hour}:${min}`;
    };
    const data = schedule.map((s) => {
      const matchData = staffSelected.staffScheduleDtos.find(
        (d) => d.dayOfWeek === s.dayOfWeek
      );
      return {
        dayOfWeek: s.dayOfWeek,
        startTime: matchData ? convertTime(matchData.startTime) : "",
        endTime: matchData ? convertTime(matchData.endTime) : "",
      };
    });
    setSchedule(data);
  };
  // staff work day
  const staffWorkDay = () => {
    const work = schedule.filter((s) => s.startTime && s.endTime);
    setStaffworkingDay(work);
  };
  const staffcustom = () => {
    const work = customschedule?.filter((s) => s.startTime && s.endTime);
    setCustomSchedule(work);
  };
  useEffect(() => {
    staffcustom();
  }, [customschedule]);
  useEffect(() => {
    staffWorkDay();
  }, [schedule]);
  useEffect(() => {
    transferdata();
  }, [staffSelected]);
  const submitChange = async () => {
    const data = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      isActive: formData.isActive,
      staffId: staffSelected.id,
      editStaffScheduleDtos: staffWorkingday.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime + ":00",
        endTime: s.endTime + ":00",
      })),
    };
    const data2 = staffCustomSchedule.map((s) => ({
      date: s.date,
      startTime: s.startTime + ":00",
      endTime: s.endTime + ":00",
      isDayOff: s.isDayOff === "true",
      staffId: staffSelected.id,
    }));

    try {
      if (data && data.editStaffScheduleDtos.length > 0 && data2.length > 0) {
        const res1 = await staffInfor(data);
        const res2 = await customSchedule(data2);
        const isRes1Success = res1.data.status === "success";
        const isRes2Success = res2.data.status === "success";
        if (isRes1Success && isRes2Success) {
          toast.success("Update successful");
        } else if (isRes1Success && !isRes2Success) {
          toast.warn("Update failed: check the custom schedule");
        } else if (!isRes1Success && isRes2Success) {
          toast.warn("Update failed: check the weekly schedule");
        } else {
          toast.error("Update failed: both updates failed");
        }
        reLoadAdmin();
        dispatch(handleDisplayStaffWorking(new Date()));
        closeEditStaffModel();
      } else {
        const respond = await staffInfor(data);
        if (respond.data.status === "success") {
          toast.success("Update success");
          reLoadAdmin();
          dispatch(handleDisplayStaffWorking(new Date()));
          closeEditStaffModel();
        } else {
          toast.error("Update Failed");
          reLoadAdmin();
          dispatch(handleDisplayStaffWorking(new Date()));
          closeEditStaffModel();
        }
      }
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5215/bookingHub")
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        console.log("🚀 SignalR Connected from Booking app");
        await connection.invoke("NewStaffInfo", data);
      } catch (err) {
        console.error("❌ SignalR connection failed:", err);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="add-staff-form">
      <div className="model">
        <button className="close-btn" onClick={closeEditStaffModel}>
          ×
        </button>
        <h2 className="form-title">Edit Staff</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            value={formData.fullName}
            type="text"
            placeholder="Enter full name"
            name="fullName"
            onChange={(e) =>
              setFromData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={formData.phoneNumber}
            placeholder="Enter phone number"
            name="phoneNumber"
            onChange={(e) =>
              setFromData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.isActive}
            onChange={(e) =>
              setFromData({ ...formData, isActive: e.target.value })
            }
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="onleave">On Leave</option>
          </select>
        </div>

        <div className="schedule-section">
          <h3
            onClick={() => setactive("weekly")}
            className={`${active === "weekly" ? "active" : ""}`}
          >
            Weekly Schedule
          </h3>
          <h3
            className={`${active === "custom" ? "active" : ""}`}
            onClick={() => setactive("custom")}
          >
            Custom Schedule
          </h3>
          <table className="schedule-table">
            <thead>
              <tr>
                {active === "weekly" ? <th>Day</th> : ""}

                {active === "custom" ? <th>Date</th> : ""}
                <th>Start Time</th>
                <th>End Time</th>
                {active === "weekly" ? "" : <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {active === "weekly"
                ? schedule?.map((item, index) => (
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
                  ))
                : customschedule?.map((item, index) => (
                    <tr key={item.dayOfWeek}>
                      <td>
                        <input
                          value={item.date}
                          onChange={(e) => {
                            const update = [...customschedule];
                            update[index].date = e.target.value;
                            setcustomschedule(update);
                          }}
                          type="date"
                        />
                      </td>
                      <td>
                        <input
                          value={item.startTime}
                          onChange={(e) => {
                            const update = [...customschedule];
                            update[index].startTime = e.target.value;
                            setcustomschedule(update);
                          }}
                          type="time"
                        />
                      </td>
                      <td>
                        <input
                          value={item.endTime}
                          onChange={(e) => {
                            const update = [...customschedule];
                            update[index].endTime = e.target.value;
                            setcustomschedule(update);
                          }}
                          type="time"
                        />
                      </td>
                      <td>
                        <select
                          value={item.isDayOff}
                          onChange={(e) => {
                            const update = [...customschedule];
                            update[index].isDayOff = e.target.value;
                            setcustomschedule(update);
                          }}
                        >
                          <option value="false">Working</option>
                          <option value="true">Day Off</option>
                        </select>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="form-actions">
          <button className="save-btn" onClick={() => submitChange()}>
            Save
          </button>
          <button className="cancel-btn" onClick={closeEditStaffModel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffModel;
