"use client";

import { useState } from "react";
import Button from "@/global-components/ui/Button";

export default function CatalogStatusDialog({
  recordName,
  nextAction,
  isSaving,
  onCancel,
  onConfirm,
}: {
  recordName: string;
  nextAction: "activate" | "deactivate";
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<unknown>;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-5" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-status-title"
        className="w-full max-w-lg rounded-[8px] bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div id="catalog-status-title" className="text-style__big-text text-(--primary-blue)">
          {nextAction === "activate" ? "Activate" : "Deactivate"} {recordName}
        </div>
        <label className="vertical-layout__inner mt-4">
          <span>REASON</span>
          <textarea
            autoFocus
            required
            maxLength={500}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="input-style min-h-24 w-full"
          />
        </label>
        <div className="horizontal-layout mt-4 justify-end">
          <Button buttonType="light" buttonText="Cancel" clickAction={onCancel} disabled={isSaving} />
          <Button
            buttonType={nextAction === "deactivate" ? "red" : "primary"}
            buttonText={isSaving ? "Saving..." : nextAction === "activate" ? "Activate" : "Deactivate"}
            disabled={isSaving || !reason.trim()}
            clickAction={async () => {
              const result = await onConfirm(reason);
              if (result) onCancel();
            }}
          />
        </div>
      </div>
    </div>
  );
}
