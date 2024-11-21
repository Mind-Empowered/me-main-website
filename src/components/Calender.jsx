import React, { useState } from 'react';

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate(); // returns the last day of the selected month
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month - 1, 1).getDay(); // returns the first day of the month (0: Sunday, 6: Saturday)
};

function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);

  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  const years = Array.from(new Array(50), (v, i) => new Date().getFullYear() - 25 + i); // Generate a range of 50 years

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    updateCalendar(month, selectedYear);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    updateCalendar(selectedMonth, year);
  };

  const updateCalendar = (month, year) => {
    if (month && year) {
      const daysInMonth = getDaysInMonth(month, year);
      const firstDayOfMonth = getFirstDayOfMonth(month, year);

      // Create array of days with empty slots for days before the 1st of the month
      const daysArray = Array.from({ length: firstDayOfMonth }).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
      );

      setDays(daysArray);
    }
  };

  const renderCalendar = () => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <table className='mt-4'>
        <thead>
          <tr className=''>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <th className='p-2' key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={index}>
              {week.map((day, i) => (
                <td className='p-2 text-center' key={i}>{day ? day : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table >
    );
  };

  return (
    <div className='px-28 mt-10'>
      <h1 className='font-bold'>Month and Year Selection with Calendar</h1>

      <div className='flex gap-8 my-3'>
        <div>
          <label className='font-semibold'>Select Month: </label>
          <select onChange={handleMonthChange} value={selectedMonth}>
            <option value="">--Select Month--</option>
            {months.map((month) => (
              <option key={month.value} value={month.value} defaultValue={month.name[0]}>
                {month.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='font-semibold'>Select Year: </label>
          <select onChange={handleYearChange} value={selectedYear}>
            <option value="">--Select Year--</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {days.length > 0 && (
        <div className=''>
          <h3>Calendar for {months[selectedMonth - 1]?.name}, {selectedYear}</h3>
          {renderCalendar()}
        </div>
      )}
    </div>
  );
}

export default Calendar;
