"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Fitler({
  options,
  selectedFilters,
  setSelectedFilters,
  flipDirection,
}: {
  options: string[];
  selectedFilters: string[];
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
  flipDirection?: boolean;
}) {
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
      className={`relative horizontal-layout text-style__small-text ${flipDirection && `flex-row-reverse`}`}
    >
      <div className={`${flipDirection && "relative"}`}>
        <div
          className="containerize hover:bg-(--terciary-grey)/30 rounded-[10px] p-1 cursor-pointer"
          onClick={() => setIsClicked((prev) => !prev)}
        >
          <FontAwesomeIcon icon={["fas", "filter"]} />
          <div>Fitler</div>
        </div>

        <div className={`absolute -top-2 left-0`}>
          {isClicked && unselectedFilters.length > 0 && (
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
      </div>

      {selectedFilters.map((filter) => (
        <Option key={filter} filter={filter} removeFilter={removeFilter} />
      ))}
    </div>
  );
}

function Option({
  filter,
  removeFilter,
}: {
  filter: string;
  removeFilter: (filter: string) => void;
}) {
  return (
    <div key={filter} className="containerize rounded-[10px] p-1">
      <FontAwesomeIcon
        icon={["fas", "xmark"]}
        className="p-px rounded-[5px] hover:bg-(--terciary-grey)/30 hover:text-(--primary-red) cursor-pointer"
        onClick={() => removeFilter(filter)}
      />

      <div>{filter}</div>
    </div>
  );
}
