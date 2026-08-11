"use client";

import { DateRangePicker } from "@/global-components/layout/date";
import Filter from "@/global-components/ui/Filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UserActivities, {
  type UserActivityRow,
} from "../../tables/UserActivities";

const activityCategories = [
  "All Categories",
  "Lifecycle",
  "Access",
  "Session",
  "Keycloak",
];

// TODO: Add functionality to get real data
const activities: UserActivityRow[] = [
  {
    id: "keycloak-group-added-2024-05-27T11:10:33+03:00",
    event: "keycloak.group_added",
    category: "Keycloak",
    actor: "grace.wanjiku",
    ipAddress: "196.201.214.77",
    timestamp: "2024-05-27T11:10:33+03:00",
    reason: "Annual review access granted",
  },
];

export default function Activity() {
  const [activityCategory, setActivityCategory] = useState<
    (typeof activityCategories)[number] | number
  >("All Categories");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredActivities = activities.filter((activity) => {
    const eventDate = new Date(activity.timestamp);
    const matchesCategory =
      activityCategory === "All Categories" ||
      activity.category === activityCategory;
    const startsOnOrAfter = !startDate || eventDate >= startDate;
    const endOfSelectedDay = endDate
      ? new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59,
          999,
        )
      : null;
    const endsOnOrBefore = !endOfSelectedDay || eventDate <= endOfSelectedDay;

    return matchesCategory && startsOnOrAfter && endsOnOrBefore;
  });

  return (
    <div className="vertical-layout__outer text-style__body min-h-screen">
      <div className="horizontal-layout p-5 rounded-[10px] text-style__small-text border border-(--secondary-blue) bg-(--secondary-blue)/15 text-(--secondary-blue)">
        <FontAwesomeIcon
          icon={["fas", "info-circle"]}
          className="text-style__big-text"
        />
        <div>
          <span className="font-bold">Audit data pending implementation:</span>
          the identity-service audit API is not yet available. The events shown
          below are representative sample data. Full event history will be
          available in a future release.
        </div>
      </div>

      <div className="feature-container-horizontal horizontal-layout text-style__small-text">
        <Filter
          placeholder="select category"
          selectFirstOption
          filterOptions={activityCategories}
          selectedOption={activityCategory}
          setSelectedOption={setActivityCategory}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(range) => {
            setStartDate(range.startDate);
            setEndDate(range.endDate);
          }}
        />
      </div>

      <UserActivities activities={filteredActivities} representative />
    </div>
  );
}
