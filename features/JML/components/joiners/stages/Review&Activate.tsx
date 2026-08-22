"use client";

import Notice from "@/global-components/ui/Notice";
import useJML from "../../../hooks/useJML";

const sectionTitle =
  "Review the configuration below before activating the account.";

const actionInfo =
  "Activating will grant all assigned access immediately and create a permanent audit record.";

export default function ReviewAndActivate() {
  const { state } = useJML();
  const selectedGroups = state.keycloakGroups
    .filter((group) => state.selectedGroupIds.includes(group.id))
    .map((group) => group.name);
  const reviewDetails = {
    Name: state.selectedKeycloakUser?.name ?? "-",
    Email: state.selectedKeycloakUser?.email ?? "-",
    Department: state.employment.departmentName || "-",
    "Job Profile": state.employment.jobTitle || "-",
    Manager: state.employment.managerName || "None",
    "KC Groups": selectedGroups.join(", ") || "None",
    "PD Roles": state.selectedRoleIds.join(", ") || "None",
  };
  const reviewDetailsLength = Object.keys(reviewDetails).length;

  return (
    <div className="vertical-layout__outer">
      <div className="text-(--primary-grey) text-style__small-text pb-2.5">
        {sectionTitle}
      </div>

      <div className="border border-(--terciary-grey) rounded-[10px]">
        {Object.entries(reviewDetails).map(([title, detail], i) => (
          <div
            key={title}
            className={`horizontal-layout p-2.5 ${reviewDetailsLength !== i + 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""}`}
          >
            <div className="flex-1 text-style__body text-(--primary-grey)">
              {title}
            </div>
            <div>{detail}</div>
          </div>
        ))}
      </div>

      <Notice>
        {actionInfo}
      </Notice>
    </div>
  );
}
