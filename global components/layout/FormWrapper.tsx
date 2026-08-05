"use client";

import { SectionTitle, SubTitle } from "@global components/ui/Title";
import { useEffect, useRef } from "react";

export default function FormWrapper({
  keyVal,
  title,
  subtitle,
  subtitleChildren,
  children,
  separatorLine = true,
}: {
  keyVal?: number | string;
  title?: string;
  subtitle: string;
  subtitleChildren?: React.ReactNode;
  children: React.ReactNode;
  separatorLine?: boolean;
}) {
  const line = !subtitleChildren && separatorLine;

  return (
    <div key={keyVal} className="vertical-layout__outer">
      <div
        className={`${subtitleChildren ? "flex gap-2.5 items-center" : "vertical-layout__inner"}`}
      >
        <div className="flex-1">
          {title ? (
            <SectionTitle title={title} subtitle={subtitle} />
          ) : (
            <SubTitle subtitle={subtitle} />
          )}
        </div>

        {line ? <SeparatorLine /> : subtitleChildren}
      </div>

      {children}
    </div>
  );
}

export function InputArea({
  keyVal,
  label,
  val,
  changeFunc,
  children,
  autoFocus,
}: {
  keyVal?: number | string;
  label?: string;
  val: string;
  changeFunc: (val: string) => void;
  children?: React.ReactNode;
  autoFocus?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div key={keyVal} className="flex-1 vertical-layout__inner w-full">
      {label && <label className="block mb-2">{label}</label>}

      <div className={`${children ? "flex gap-2.5 items-center" : ""} w-full`}>
        {/* Textarea is ALWAYS rendered here */}
        <textarea
          ref={textareaRef}
          className="flex-1 w-full input-style field-sizing-content"
          value={val}
          onChange={(e) => changeFunc(e.target.value)}
        />

        {children}
      </div>
    </div>
  );
}

export function SeparatorLine() {
  return <hr className="border-t border-(--terciary-grey) my-1" />;
}
