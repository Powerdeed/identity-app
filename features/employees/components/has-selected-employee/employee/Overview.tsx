"use client";

import ContainerTitle from "@/global-components/ui/ContainerTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AccessSummary: Record<
  "Keycloak Groups" | "Powerdeed Roles" | "Direct Permission Exceptions",
  { access: string[]; color: string }
> = {
  "Keycloak Groups": {
    access: ["eng-staff", "vpn-access", "github-org"], //TODO: create an get access function
    color:
      "border-(--primary-green)/50 bg-(--primary-green)/10 text-(--primary-green)",
  },
  "Powerdeed Roles": {
    access: ["platform:engineer", "ops:deployer"], //TODO: create an get roles function
    color:
      "border-(--secondary-blue) bg-(--secondary-blue)/15 text-(--secondary-blue)",
  },
  "Direct Permission Exceptions": {
    access: [], //TODO: create an get exception permissions function
    color:
      "border-(--primary-red)/30 bg-(--primary-red)/10 text-(--primary-red)",
  },
};
//TODO: implement with real data
const userOverview = {
  "Employee Number": "EMP-0031",
  Manager: "Fatima Al-Hassan",
  "Active Sessions": "2",
  "Last Activity": "3 hrs ago",
  "Start Date": "2020-09-07",
};

export default function Overview() {
  return (
    <div className="vertical-layout__outer">
      <div className="feature-container-vertical">
        <div className="vertical-layout__inner text-style__body">
          <ContainerTitle title="Effective Access Summary" />

          {Object.entries(AccessSummary).map(([accessType, accessVals], i) => (
            <div key={accessType} className="vertical-layout__inner">
              <div className="horizontal-layout">
                {accessType === "Direct Permission Exceptions" && (
                  <FontAwesomeIcon
                    icon={["fas", "exclamation-triangle"]}
                    className="text-(--secondary-red)"
                  />
                )}
                <div>{accessType.toUpperCase()}</div>
              </div>
              <div className="horizontal-layout text-style__small-text">
                {accessVals.access.length ? (
                  accessVals.access.map((accessDetails, idx) => (
                    <div
                      key={idx}
                      className={`w-fit rounded-[10px] border px-2 ${accessVals.color}`}
                    >
                      {accessDetails}
                    </div>
                  ))
                ) : (
                  <div className="text-(--primary-grey)">
                    No {accessType} assigned
                  </div>
                )}
              </div>
              {i !== Object.keys(AccessSummary).length - 1 && (
                <hr className="text-(--terciary-grey)" />
              )}
            </div>
          ))}
        </div>
      </div>

      {Object.entries(userOverview).map(([overviewTitle, overviewDesc]) => (
        <div key={overviewTitle} className="vertical-layout__inner">
          <div className="horizontal-layout text-style__small-text justify-between">
            <div className="text-(--primary-grey)">{overviewTitle}</div>
            <div>{overviewDesc}</div>
          </div>

          <hr className="text-(--terciary-grey)" />
        </div>
      ))}
    </div>
  );
}
