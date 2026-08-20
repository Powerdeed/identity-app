"use client";

import useJML from "../../../hooks/useJML";

const sectionTitle =
  "The Powerdeed profile will be created in pending state. No access will be granted at this stage.";

export default function CreateProfile() {
  const { state } = useJML();

  return (
    <div>
      <div className="text-(--primary-grey) text-style__small-text pb-2.5">
        {sectionTitle}
      </div>

      <div className="text-(--primary-yellow) text-style__small-text p-2.5 rounded-[10px] bg-(--primary-yellow-faded)/30 border border-(--primary-yellow)">
        {state.provisionedUser
          ? `${state.provisionedUser.name}'s pending profile has been created.`
          : "Profile will be created in pending state. Access assignment and activation happen in subsequent steps."}
      </div>
    </div>
  );
}
