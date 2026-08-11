"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Filter<T extends string | number>({
  filterOptions,
  selectedOption,
  setSelectedOption,
  selectFirstOption,
  placeholder = "select option",
  dropdownSelectorDirection = "downwards",
}: {
  filterOptions: readonly T[];
  selectedOption: T;
  setSelectedOption: (option: T) => void;
  selectFirstOption: boolean;
  placeholder: string | number;
  dropdownSelectorDirection?: "upwards" | "downwards";
}) {
  const [firstOptionSelected, setFirstOptionSelected] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectFirstOption && !firstOptionSelected)
      setSelectedOption(filterOptions[0]);
  }, [
    selectFirstOption,
    filterOptions,
    setSelectedOption,
    firstOptionSelected,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsClicked(false);
      }
    };

    if (isClicked) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isClicked]);

  const selectOption = (option: T) => {
    setFirstOptionSelected(true);
    setSelectedOption(option);
  };

  return (
    <div
      ref={selectorRef}
      className="selector z-1"
      onClick={() => setIsClicked((prev) => !prev)}
    >
      <div className="h-6 font-bold flex items-center">
        <div className="flex-1">
          {selectedOption ? (
            selectedOption
          ) : (
            <div className="text-(--primary-grey)">{placeholder}</div>
          )}
        </div>

        <FontAwesomeIcon
          icon={["fas", "angle-down"]}
          className="text-(--primary-grey)"
        />
      </div>

      {isClicked && (
        <ul
          className={`selector-dropdown w-full ${dropdownSelectorDirection === "downwards" ? "top-11" : "bottom-11"}`}
        >
          {filterOptions.map((option) => (
            <li
              key={option}
              className={`selector-dropdown-option ${option === selectedOption ? "bg-(--terciary-grey)/30" : ""}`}
              onClick={() => selectOption(option)}
            >
              {option}

              {option === selectedOption && (
                <FontAwesomeIcon
                  icon={["fas", "check"]}
                  className="text-(--terciary-grey)"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
