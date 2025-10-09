import React, { useState, useEffect } from "react";
import { translations, getMonthName } from "../translations";

const EventCalendar = ({ language }) => {
  const [calendarData, setCalendarData] = useState([]); 
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [posterUrl, setPosterUrl] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/calender.json")
      .then((response) => {
        if (!response.ok) { 
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching calendar data:", error);
        setError(translations.calendar.error[language]);
        setIsLoading(false);
      });
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
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.calendar.title[language]}
          </span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {translations.calendar.subtitle[language]}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-3 lg:p-4 border border-gray-100">
        <div className="max-w-max mx-auto">
          <div className="mb-4 flex flex-wrap justify-center items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all duration-200"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {getMonthName(i, language)}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all duration-200"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button 
              onClick={handleView} 
              className="px-4 py-2 bg-[#461711] text-white rounded-lg hover:bg-[#ff7612] transition-all duration-300 text-sm font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {translations.calendar.viewButton[language]}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-8 w-8 text-[#ff7612] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-gray-600 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.calendar.loading[language]}</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        ) : posterUrl ? (
          <div className="flex justify-center mt-4">
            <img
              key={posterUrl}
              src={posterUrl}
              alt={`Event poster for ${getMonthName(parseInt(selectedMonth), language)} ${selectedYear}`}
              className="w-full h-auto object-contain rounded-xl shadow-2xl animate-fade-in-up-smooth"
            />
          </div>
        ) : (
          hasSearched && (
            <div className="text-center py-6">
              <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-base font-semibold text-gray-600" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.calendar.noEvents[language]}
              </p>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.calendar.tryAgain[language]}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
