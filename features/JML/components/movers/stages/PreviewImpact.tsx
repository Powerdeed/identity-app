"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";

const currentPostion = {
  department: "Engineering",
  title: "Senior Software Engineer",
  manager: "Mr. Mwangi",
};

const newPosition = {
  department: "Engineering",
  title: "Senior Software Engineer",
  manager: "Mr. Alfred",
};

export default function PreviewImpact() {
  return (
    <div className="vertical-layout__outer text-left">
      <div className="horizontal-layout p-2.5 h-10 border border-(--secondary-blue) bg-(--secondary-blue)/10 text-(--secondary-blue) rounded-[10px]">
        <FontAwesomeIcon icon={["fas", "info-circle"]} />
        <div className="text-style__small-text">
          Review all access changes that will happen as a result of this move.
          Sessions will be revoked so the user gets a fresh entitlement
          snapshot.
        </div>
      </div>

      <div className="feature-container-vertical">
        <div className="w-full text-style__body--bold">Employment Changes</div>

        <div className="horizontal-layout text-style__body text-(--primary-grey) border-b border-(--terciary-grey) pb-2.5">
          <div className="flex-1">FIELD</div>
          <div className="flex-1">CURRENT</div>
          <div className="flex-1">NEW</div>
        </div>

        <div
          className={`horizontal-layout text-style__body border-b border-(--terciary-grey) pb-2.5 ${!isEqual(currentPostion.department, newPosition.department) ? "bg-(--terciary-grey)/30 py-2.5" : ""}`}
        >
          <div className="flex-1">Department</div>
          <div className="flex-1 text-(--primary-grey)">
            {!isEqual(currentPostion.department, newPosition.department) ? (
              <del>{currentPostion.department}</del>
            ) : (
              currentPostion.department
            )}
          </div>
          <div className="flex-1 text-(--secondary-blue)">
            {newPosition.department}
          </div>
        </div>

        <div
          className={`horizontal-layout text-style__body border-b border-(--terciary-grey) pb-2.5 ${!isEqual(currentPostion.title, newPosition.title) ? "bg-(--terciary-grey)/30 py-2.5" : ""}`}
        >
          <div className="flex-1">Title</div>
          <div className="flex-1 text-(--primary-grey)">
            {!isEqual(currentPostion.title, newPosition.title) ? (
              <del>{currentPostion.title}</del>
            ) : (
              currentPostion.title
            )}
          </div>
          <div className="flex-1 text-(--secondary-blue)">
            {newPosition.title}
          </div>
        </div>

        <div
          className={`horizontal-layout text-style__body ${!isEqual(currentPostion.manager, newPosition.manager) ? "bg-(--terciary-grey)/30 py-2.5" : ""}`}
        >
          <div className="flex-1">Manager</div>
          <div className="flex-1 text-(--primary-grey)">
            {!isEqual(currentPostion.manager, newPosition.manager) ? (
              <del>{currentPostion.manager}</del>
            ) : (
              currentPostion.manager
            )}
          </div>
          <div className="flex-1 text-(--secondary-blue)">
            {newPosition.manager}
          </div>
        </div>
      </div>

      <div className="feature-container-vertical">
        <div className="w-full text-style__body--bold">Access Consequences</div>

        <div className="text-style__body border-b border-(--terciary-grey) pb-2.5 text-(--secondary-green)">
          <div>GROUPS TO BE ADDED</div>

          <div className="w-fit text-style__small-text px-2.5 border border-(--secondary-green) bg-(--secondary-green)/10 rounded-[10px]">
            fin-staff
          </div>
        </div>
        <div className="text-style__body border-b border-(--terciary-grey) pb-2.5">
          <div className="text-(--primary-yellow)">ROLES REQUIRING REVIEW</div>
          <div className="horizontal-layout text-style__small-text">
            <div className="w-fit px-2.5 border border-(--primary-yellow) bg-(--primary-yellow-faded)/30 text-(--primary-yellow) rounded-[10px]">
              platform:engineer
            </div>
            <div className="text-(--primary-grey)">
              Scope may no longer match — requires confirmation after move
            </div>
          </div>
        </div>
        <div className="horizontal-layout p-2.5 text-style__small-text border border-(--primary-red) bg-(--primary-red-faded)/10 text-(--primary-red) rounded-[10px]">
          <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
          <div>
            All 1 active session(s) will be revoked on confirmation. The user
            receives a fresh entitlement snapshot on next login.
          </div>
        </div>
      </div>
    </div>
  );
}
