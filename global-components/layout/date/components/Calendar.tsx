"use client";

import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface CalendarProps {
  initialMonth?: Date;
  selectedDates?: readonly Date[];
  isDateHighlighted?: (date: Date) => boolean;
  onDateSelect?: (date: Date) => void;
  emphasized?: boolean;
  disabled?: boolean;
}

const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export default function Calendar({
  initialMonth = new Date(),
  selectedDates = [],
  isDateHighlighted,
  onDateSelect,
  emphasized = false,
  disabled = false,
}: CalendarProps) {
  const [displayedMonth, setDisplayedMonth] = useState(initialMonth.getMonth());
  const [displayedYear, setDisplayedYear] = useState(
    initialMonth.getFullYear(),
  );

  const firstWeekday = new Date(displayedYear, displayedMonth, 1).getDay();
  const daysInMonth = new Date(
    displayedYear,
    displayedMonth + 1,
    0,
  ).getDate();
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  const changeMonth = (offset: number) => {
    const nextMonth = new Date(displayedYear, displayedMonth + offset, 1);
    setDisplayedMonth(nextMonth.getMonth());
    setDisplayedYear(nextMonth.getFullYear());
  };

  const clampYear = (year: number) => Math.min(2100, Math.max(1900, year));

  return (
    <div
      className={`w-70 rounded-[10px] border bg-white p-3.5 duration-150 ${
        emphasized
          ? "border-(--secondary-blue) ring-2 ring-(--secondary-blue)/20"
          : "border-(--terciary-grey)"
      }`}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <button
          type="button"
          title="Previous month"
          aria-label="Previous month"
          className="grid h-7.5 w-7.5 place-items-center rounded-[10px] text-(--primary-grey) hover:bg-(--terciary-grey)/30"
          onClick={() => changeMonth(-1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>

        <select
          aria-label="Month"
          className="min-w-0 flex-1 rounded-[10px] border border-(--terciary-grey) bg-white px-2 py-1.5"
          value={displayedMonth}
          onChange={(event) => setDisplayedMonth(Number(event.target.value))}
        >
          {MONTHS.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        <div className="flex h-8 w-21 overflow-hidden rounded-[10px] border border-(--terciary-grey) bg-white">
          <input
            type="number"
            aria-label="Year"
            min={1900}
            max={2100}
            className="min-w-0 flex-1 px-2 outline-none"
            value={displayedYear}
            onChange={(event) => setDisplayedYear(Number(event.target.value))}
            onBlur={() => setDisplayedYear((year) => clampYear(year))}
          />
          <div className="grid w-5 shrink-0 grid-rows-2 border-l border-(--terciary-grey)">
            <button
              type="button"
              title="Increment year"
              aria-label="Increment year"
              disabled={displayedYear >= 2100}
              className="grid place-items-center border-b border-(--terciary-grey) text-[8px] text-(--primary-grey) hover:bg-(--terciary-grey)/30 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setDisplayedYear((year) => clampYear(year + 1))}
            >
              <FontAwesomeIcon icon={faAngleUp} />
            </button>
            <button
              type="button"
              title="Decrement year"
              aria-label="Decrement year"
              disabled={displayedYear <= 1900}
              className="grid place-items-center text-[8px] text-(--primary-grey) hover:bg-(--terciary-grey)/30 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setDisplayedYear((year) => clampYear(year - 1))}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
          </div>
        </div>

        <button
          type="button"
          title="Next month"
          aria-label="Next month"
          className="grid h-7.5 w-7.5 place-items-center rounded-[10px] text-(--primary-grey) hover:bg-(--terciary-grey)/30"
          onClick={() => changeMonth(1)}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-style__small-text text-(--primary-grey)">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="grid h-7.5 place-items-center font-bold">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="h-7.5" />;

          const date = new Date(displayedYear, displayedMonth, day);
          const isSelected = selectedDates.some((selectedDate) =>
            isSameDay(date, selectedDate),
          );
          const highlighted = isDateHighlighted?.(date) ?? false;
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              className={`grid h-7.5 place-items-center rounded-[8px] duration-150 disabled:cursor-default ${
                isSelected
                  ? "bg-(--primary-blue) text-white"
                  : highlighted
                    ? "bg-(--secondary-blue)/15 text-(--primary-blue)"
                    : isToday
                      ? "border border-(--secondary-blue) text-(--primary-blue)"
                      : !disabled
                        ? "hover:bg-(--terciary-grey)/30"
                        : ""
              }`}
              onClick={() => onDateSelect?.(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
