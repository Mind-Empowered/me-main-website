import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

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
    <div className="flex gap-5 m-5">
      {/* Left Side: Calendar */}
      <div className="flex-1">
        <div className="mb-5 text-center">
          <select 
            onChange={handleMonthChange} 
            value={selectedMonth}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-150 ease-in-out mr-2"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                {new Date(selectedYear, index).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select 
            onChange={handleYearChange} 
            value={selectedYear}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-150 ease-in-out"
          >
            {yearRange.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button 
            onClick={handleGoToDate} 
            className="ml-2.5 px-4 py-1.5 bg-yellow-300 border-none rounded text-[#461711] font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-yellow-400">
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
      <div className="flex-1 border border-gray-300 rounded p-5">
        {monthPosters.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-5">
            {monthPosters.map((event, index) => (
              <img
                key={index}
                src={event.poster}
                alt={`Poster for ${event.title}`}
                className="max-w-[150px] max-h-[150px] object-cover rounded shadow cursor-pointer"
                onClick={() => handlePosterClick(event)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Click on a date or month to view event details.
          </p>
        )}

        {selectedEvent && (
          <div className="mt-5">
            <h3 className="text-2xl font-bold text-center text-blue-500 mb-2">
              {selectedEvent.title}
            </h3>
            <p className="text-lg text-center text-gray-700">
              <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString("en-CA")}
            </p>
            <div className="text-center">
              <img
                src={selectedEvent.poster}
                alt={`Poster for ${selectedEvent.title}`}
                className="max-w-full max-h-[300px] object-contain mx-auto rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
