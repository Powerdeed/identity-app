"use client";

import useEmployees from "@/features/employees/hooks/useEmployees";
import useEmployeeActivities, {
  activityCategories,
} from "@/features/employees/hooks/useEmployeeActivities";
import { DateRangePicker } from "@/global-components/layout/date";
import Filter from "@/global-components/ui/Filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserActivities from "../../tables/UserActivities";

export default function Activity() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const activity = useEmployeeActivities();

  if (!employee) return null;

  return (
    <div className="vertical-layout__outer text-style__body min-h-screen">
      <div className="horizontal-layout p-5 rounded-[10px] text-style__small-text border border-(--secondary-blue) bg-(--secondary-blue)/15 text-(--secondary-blue)">
        <FontAwesomeIcon
          icon={["fas", "info-circle"]}
          className="text-style__big-text"
        />
        <div>
          <span className="font-bold">Identity audit trail:</span> events are
          loaded from identity-service audit logs for the selected employee.
        </div>
      </div>

      <div className="feature-container-horizontal horizontal-layout text-style__small-text">
        <Filter
          placeholder="select category"
          selectFirstOption
          filterOptions={activityCategories}
          selectedOption={activity.category}
          setSelectedOption={activity.setCategory}
          dropdownSelectorDirection="upwards"
        />
        <DateRangePicker
          startDate={activity.startDate}
          endDate={activity.endDate}
          onChange={activity.setDateRange}
        />
      </div>

      <UserActivities activities={activity.activities} />
    </div>
  );
}
