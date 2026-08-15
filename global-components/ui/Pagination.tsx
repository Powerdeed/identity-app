"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

const MIN_USEFUL_PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 35, 50, 100] as const;

export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number; // The maximum number of records displayed on one page.
  onPageChange: (page: number) => void; // A function called when the user selects the previous or next page.
  onPageSizeChange: (pageSize: number) => void; // A function called when the user changes how many records should appear per page.
  dataType?: string;
}

export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  dataType = "items",
}: PaginationProps) {
  const [displayDropDown, setDisplayDropDown] = useState(false);
  const pageSizeSelectorRef = useRef<HTMLDivElement>(null);
  const safeTotalItems = Math.max(0, totalItems);
  const smallestUsefulPageSize = Math.min(
    safeTotalItems || MIN_USEFUL_PAGE_SIZE,
    MIN_USEFUL_PAGE_SIZE,
  );
  const availablePageSizes = [
    ...new Set([
      smallestUsefulPageSize,
      ...PAGE_SIZE_OPTIONS.filter((size) => size < safeTotalItems),
      safeTotalItems,
    ]),
  ].filter((size) => size > 0);
  const largestAvailablePageSize =
    availablePageSizes[availablePageSizes.length - 1] ?? MIN_USEFUL_PAGE_SIZE;
  const safePageSize = safeTotalItems
    ? Math.min(Math.max(smallestUsefulPageSize, pageSize), largestAvailablePageSize)
    : 0;
  const totalPages = Math.ceil(safeTotalItems / safePageSize);
  const safeCurrentPage = totalPages
    ? Math.min(Math.max(1, currentPage), totalPages)
    : 0;
  const firstVisibleItem = safeTotalItems
    ? (safeCurrentPage - 1) * safePageSize + 1
    : 0;
  const lastVisibleItem = Math.min(
    safeCurrentPage * safePageSize,
    safeTotalItems,
  );

  useEffect(() => {
    if (!displayDropDown) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!pageSizeSelectorRef.current?.contains(event.target as Node)) {
        setDisplayDropDown(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [displayDropDown]);

  const changePageSize = (size: number) => {
    onPageSizeChange(size);
    onPageChange(1);
    setDisplayDropDown(false);
  };
  const canChangePageSize = availablePageSizes.length > 1;

  return (
    <nav
      aria-label="Table pagination"
      className="flex flex-wrap items-center justify-between gap-3 text-style__small-text"
    >
      <div className="flex-1 horizontal-layout text-(--primary-grey)">
        <span>Displaying</span>
        <div ref={pageSizeSelectorRef} className="relative">
          <button
            type="button"
            aria-label="Items per page"
            aria-haspopup="listbox"
            aria-expanded={displayDropDown}
            disabled={!safeTotalItems || !canChangePageSize}
            className="containerize buttonize disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => {
              if (!canChangePageSize) return;
              setDisplayDropDown((isOpen) => !isOpen);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setDisplayDropDown(false);
            }}
          >
            <span>{safeTotalItems ? safePageSize : 0}</span>
            <FontAwesomeIcon
              icon={["fas", "angle-down"]}
              className={`text-(--primary-grey) duration-150 ${displayDropDown ? "rotate-180" : ""}`}
            />
          </button>

          {displayDropDown ? (
            <ul
              role="listbox"
              aria-label="Items per page"
              className="selector-dropdown bottom-full z-10 mb-1 w-full"
            >
              {availablePageSizes.map((size) => (
                <li
                  key={size}
                  role="option"
                  aria-selected={size === safePageSize}
                >
                  <button
                    type="button"
                    className={`selector-dropdown-option w-full ${size === safePageSize ? "bg-(--terciary-grey)/30" : ""}`}
                    onClick={() => changePageSize(size)}
                  >
                    <span>{size}</span>
                    {size === safePageSize ? (
                      <FontAwesomeIcon
                        icon={["fas", "check"]}
                        className="text-(--primary-grey)"
                      />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <span>{dataType}</span>
      </div>

      <div className="flex-1 text-center text-(--primary-grey)">
        Showing {firstVisibleItem}-{lastVisibleItem} of {safeTotalItems}
      </div>

      <div className="flex-1 horizontal-layout justify-end">
        <button
          type="button"
          title="Previous page"
          aria-label="Previous page"
          disabled={safeCurrentPage <= 1}
          className="containerize buttonize grid place-items-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>

        <div className="containerize" aria-live="polite">
          Page {safeCurrentPage} of {totalPages}
        </div>

        <button
          type="button"
          title="Next page"
          aria-label="Next page"
          disabled={!totalPages || safeCurrentPage >= totalPages}
          className="containerize buttonize grid place-items-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </nav>
  );
}
