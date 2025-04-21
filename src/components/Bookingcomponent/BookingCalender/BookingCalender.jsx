import React, { useMemo, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import PropTypes from "prop-types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./BookingCalender.scss";

const localizer = momentLocalizer(moment);

const formatDateTime = (dateString, timeString) => {
  const [hour, minute, second] = timeString.split(":").map(Number);
  const date = new Date(dateString);
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(second || 0);
  date.setMilliseconds(0);
  return date;
};

const BookingCalendar = ({ GetStaffWorkingDay, GetAdminColorCheck }) => {
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [currentView, setCurrentView] = useState(Views.DAY);

  const resources = GetStaffWorkingDay.map((staff) => ({
    resourceId: staff.id,
    resourceTitle: staff.fullName,
  }));

  const events = GetStaffWorkingDay.flatMap((staff) =>
    (staff.bookingDtos || [])
      .filter((booking) => booking.staffId === staff.id)
      .filter(
        (booking, index, self) =>
          index ===
          self.findIndex(
            (b) =>
              b.staffId === booking.staffId &&
              b.bookingDate === booking.bookingDate &&
              b.startTime === booking.startTime &&
              b.endTime === booking.endTime
          )
      )
      .flatMap((booking) => {
        const baseStart = formatDateTime(
          booking.bookingDate,
          booking.startTime
        );
        let currentStart = new Date(baseStart);

        return booking.bookingServices.map((service, index) => {
          const durationInMinutes = parseInt(service.duration);
          const currentEnd = new Date(
            currentStart.getTime() + durationInMinutes * 60000
          );

          const event = {
            id: `${booking.id}-${index}`,
            title: booking.customerName,
            service: service.selectedService,
            start: new Date(currentStart),
            end: new Date(currentEnd),
            resourceId: booking.staffId,
            totalServices: booking.bookingServices.length,
          };

          currentStart = new Date(currentEnd);
          return event;
        });
      })
  );

  const defaultDate = useMemo(() => {
    const today = new Date();
    return events.length > 0 ? events[0].start : today;
  }, [events]);

  const filteredResources = selectedStaffId
    ? resources.filter((r) => r.resourceId === selectedStaffId)
    : resources;

  const filteredEvents = selectedStaffId
    ? events.filter((e) => e.resourceId === selectedStaffId)
    : events;

  const handleStaffClick = (id) => {
    setSelectedStaffId((prev) => (prev === id ? null : id));
    setCurrentView(Views.WEEK); // ✅ dùng WEEK để hiển thị cả weekend
  };

  return (
    <div className="booking-calendar-wrapper">
      {/* Staff Filter Buttons */}
      <div className="staff-buttons">
        {resources.map((staff) => (
          <button
            key={staff.resourceId}
            className={`staff-btn ${
              selectedStaffId === staff.resourceId ? "active" : ""
            }`}
            onClick={() => handleStaffClick(staff.resourceId)}
          >
            {staff.resourceTitle}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        defaultDate={defaultDate}
        view={currentView}
        onView={(view) => {
          setCurrentView(view);
          if (view === Views.DAY) {
            setSelectedStaffId(null);
          }
        }}
        events={filteredEvents}
        resources={filteredResources}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        onSelectResource={(resourceId) => {
          setSelectedStaffId(resourceId);
          setCurrentView(Views.WEEK); // ✅ chuyển sang WEEK view
        }}
        groupByResource
        step={10}
        timeslots={1}
        min={new Date(0, 0, 0, 9, 0, 0)}
        max={new Date(0, 0, 0, 18, 0, 0)}
        style={{ height: 700 }}
        views={[Views.DAY, Views.WEEK]} // ✅ dùng WEEK thay vì WORK_WEEK
        defaultView={Views.DAY}
        components={{
          event: ({ event }) => (
            <div title={`${event.title} - ${event.service}`}>
              <div className="event-time">
                {moment(event.start).format("hh:mm A")}
              </div>
              <div className="event-time">{event.title}</div>
              <div className="event-time">{event.service}</div>
            </div>
          ),
        }}
        eventPropGetter={(event) => {
          const matchColor = GetAdminColorCheck.find(
            (s) => s.name === event.service
          );
          const backgroundColor = matchColor ? matchColor.color : "#F0F8FF";

          return {
            style: {
              backgroundColor,
              color: "black",
              border: backgroundColor,
              padding: "8px",
            },
          };
        }}
      />
    </div>
  );
};

BookingCalendar.propTypes = {
  GetStaffWorkingDay: PropTypes.array.isRequired,
};

export default BookingCalendar;
