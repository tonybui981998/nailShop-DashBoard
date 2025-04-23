import React, { useState } from "react";
import "./CreateNewBooking.scss";

const CreateNewBooking = ({ closeBook, selectEvent }) => {
  const [requested, setRequested] = useState(false);
  const [previousService, setPreviousService] = useState(
    selectEvent.bookingService
  );

  const handleReemoveService = (service) => {
    const result = previousService.filter((s) => s.selectedService !== service);
    setPreviousService(result);
  };
  return (
    <div className="modal-overlay" onClick={closeBook}>
      <div
        className="create-booking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <button onClick={closeBook}>Cancel</button>
          <span>Create appointment</span>
          <button className="save-btn">Save</button>
        </div>

        <div className="form-group">
          <label>Day *</label>
          <input type="date" />
        </div>

        <div className="form-group">
          <label>Customer *</label>
          <input type="text" disabled placeholder="Customer required" />
        </div>

        <div>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Services *
          </label>
          {previousService.map((srv, index) => {
            console.log("check srv", srv);
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={srv.selectedService}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5",
                  }}
                />
                <button
                  type="button"
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReemoveService(srv.selectedService)}
                >
                  &minus;
                </button>
              </div>
            );
          })}

          <button
            type="button"
            style={{
              marginTop: "10px",
              backgroundColor: "#1890ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
            onClick={() => {}} // 🔜 để sau xử lý thêm
          >
            + Add another service
          </button>
        </div>

        <div className="form-group with-staff">
          <label>With staff *</label>
          <input type="text" />
          <label className="requested-label">
            Requested
            <input
              type="checkbox"
              checked={requested}
              onChange={() => setRequested(!requested)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="info-row">
          <div className="info-cell">
            <label>Status</label>
            <div>Confirmed, Not started</div>
          </div>
          <div className="info-cell">
            <label>Recurrence</label>
            <div>None</div>
          </div>
          <div className="info-cell">
            <label>Appointment address</label>
            <div>No address</div>
          </div>
        </div>

        <div className="form-group">
          <label>Booking note</label>
          <textarea placeholder="Enter booking notes..."></textarea>
        </div>
      </div>
    </div>
  );
};

export default CreateNewBooking;
