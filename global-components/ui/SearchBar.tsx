"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AriaRole, HTMLInputTypeAttribute, KeyboardEvent } from "react";

export default function SearchBar({
  role,
  type,
  AriaExpanded,
  placeholder,
  val,
  changeFunc,
  keyDownFunc,
}: {
  role?: AriaRole;
  type?: HTMLInputTypeAttribute;
  AriaExpanded?: boolean;
  placeholder: string;
  val: string;
  changeFunc: (val: string) => void;
  keyDownFunc?: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex-1 border border-(--terciary-grey) p-2 rounded-[10px] focus:shadow-[0_0_0_1px_var(--secondary-grey)] focus-within:shadow-[0_0_0_1px_var(--secondary-grey)] transition-shadow flex items-center text-style__body">
      <FontAwesomeIcon
        icon={["fas", "magnifying-glass"]}
        className="text-(--terciary-grey) px-1.25"
      />

      <input
        type={type ?? "text"}
        role={role ?? "searchbox"}
        aria-autocomplete="list"
        aria-expanded={AriaExpanded}
        aria-label={placeholder}
        placeholder={placeholder}
        className="flex-1 outline-none"
        value={val}
        onChange={(e) => changeFunc(e.target.value)}
        onKeyDown={(event) => keyDownFunc?.(event)}
      />
    </div>
  );
}
