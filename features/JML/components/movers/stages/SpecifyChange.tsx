"use client";

import { InputArea } from "@/global-components/layout/FormWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const newPositionAssignment = {
  newJobTitle: "new job title",
  newDepartment: "new department",
  newManager: "new manager",
  reasonForMove: "promotion",
};

export default function SpecifyChange() {
  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text text-(--primary-grey)">
        Enter the new employment details. Leave a field blank to keep the
        current value. Changes will be compared in the next step.
      </div>

      <div className="vertical-layout__inner">
        <div className="horizontal-layout gap-2.5">
          <div className="vertical-layout__inner flex-1">
            <div>NEW DEPARTMENT</div>
            <InputArea
              val={newPositionAssignment.newDepartment}
              changeFunc={() => {}}
            />
          </div>

          <div className="vertical-layout__inner flex-1">
            <div>NEW JOB TITLE</div>
            <InputArea
              val={newPositionAssignment.newJobTitle}
              changeFunc={() => {}}
            />
          </div>
        </div>

        <div className="vertical-layout__inner">
          <div>NEW MANAGER</div>
          <InputArea
            val={newPositionAssignment.newManager}
            changeFunc={() => {}}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>REASON FOR MOVE</div>
          <InputArea
            val={newPositionAssignment.reasonForMove}
            changeFunc={() => {}}
          />
        </div>
      </div>

      <div className="horizontal-layout p-2.5 h-10 border border-(--primary-yellow) bg-(--primary-yellow-faded)/30 text-(--primary-yellow) rounded-[10px]">
        <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
        <div className="text-style__small-text">
          At least one field must change. Specify the new department, title, or
          manager.
        </div>
      </div>
    </div>
  );
}
