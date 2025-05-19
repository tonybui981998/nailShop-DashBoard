import React, { useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import PropTypes, { bool } from "prop-types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./BookingCalender.scss";
import AppointmentDetail from "../AppointmentDetails/AppointmentDetail";
import { useDispatch, useSelector } from "react-redux";
import { HubConnectionBuilder } from "@microsoft/signalr";

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

const BookingCalendar = ({
  GetAdminColorCheck,
  deletebooking,
  handleDisplayStaffWorking,
  reLoadAdmin,
}) => {
  const { GetStaffWorkingDay } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  // model
  const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());

  const [openModeldisplay, setOpenModeldisplay] = useState(false);
  const [selectEvent, setSelectEvent] = useState();
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [currentView, setCurrentView] = useState(Views.DAY);
  const [bookingService, setBookingService] = useState();
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5215/bookingHub")
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();

        connection.on("ReceiveBooking", async (bookingData) => {
          await reLoadAdmin();
          dispatch(handleDisplayStaffWorking(new Date()));
        });
      } catch (error) {
        console.error("❌ SignalR connection failed:", error);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, []);
  // open model
  const openModel = () => {
    setOpenModeldisplay(true);
  };
  // close model
  const closeModel = () => {
    setOpenModeldisplay(false);
  };

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
        console.log("check time", booking);
        let currentStart = new Date(baseStart);
        return booking.bookingServices.map((service, index) => {
          const durationInMinutes = parseInt(service.duration);
          const currentEnd = new Date(
            currentStart.getTime() + durationInMinutes * 60000
          );

          const event = {
            bookedId: booking.id,
            id: `${booking.id}-${index}`,
            title: booking.customerName,
            service: service.selectedService,
            start: new Date(currentStart),
            end: new Date(currentEnd),
            resourceId: booking.staffId,
            totalServices: booking.bookingServices.length,
            totalPrice: booking.totalPrice,
            price: service.price,
            bookingService: booking.bookingServices,
            customerPhone: booking.customerPhone,
            email: booking.email,
            DateTime: booking.bookingDate,
            bookingStart: booking.startTime,
            bookingEnd: booking.endTime,
          };

          currentStart = new Date(currentEnd);
          return event;
        });
      })
  );

  const defaultDate = useMemo(() => new Date(), []);

  const filteredResources = selectedStaffId
    ? resources.filter((r) => r.resourceId === selectedStaffId)
    : resources;

  const filteredEvents = selectedStaffId
    ? events.filter((e) => e.resourceId === selectedStaffId)
    : events;

  const handleStaffClick = (id) => {
    setSelectedStaffId((prev) => (prev === id ? null : id));
    setCurrentView(Views.WEEK);
  };

  return (
    <div className="booking-calendar-wrapper">
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
        onNavigate={(date) => {
          setCurrentSelectedDate(date);
          dispatch(handleDisplayStaffWorking(date));
        }}
        events={filteredEvents}
        resources={filteredResources}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        onSelectResource={(resourceId) => {
          setSelectedStaffId(resourceId);
          setCurrentView(Views.WEEK);
        }}
        groupByResource
        step={10}
        timeslots={1}
        min={new Date(0, 0, 0, 9, 0, 0)}
        max={new Date(0, 0, 0, 18, 0, 0)}
        style={{ height: 700 }}
        views={[Views.DAY, Views.WEEK]}
        defaultView={Views.DAY}
        components={{
          event: ({ event }) => (
            <div className="rbc-event-content-wrapper">
              <div
                className="overlay-click-area"
                onClick={(e) => {
                  e.stopPropagation();
                  openModel();
                  setSelectEvent(event);
                }}
                title={`${event.title} - ${event.service}`}
              />
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
      {openModeldisplay === true && (
        <div className="modal-overlay" onClick={closeModel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AppointmentDetail
              closeModel={closeModel}
              selectEvent={selectEvent}
              GetStaffWorkingDay={GetStaffWorkingDay}
              deletebooking={deletebooking}
              handleDisplayStaffWorking={handleDisplayStaffWorking}
              reLoadAdmin={reLoadAdmin}
              events={events}
              currentSelectedDate={currentSelectedDate}
              setSelectEvent={setSelectEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

BookingCalendar.propTypes = {
  GetStaffWorkingDay: PropTypes.array.isRequired,
};

export default BookingCalendar;
