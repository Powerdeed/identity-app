"use client";

// modules
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";

// Conversions
import { convertLabelToLink, convertLinkToLabel, useGlobals } from "@globals";
import { hasPermission } from "@app/auth";

// Constants
import { menuItems } from "@lib/constants/NAV_MENU_AND_LABELS";
import { COMPANY_NAME } from "@lib/constants/COMPANY_NAME";

const titleMeta = {
  title: "Workforce Identity",
};

export default function SideBar() {
  const { globalStates } = useGlobals();
  const currentMenu = convertLinkToLabel(usePathname().slice(1));
  const visibleMenuItems = menuItems.filter((item) =>
    hasPermission(globalStates.user, item.requiredPermission),
  );

  return (
    <aside
      className={`fixed left-0 top-0 flex flex-col ${globalStates.sideBarOpen ? "w-65" : "w-15"} h-full bg-(--primary-blue) text-style__small-text text-(--terciary-grey)`}
    >
      <div className="p-2.5 pl-5 h-20 horizontal-layout border-b border-(--secondary-grey)">
        <div className="horizontal-layout flex-1">
          {globalStates.sideBarOpen && (
            <div className="w-10 h-10 bg-(--secondary-blue) rounded-[10px] grid items-center justify-center">
              <FontAwesomeIcon
                icon={["fas", "gear"]}
                className="text-style__logo"
              />
            </div>
          )}

          {globalStates.sideBarOpen && <h2>{titleMeta.title}</h2>}
        </div>

        <FontAwesomeIcon
          icon={["fas", "arrow-right-from-bracket"]}
          className={`text-style__body cursor-pointer ${globalStates.sideBarOpen ? "rotate-180" : ""}`}
          onClick={() => globalStates.setSideBarOpen((prev) => !prev)}
        />
      </div>
      <div className="flex-1 py-2.5 h-20 border-b border-(--secondary-grey)">
        <ul className="w-full h-full flex flex-col text-style__small-text overflow-y-scroll side-bar-scrollbar">
          {visibleMenuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={convertLabelToLink(item.label)}
                className={`relative p-2.5 flex pl-5 gap-2.5 items-center ${currentMenu === item.label ? "bg-(--secondary-blue)/70 hover:bg-(--secondary-blue)/70 text-white" : "text-(--terciary-grey)"} cursor-pointer hover:bg-(--primary-grey)/30 hover:text-white transition-colors`}
              >
                {currentMenu === item.label && (
                  <div className="absolute left-0 top-0 h-full w-1.25 bg-(--secondary-blue)"></div>
                )}
                <div className="w-4">
                  <FontAwesomeIcon icon={["fas", item.icon as IconName]} />
                </div>
                {globalStates.sideBarOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="py-2.5 pl-5 h-20">
        {globalStates.sideBarOpen && <div>{COMPANY_NAME}</div>}
        <div>v{process.env.NEXT_PUBLIC_APP_VERSION}</div>
      </div>
    </aside>
  );
}
