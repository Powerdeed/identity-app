"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EmptyState({
  title,
  description,
  icon = "file-lines",
}: {
  title: string;
  description?: string;
  icon?: "file-lines" | "shield-halved" | "tv" | "clipboard-list";
}) {
  return (
    <div className="grid min-h-52 place-items-center px-5 py-12 text-center">
      <div>
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-(--terciary-grey)/20 text-(--primary-grey)">
          <FontAwesomeIcon icon={["fas", icon]} />
        </div>
        <div className="text-style__body--bold text-(--primary-blue)">
          {title}
        </div>
        {description ? (
          <p className="mt-1 text-style__small-text text-(--primary-grey)">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
