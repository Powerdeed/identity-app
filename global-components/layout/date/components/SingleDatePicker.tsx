"use client";

import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import { getDateFormatted } from "../utils/currentDate";

const parseDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

const formatDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

export default function SingleDatePicker({
  value,
  onChange,
  label = "Select date",
  maxDate,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  maxDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDate(value);
  const maximumDate = maxDate ? parseDate(maxDate) : null;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative min-w-0 w-full">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="input-style flex min-h-10 w-full items-center justify-between gap-2.5 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selectedDate ? "" : "text-(--primary-grey)"}>
          {selectedDate ? getDateFormatted(selectedDate) : label}
        </span>
        <FontAwesomeIcon icon={faCalendar} className="text-(--primary-grey)" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute right-0 z-50 mt-1 rounded-[8px] bg-white shadow-lg"
        >
          <Calendar
            key={value || "unselected"}
            initialMonth={selectedDate ?? new Date()}
            selectedDates={selectedDate ? [selectedDate] : []}
            isDateDisabled={(date) =>
              Boolean(maximumDate && date.getTime() > maximumDate.getTime())
            }
            onDateSelect={(date) => {
              onChange(formatDate(date));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
