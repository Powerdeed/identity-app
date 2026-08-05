"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUnsavedChangesGuard from "@globals/hooks/useUnsavedChangesGuard";

export default function UnsavedChangesGuard() {
  const { noticeText, noticeVisible } = useUnsavedChangesGuard();

  return (
    <div
      className={`fixed right-5 bottom-5 z-50 max-w-95 rounded-[10px] border border-(--secondary-blue)/40 bg-white px-4 py-3 shadow-[0_8px_30px_rgba(51,51,51,0.18)] transition-all duration-300 ${
        noticeVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-2.5 items-start text-style__small-text">
        <FontAwesomeIcon
          icon={["fas", "circle-exclamation"]}
          className="mt-0.5 text-(--secondary-blue)"
        />

        <div>
          <div className="font-bold text-(--primary-grey)">
            {noticeText.title}
          </div>
          <div className="text-(--secondary-grey)">{noticeText.message}</div>
        </div>
      </div>
    </div>
  );
}
