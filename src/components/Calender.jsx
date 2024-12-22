import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/list/main.css";

const Calendar = () => {
  const [events, setEvents] = useState([]); // State to hold all events
  const [selectedEvent, setSelectedEvent] = useState(null); // State to hold selected event for the day view
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
  const [yearRange, setYearRange] = useState([]); // Range of available years

  useEffect(() => {
    // Fetch events data from JSON file
    fetch("./events.json")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    // Generate a range of years (e.g., from 2020 to current year)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      years.push(year);
    }
    setYearRange(years);
  }, []);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  };

  const handleGoToDate = () => {
    const date = new Date(selectedYear, selectedMonth, 1);
    calendarRef.current.getApi().gotoDate(date);
  };

  const handleDayClick = (date) => {
    const selectedDate = date.format();
    const eventForDay = events.filter((event) => event.date === selectedDate);

    if (eventForDay.length > 0) {
      setSelectedEvent(eventForDay[0]);
    } else {
      setSelectedEvent(null);
    }
  };

  const calendarRef = React.createRef(); // Reference to the FullCalendar instance

  return (
    <div>
      {/* Month and Year Selectors */}
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

      {/* FullCalendar Section */}
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
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
          eventContent={(eventInfo) => {
            return (
              <div style={{ fontSize: "10px", color: "black", textAlign: "center" }}>
                {eventInfo.event.title}
              </div>
            );
          }}
          dayCellContent={(dateInfo) => {
            const eventForDay = events.find(
              (event) => event.date === dateInfo.dateStr
            );

            if (eventForDay) {
              return (
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ fontSize: "10px", color: "#007bff" }}>
                    {eventForDay.title}
                  </div>
                  <img
                    src={eventForDay.poster}
                    alt={`Poster for ${eventForDay.title}`}
                    style={{
                      maxWidth: "60%",
                      maxHeight: "60px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      marginTop: "5px",
                    }}
                  />
                </div>
              );
            } else {
              return null; // No event for this day
            }
          }}
          dateClick={handleDayClick}
        />
      </div>

      {/* Day View with Event Poster */}
      {selectedEvent && (
        <div style={{ maxWidth: "600px", margin: "20px auto", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>{selectedEvent.title}</h3>
          <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
          <img
            src={selectedEvent.poster}
            alt={`Poster for ${selectedEvent.title}`}
            style={{
              maxWidth: "100%",
              maxHeight: "250px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          />
        </div>
      )}

    </div>
  );
};

export default Calendar;
