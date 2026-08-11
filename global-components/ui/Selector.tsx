"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Selector({
  options,
  selectedOption,
  setSelectedOption,
  selectFirstOption,
}: {
  options: string[];
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  selectFirstOption: boolean;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectFirstOption) setSelectedOption(options[0]);
  }, [selectFirstOption, options, setSelectedOption]);

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

  const selectOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div
      ref={selectorRef}
      className="selector text-style__body z-1"
      onClick={() => setIsClicked((prev) => !prev)}
    >
      <div className="text-style__body--bold flex items-center">
        <div className="flex-1">{selectedOption}</div>
        <FontAwesomeIcon
          icon={["fas", "angle-down"]}
          className="text-(--primary-grey)"
        />
      </div>

      {isClicked && (
        <ul className="selector-dropdown w-full text-style__small-text">
          {options.map((option) => (
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
