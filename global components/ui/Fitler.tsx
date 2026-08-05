"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Fitler({ dropdownWidth }: { dropdownWidth?: string }) {
  const options = ["option 1", "option 2"];
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [unselectedFilters, setUnSelectedFilters] = useState(options);
  const [isClicked, setIsClicked] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

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

  const selectOption = (filter: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filter)) return prev;

      return [...prev, filter];
    });

    setUnSelectedFilters((prev) => {
      if (prev.includes(filter))
        return prev.filter((filterOption) => filterOption !== filter);

      return [...prev];
    });

    setIsClicked((prev) => !prev);
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filter))
        return prev.filter((filterOption) => filterOption !== filter);

      return [...prev];
    });

    setUnSelectedFilters((prev) => {
      if (prev.includes(filter)) return prev;

      return [...prev, filter];
    });
  };

  return (
    <div
      ref={selectorRef}
      className="relative horizontal-layout text-style__small-text"
    >
      <div
        className="containerize hover:bg-(--terciary-grey)/30 rounded-[10px] p-1 cursor-pointer"
        onClick={() => setIsClicked((prev) => !prev)}
      >
        <FontAwesomeIcon icon={["fas", "filter"]} />
        <div>Fitler</div>
      </div>

      <div
        className={`absolute -top-2 left-0 ${dropdownWidth ? dropdownWidth : "w-40"}`}
      >
        {isClicked && (
          <ul className={`selector-dropdown`}>
            {unselectedFilters.map((option) => (
              <li
                key={option}
                className="selector-dropdown-option"
                onClick={() => selectOption(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedFilters.map((filter) => (
        <div key={filter} className="containerize rounded-[10px] p-1">
          <FontAwesomeIcon
            icon={["fas", "xmark"]}
            className="p-px rounded-[5px] hover:bg-(--terciary-grey)/30 hover:text-(--primary-red) cursor-pointer"
            onClick={() => removeFilter(filter)}
          />
          <div>{filter}</div>
        </div>
      ))}
    </div>
  );
}
