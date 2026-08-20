"use client";

import { InputArea } from "@/global-components/layout/FormWrapper";
import useJML from "../../../hooks/useJML";
import type { JMLEmploymentForm } from "../../../types/jml.types";

const employmentFields: Array<{
  key: keyof JMLEmploymentForm;
  label: string;
  placeholder: string;
}> = [
  { key: "departmentId", label: "DEPARTMENT", placeholder: "Department" },
  { key: "teamIds", label: "TEAM", placeholder: "Comma-separated team IDs" },
  { key: "jobTitle", label: "JOB TITLE", placeholder: "Job title" },
  { key: "positionCode", label: "POSITION CODE", placeholder: "Position code" },
  { key: "seniorityLevel", label: "SENIORITY", placeholder: "Seniority" },
  {
    key: "employmentType",
    label: "EMPLOYMENT TYPE",
    placeholder: "Employment type",
  },
  { key: "workLocation", label: "WORK LOCATION", placeholder: "Work location" },
  { key: "managerId", label: "MANAGER", placeholder: "Manager ID" },
  { key: "startDate", label: "START DATE", placeholder: "YYYY-MM-DD" },
];

export default function Employment() {
  const { state, dispatch } = useJML();

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {employmentFields.map((field) => (
        <div key={field.key}>
          <div className="text-style__body">{field.label}</div>
          <InputArea
            val={state.employment[field.key]}
            changeFunc={(value) =>
              dispatch({
                type: "employment/update",
                field: field.key,
                value,
              })
            }
          />
        </div>
      ))}
    </div>
  );
}
