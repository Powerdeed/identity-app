"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const newAssignment = {
  Person: "Bernard Kuria",
  "New Department": "Executive",
  "New Title": "Chief Technology Officer",
  "New Manager": "Mr. Alfred",
  Reason: "Promotion",
};

export default function ConfirmMove() {
  return (
    <div className="vertical-layout__outer">
      <div className="horizontal-layout p-2.5 border border-(--secondary-green) bg-(--secondary-green)/10 text-(--secondary-green) rounded-[10px]">
        <FontAwesomeIcon icon={["fas", "check-circle"]} />

        <div className="text-style__small-text">
          <div className="text-(--primary-green)">
            Ready to apply move for Amara Osei
          </div>
          <div> Engineering → Executive · sessions will be revoked</div>
        </div>
      </div>

      <div className="feature-container-vertical">
        {Object.entries(newAssignment).map(([position, value], i) => {
          const newAssignmentLength = Object.keys(newAssignment).length;

          return (
            <div
              key={position}
              className={`horizontal-layout ${newAssignmentLength !== i + 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""}`}
            >
              <div className="flex-1 text-(--primary-grey)">{position}</div>
              <div>{value}</div>
            </div>
          );
        })}
      </div>

      <div className="horizontal-layout p-2.5 text-style__small-text border border-(--primary-yellow) bg-(--primary-yellow-faded)/10 text-(--primary-yellow) rounded-[10px]">
        <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
        <div>
          This action is recorded in the audit log and cannot be undone
          automatically. Session revocation is immediate on confirm.
        </div>
      </div>
    </div>
  );
}
