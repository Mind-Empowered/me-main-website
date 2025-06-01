import React, { useState, useEffect } from "react";

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [posterUrl, setPosterUrl] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Fetch the calendar data from the JSON file in the public folder
    fetch("/calender.json")
      .then((response) => response.json())
      .then((data) => {
        setCalendarData(data);
        // Find and set the default December 2024 poster
        const defaultData = data.find(
          (entry) => Number(entry.month) === 11 && entry.year === "2024"
        );
        setPosterUrl(defaultData ? defaultData.poster : "");
        setHasSearched(true);
      })
      .catch((error) => console.error("Error fetching calendar data:", error));
  }, []);

  const handleView = () => {
    setHasSearched(true);
    const selectedData = calendarData.find(
      (entry) => 
        Number(entry.month) === Number(selectedMonth) && 
        entry.year === selectedYear
    );
    setPosterUrl(selectedData ? selectedData.poster : "");
  };

  return (
    <div className="text-center m-5">
      <div className="mb-5">
        {/* Month Dropdown */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("en-US", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Year Dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="ml-3 px-3 py-2 border rounded-md"
        >
          {[2021, 2022, 2023, 2024,2025].map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>

        {/* View Button */}
        <button 
          onClick={handleView} 
          className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          View
        </button>
      </div>

      {/* Display Poster */}
      {posterUrl ? (
        <div>
          <img
            src={posterUrl}
            alt={`Poster for ${selectedMonth}/${selectedYear}`}
            className="max-w-full max-h-[400px] mx-auto"
          />
        </div>
      ) : (
        hasSearched && (
          <p className="text-red-500">No poster found for the selected date.</p>
        )
      )}
    </div>
  );
};

export default Calendar;
