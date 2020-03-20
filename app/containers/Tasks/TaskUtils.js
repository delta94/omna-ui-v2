export const markDayOfWeek = days => {
  const daysOfWeek = {
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false
  };

  days.forEach(day => {
    daysOfWeek[day] = true;
  });

  return daysOfWeek;
};

export const markWeekOfMonth = weeks => {
  const weeksOfMonth = {
    First: false,
    Second: false,
    Third: false,
    Fourth: false,
    Last: false
  };

  weeks.forEach(week => {
    weeksOfMonth[week] = true;
  });

  return weeksOfMonth;
};

export const markMonthOfYear = months => {
  const monthsOfYear = {
    Jan: false,
    Feb: false,
    Mar: false,
    Apr: false,
    May: false,
    Jun: false,
    Jul: false,
    Aug: false,
    Sep: false,
    Oct: false,
    Nov: false,
    Dic: false
  };

  months.forEach(month => {
    monthsOfYear[month] = true;
  });

  return monthsOfYear;
};
