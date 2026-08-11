"use client";

import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// TODO: Create a function to get employee details
const details = {
  "EMPLOYEE NUMBER": "EMP-0031",
  DEPARTMENT: "HR",
  TEAM: "Employee Operations",
  "JOB TITLE": "HR Business Partner",
  "POSITION CODE": "HR-BP-01",
  SENIORITY: "Mid",
  "EMPLOYEE TYPE": "Full-time",
  "WORK LOCATION": "Nairobi HQ",
  "START DATE": "2029-09-07",
  MANAGER: "David Kamau",
};

export default function Employment() {
  return (
    <div className="w-150 feature-container-vertical text-style__body">
      <ContainerTitle
        title="Employment Details"
        el={
          <Button
            buttonText="Edit"
            buttonType="light"
            icon={<FontAwesomeIcon icon={["far", "pen-to-square"]} />}
          />
        }
      />

      <div className="grid grid-cols-2 gap-5">
        {Object.entries(details).map(([title, value]) => (
          <div key={title}>
            <div className="text-(--primary-grey)">{title}</div>
            <div className="text-style__small-text text-(--primary-blue)">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
