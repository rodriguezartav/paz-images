import dayjs from "dayjs";

const weekday = require("dayjs/plugin/weekday");
const weekOfYear = require("dayjs/plugin/weekOfYear");

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

function getNumberOfDaysInMonth(year, month) {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}

function createDaysForCurrentMonth(year, month) {
  let isFirstThursday = false;
  let secondThursdayIndex = -1;
  let days = [...Array(getNumberOfDaysInMonth(year, month))].map(
    (day, index) => {
      let date = dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD");
      let weekdayInLoop = getWeekday(date);
      if (weekdayInLoop == 4 && !isFirstThursday) {
        isFirstThursday = true;
        secondThursdayIndex = index + 7;
      }

      return {
        date: date,
        activityDay:
          secondThursdayIndex > 0 &&
          index >= secondThursdayIndex &&
          index <= secondThursdayIndex + 5
            ? index - secondThursdayIndex + 1
            : null,
        isSelected:
          secondThursdayIndex > 0 &&
          index >= secondThursdayIndex &&
          index <= secondThursdayIndex + 5,
        dayOfMonth: index + 1,
        isCurrentMonth: true,
      };
    }
  );

  return days;
}

function createDaysForPreviousMonth(year, month, currentMonthDays) {
  const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);

  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

  let previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
    .subtract(firstDayOfTheMonthWeekday - 1, "day")
    .date();
  // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
  let visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday - 1;

  if (firstDayOfTheMonthWeekday === 0) {
    visibleNumberOfDaysFromPreviousMonth = 6;
    previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
      .subtract(6, "day")
      .date();
  }

  return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
    return {
      date: dayjs(
        `${previousMonth.year()}-${previousMonth.month()}-${
          previousMonthLastMondayDayOfMonth + index
        }`
      ).format("YYYY-MM-DD"),
      dayOfMonth: previousMonthLastMondayDayOfMonth + index,
      isCurrentMonth: false,
    };
  });
}
function createDaysForNextMonth(year, month, currentMonthDays) {
  const lastDayOfTheMonthWeekday = getWeekday(
    `${year}-${month}-${currentMonthDays.length}`
  );
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");
  const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
    ? 7 - lastDayOfTheMonthWeekday
    : lastDayOfTheMonthWeekday;
  return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
    return {
      date: dayjs(
        `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
      ).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: false,
    };
  });
}
function getWeekday(date) {
  return dayjs(date).weekday();
}

export default function getDays(INITIAL_YEAR, INITIAL_MONTH) {
  let currentMonthDays = createDaysForCurrentMonth(INITIAL_YEAR, INITIAL_MONTH);

  let previousMonthDays = createDaysForPreviousMonth(
    INITIAL_YEAR,
    INITIAL_MONTH,
    currentMonthDays
  );

  let nextMonthDays = createDaysForNextMonth(
    INITIAL_YEAR,
    INITIAL_MONTH,
    currentMonthDays
  );
  let days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  return days;
}
