"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getInitials } from "@/global-components/layout/nav";
import Dotindicator from "@/global-components/ui/Dotindicator";
import SearchBar from "@/global-components/ui/SearchBar";

import { getRandomClassNameColor } from "@/globals";

const employee = {
  name: "Bernard Kuria",
  initials: getInitials("Bernard Kuria"),
  email: "bernard.kuria@powerdeed.co.ke",
  department: "Engineering",
  assignment: {
    Department: "HR",
    Title: "HR Business Partner",
    Manager: "David Kamau",
    Team: "People Ops",
  },
  currentAccess: [
    "eng-staff",
    "vpn-access",
    "github-org",
    "platform:engineer",
    "ops:deployer",
  ],
};

export default function SelectPerson() {
  const initialBackgroundColor = getRandomClassNameColor(employee.initials);

  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text text-(--primary-grey)">
        Search for an active staff member who is changing departments, roles, or
        reporting line. Only active accounts can be moved.
      </div>

      <div className="text-style__body">SEARCH STAFF</div>

      <SearchBar
        placeholder="Search name, email or department"
        val=""
        changeFunc={() => {}}
      />

      <div className="horizontal-layout border border-(--secondary-blue) bg-(--secondary-blue)/10 rounded-[10px] p-2.5">
        <div
          className={`w-8 h-8 grid items-center text-center ${initialBackgroundColor} rounded-[10px] text-style__body--bold`}
        >
          {employee.initials}
        </div>

        <div className="flex-1">
          <div className="text-style__body--bold">{employee.name}</div>

          <div className="horizontal-layout text-style__small-text">
            <div>{employee.email}</div>

            <Dotindicator />

            <div>{employee.department}</div>
          </div>
        </div>

        <FontAwesomeIcon
          icon={["fas", "xmark"]}
          className="buttonize hover:text-(--primary-red) hover:bg-(--terciary-grey)/30 rounded-[10px] p-2.5"
        />
      </div>

      <div className="vertical-layout__inner bg-(--terciary-grey)/30 p-2.5 rounded-[10px]">
        <div className="vertical-layout__inner border-b border-(--terciary-grey) pb-2.5">
          <div className="text-style__body">CURRENT ASSIGNMENT</div>

          {Object.entries(employee.assignment).map(([assignment, value]) => (
            <div key={assignment} className="horizontal-layout">
              <div className="flex-1 text-(--primary-grey)">{assignment}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>

        <div className="vertical-layout__inner">
          <div className="text-style__body">CURRENT ACCESS</div>

          <div className="horizontal-layout">
            {employee.currentAccess.map((access) => (
              <div
                key={access}
                className="text-style__small-text text-(--secondary-blue) bg-(--secondary-blue)/10 border border-(--secondary-blue) px-1 rounded-[10px]"
              >
                {access}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
