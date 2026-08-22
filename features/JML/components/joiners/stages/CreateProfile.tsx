"use client";

import Notice from "@/global-components/ui/Notice";
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

      <Notice tone="warning">
        {state.provisionedUser
          ? `${state.provisionedUser.name}'s pending profile has been created.`
          : "Profile will be created in pending state. Access assignment and activation happen in subsequent steps."}
      </Notice>
    </div>
  );
}
