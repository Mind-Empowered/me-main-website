import React, { useState, useEffect } from "react";

const EventCalendar = () => {
  const [calendarData, setCalendarData] = useState([]); 
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [posterUrl, setPosterUrl] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetch("/calender.json")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.month - a.month;
        });
        setCalendarData(sortedData);

        const years = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
        setAvailableYears(years);

        if (sortedData.length > 0) {
          const latestEntry = sortedData[0];
          setSelectedYear(latestEntry.year);
          setSelectedMonth(latestEntry.month);
          setPosterUrl(latestEntry.poster);
          setHasSearched(true);
        }
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
    <div className="max-w-[120rem] mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-[#461711] mb-10 leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
            Event Calendar
          </span>
        </h2>
        <p className="text-5xl sm:text-6xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
          Discover our upcoming events and activities
        </p>
        <div className="w-36 h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-10"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
        <div className="max-w-max mx-auto">
          <div className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-16">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-16 py-10 border-6 border-[#461711] rounded-2xl text-6xl font-medium text-[#461711] bg-white focus:ring-4 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all duration-200"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-16 py-10 border-6 border-[#461711] rounded-2xl text-6xl font-medium text-[#461711] bg-white focus:ring-4 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all duration-200"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button 
              onClick={handleView} 
              className="px-16 py-10 bg-[#461711] text-white rounded-2xl hover:bg-[#ff7612] transition-all duration-300 text-6xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5"
            >
              View Events
            </button>
          </div>
        </div>

        {posterUrl ? (
          <div className="flex justify-center mt-12">
            <img
              key={posterUrl}
              src={posterUrl}
              alt={`Event poster for ${new Date(0, parseInt(selectedMonth)).toLocaleString("en-US", { month: "long" })} ${selectedYear}`}
              className="w-full h-auto object-contain rounded-xl shadow-2xl animate-fade-in-up-smooth"
            />
          </div>
        ) : (
          hasSearched && (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xl font-semibold text-gray-600">
                No events found for the selected date.
              </p>
              <p className="text-gray-500 mt-1">
                Please try a different month or year.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
