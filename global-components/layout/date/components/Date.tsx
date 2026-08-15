"use client";

import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useEffect, useRef, useState } from "react";

import { getDateFormatted } from "../utils/currentDate";
import Calendar from "./Calendar";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
}

type ActiveBoundary = "start" | "end" | null;
type CalendarDialogPosition = Pick<
  CSSProperties,
  "left" | "top" | "maxHeight" | "visibility"
>;

const getNextMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 1);

const VIEWPORT_PADDING = 12;

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [activeBoundary, setActiveBoundary] = useState<ActiveBoundary>("start");
  const [draftStart, setDraftStart] = useState<Date | null>(startDate);
  const [draftEnd, setDraftEnd] = useState<Date | null>(endDate);
  const [dialogPosition, setDialogPosition] =
    useState<CalendarDialogPosition>({ visibility: "hidden" });
  const pickerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openCalendar) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setOpenCalendar(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [openCalendar]);

  useEffect(() => {
    if (!openCalendar) return;

    const positionDialog = () => {
      const triggerRect = pickerRef.current?.getBoundingClientRect();
      const dialogRect = dialogRef.current?.getBoundingClientRect();

      if (!triggerRect || !dialogRect) return;

      const availableBelow =
        window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING;
      const availableAbove = triggerRect.top - VIEWPORT_PADDING;
      const shouldOpenAbove =
        availableBelow < dialogRect.height && availableAbove > availableBelow;
      const availableHeight = shouldOpenAbove ? availableAbove : availableBelow;
      const maxHeight = Math.max(220, availableHeight);
      const top = shouldOpenAbove
        ? Math.max(
            VIEWPORT_PADDING,
            triggerRect.top - Math.min(dialogRect.height, maxHeight) - 4,
          )
        : Math.min(
            triggerRect.bottom + 4,
            window.innerHeight - VIEWPORT_PADDING - maxHeight,
          );
      const left = Math.min(
        Math.max(VIEWPORT_PADDING, triggerRect.left),
        window.innerWidth - VIEWPORT_PADDING - dialogRect.width,
      );

      setDialogPosition({
        left: Math.max(VIEWPORT_PADDING, left),
        top: Math.max(VIEWPORT_PADDING, top),
        maxHeight,
        visibility: "visible",
      });
    };

    const animationFrame = window.requestAnimationFrame(positionDialog);
    window.addEventListener("resize", positionDialog);
    window.addEventListener("scroll", positionDialog, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", positionDialog);
      window.removeEventListener("scroll", positionDialog, true);
    };
  }, [openCalendar]);

  const openFor = (boundary: Exclude<ActiveBoundary, null>) => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
    setActiveBoundary(boundary);
    setDialogPosition({ visibility: "hidden" });
    setOpenCalendar(true);
  };

  const selectDate = (date: Date) => {
    if (!activeBoundary) return;

    if (activeBoundary === "start") {
      setDraftStart(date);
      if (draftEnd && date <= draftEnd) {
        setActiveBoundary(null);
      } else {
        setDraftEnd(null);
        setActiveBoundary("end");
      }
      return;
    }

    if (!draftStart) {
      setDraftEnd(date);
      setActiveBoundary("start");
      return;
    }

    if (draftStart && date < draftStart) {
      setDraftStart(date);
      setDraftEnd(null);
      return;
    }

    setDraftEnd(date);
    setActiveBoundary(null);
  };

  const calendarStart = draftStart ?? new Date();
  const calendarEnd =
    draftEnd &&
    (draftEnd.getFullYear() !== calendarStart.getFullYear() ||
      draftEnd.getMonth() !== calendarStart.getMonth())
      ? draftEnd
      : getNextMonth(calendarStart);
  const selectedDates = [draftStart, draftEnd].filter(
    (date): date is Date => date !== null,
  );
  const isDateInDraftRange = (date: Date) =>
    Boolean(draftStart && draftEnd && date > draftStart && date < draftEnd);

  return (
    <div ref={pickerRef} className="relative flex items-center gap-2">
      <DateTrigger
        label="From date"
        placeholder="From date"
        value={startDate}
        active={openCalendar && activeBoundary === "start"}
        onClick={() => openFor("start")}
      />

      <span className="text-(--primary-grey)">to</span>

      <DateTrigger
        label="To date"
        placeholder="To date"
        value={endDate}
        active={openCalendar && activeBoundary === "end"}
        onClick={() => openFor("end")}
      />

      {openCalendar ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-label="Select activity date range"
          style={dialogPosition}
          className="section-scrollbar fixed z-50 max-w-[calc(100vw-1.5rem)] overflow-auto rounded-[10px] border border-(--terciary-grey) bg-white p-3 shadow-lg"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpenCalendar(false);
          }}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 text-style__small-text">
            <div className="text-(--primary-grey)">
              {activeBoundary
                ? `Select the ${activeBoundary === "start" ? "start" : "end"} date`
                : "Range selected"}
            </div>
            <div className="flex items-center gap-1.5">
              <RangeBoundaryButton
                label="From"
                value={draftStart}
                active={activeBoundary === "start"}
                onClick={() => setActiveBoundary("start")}
              />
              <span className="text-(--primary-grey)">to</span>
              <RangeBoundaryButton
                label="To"
                value={draftEnd}
                active={activeBoundary === "end"}
                onClick={() => setActiveBoundary("end")}
              />
            </div>
          </div>

          <div className="section-scrollbar flex max-w-full gap-3 overflow-x-auto pb-1">
            <Calendar
              key={`start-${calendarStart.getFullYear()}-${calendarStart.getMonth()}`}
              initialMonth={calendarStart}
              selectedDates={selectedDates}
              isDateHighlighted={isDateInDraftRange}
              emphasized={activeBoundary === "start"}
              disabled={activeBoundary !== "start"}
              onDateSelect={selectDate}
            />
            <Calendar
              key={`end-${calendarEnd.getFullYear()}-${calendarEnd.getMonth()}`}
              initialMonth={calendarEnd}
              selectedDates={selectedDates}
              isDateHighlighted={isDateInDraftRange}
              emphasized={activeBoundary === "end"}
              disabled={activeBoundary !== "end"}
              onDateSelect={selectDate}
            />
          </div>

          <div className="mt-3 flex justify-end gap-2 border-t border-(--terciary-grey) pt-3">
            <button
              type="button"
              className="buttonize rounded-[10px] px-3 py-2 text-(--primary-grey) hover:bg-(--terciary-grey)/30"
              onClick={() => setOpenCalendar(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!draftStart && !draftEnd}
              className="buttonize rounded-[10px] px-3 py-2 text-(--primary-red) hover:bg-(--primary-red)/10 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => {
                setDraftStart(null);
                setDraftEnd(null);
                setActiveBoundary("start");
              }}
            >
              Reset
            </button>
            <button
              type="button"
              disabled={!draftStart || !draftEnd}
              className="buttonize rounded-[10px] bg-(--primary-blue) px-3 py-2 text-white hover:bg-(--secondary-blue) disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                if (!draftStart || !draftEnd) return;
                onChange({ startDate: draftStart, endDate: draftEnd });
                setOpenCalendar(false);
              }}
            >
              Apply range
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RangeBoundaryButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: Date | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`buttonize rounded-lg border px-2 py-1 duration-150 ${
        active
          ? "border-(--secondary-blue) bg-(--secondary-blue)/15 text-(--primary-blue)"
          : "border-(--terciary-grey) text-(--primary-grey) hover:bg-(--terciary-grey)/20"
      }`}
      onClick={onClick}
    >
      <span className="font-bold">{label}:</span>{" "}
      {value ? getDateFormatted(value) : "Select"}
    </button>
  );
}

function DateTrigger({
  label,
  placeholder,
  value,
  active,
  onClick,
}: {
  label: string;
  placeholder: string;
  value: Date | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={active}
      className={`containerize buttonize min-w-35 justify-between hover:bg-(--terciary-grey)/20 ${active ? "border-(--secondary-blue) ring-2 ring-(--secondary-blue)/20" : ""}`}
      onClick={onClick}
    >
      <span
        className={value ? "text-(--primary-blue)" : "text-(--primary-grey)"}
      >
        {value ? getDateFormatted(value) : placeholder}
      </span>
      <FontAwesomeIcon icon={faCalendar} className="text-(--primary-grey)" />
    </button>
  );
}
