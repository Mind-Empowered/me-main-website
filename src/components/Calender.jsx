import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import '../App.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearRange, setYearRange] = useState([]);
  const calendarRef = React.createRef();

  useEffect(() => {
    fetch("./events.json")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      years.push(year);
    }
    setYearRange(years);
  }, []);

  const handleMonthChange = (event) => setSelectedMonth(event.target.value);
  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleGoToDate = () => {
    const date = new Date(selectedYear, selectedMonth, 1);
    calendarRef.current.getApi().gotoDate(date);
    setSelectedEvent(null); // Reset selected event when changing month
  };

  const handleDayClick = (info) => {
    const eventForDay = events.find((event) => event.date === info.dateStr);
    setSelectedEvent(eventForDay || null);
  };

  const handlePosterClick = (event) => {
    setSelectedEvent(event);
  };

  // Filter and get all posters for the selected month
  const getMonthPosters = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === parseInt(selectedYear) &&
        eventDate.getMonth() === parseInt(selectedMonth)
      );
    });
  };

  const monthPosters = getMonthPosters();

  return (
    <div style={{ display: "flex", gap: "20px", margin: "20px" }}>
      {/* Left Side: Calendar */}
      <div style={{ flex: "1" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <select onChange={handleMonthChange} value={selectedMonth}>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                {new Date(selectedYear, index).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select onChange={handleYearChange} value={selectedYear}>
            {yearRange.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button onClick={handleGoToDate} style={{ marginLeft: "10px" }}>
            View
          </button>
        </div>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          dateClick={handleDayClick}
        />
      </div>

      {/* Right Side: Posters and Event Details */}
      <div style={{ flex: "1", border: "1px solid #ddd", borderRadius: "8px", padding: "20px" }}>
        {monthPosters.length > 0 ? (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              {monthPosters.map((event, index) => (
                <img
                  key={index}
                  src={event.poster}
                  alt={`Poster for ${event.title}`}
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer", // Make posters clickable
                  }}
                  onClick={() => handlePosterClick(event)} // Handle poster click
                />
              ))}
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>
            Click on a date or month to view event details.
          </p>
        )}

        {selectedEvent && (
          <div style={{ marginTop: "20px" }}>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              {selectedEvent.title}
            </h3>
            <p style={{ fontSize: "16px", color: "#555", textAlign: "center" }}>
              <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString("en-CA")}
            </p>
            <div style={{ textAlign: "center" }}>
              <img
                src={selectedEvent.poster}
                alt={`Poster for ${selectedEvent.title}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  margin: "0 auto",
                  display: "block",
                  borderRadius: "5px",
                }}
                // onError={(e) => (e.target.src = "/fallback-poster.jpg")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
