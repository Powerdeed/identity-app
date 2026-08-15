"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGlobals } from "@globals";

import SearchBar from "@/global-components/ui/SearchBar";
import { SeparatorLine } from "../../FormWrapper";

import "@/global-components/icons/icons";

import useNav from "../hooks/useNav";

import {
  hasPermission,
  PERMISSIONS,
  useAuthStates,
  useLogout,
} from "@app/auth";

import { getInitials } from "../utils/getInitials";

const roleDisplayPriority = [
  "platform.super_admin",
  "platform.security_admin",
  "command_center.admin",
  "cms.admin",
];

function formatRoleLabel(role?: string) {
  if (!role) return "No role assigned";

  return role
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPrimaryRoleLabel(user: ReturnType<typeof useAuthStates>["user"]) {
  const assignedRoles = user?.access?.roles ?? [];

  const primaryRole =
    roleDisplayPriority.find((role) =>
      assignedRoles.some((assignment) => assignment.roleId === role),
    ) ?? assignedRoles[0]?.roleId;

  return formatRoleLabel(primaryRole ?? user?.role);
}

export default function NavView() {
  const router = useRouter();
  const { globalStates } = useGlobals();
  const { navStates } = useNav();
  const { user } = useAuthStates();
  const { handleLogout } = useLogout();
  const primaryRoleLabel = getPrimaryRoleLabel(user);

  const canManageUsers = hasPermission(user, PERMISSIONS.IDENTITY_USERS_MANAGE);
  const canManageSettings = hasPermission(
    user,
    PERMISSIONS.IDENTITY_SETTINGS_MANAGE,
  );

  return (
    <nav
      className={`fixed h-15 top-0 ${globalStates.sideBarOpen ? "left-65  w-[calc(100vw-260px)]" : "left-15  w-[calc(100vw-70px)]"} z-50 flex gap-2.5 items-center border-b border-(--terciary-grey) backdrop-blur shadow-[0_4px_6px_-1px_rgba(51,51,51,0.1)] py-2.5 px-5 text-style__body`}
    >
      <SearchBar
        val={navStates.searchQuery}
        placeholder="Search employees, email, department,..."
        changeFunc={(val) => navStates.setSearchQuery(val)}
      />

      {/* NOTIFICATIONS */}
      <div className="relative">
        <div
          className="relative p-1 rounded-[10px] duration-300 hover:bg-(--terciary-grey) cursor-pointer"
          onClick={() =>
            navStates.setOpenNotifications((prev) =>
              prev === true ? false : true,
            )
          }
        >
          <FontAwesomeIcon
            icon={["far", "bell"]}
            className="text-(--primary-grey)"
          />

          {canManageUsers && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              3
            </div>
          )}
        </div>

        {navStates.openNotifications && (
          <div className="absolute right-0 z-50 min-w-50 feature-container-vertical">
            <div className="w-full h-full text-center">You are up to date</div>
          </div>
        )}
      </div>

      <div className="h-full border-r border-(--terciary-grey)"></div>

      {/* PROFILE DETAILS */}
      <div
        className="relative cursor-pointer p-2 flex items-center gap-2.5 text-style__small-text duration-300 hover:bg-(--terciary-grey) rounded-[10px]"
        onClick={() => navStates.setProfileOptions((prev) => !prev)}
      >
        <div>
          <div className="font-bold">{user?.name}</div>
          <div className="">{primaryRoleLabel}</div>
        </div>

        <div className="p-2 border w-10 h-10 horizontal-layout justify-center rounded-full bg-(--primary-blue) text-white">
          {getInitials(user?.name || "user")}
        </div>

        {/* DROPDOWN PROFILE OPTIONS */}
        {navStates.profileOptions && (
          <ul
            className="absolute top-12.5 z-50 w-30 p-2.5 flex flex-col gap-0.5 bg-white border border-(--terciary-grey) rounded-[10px] duration-300"
            onMouseLeave={() => navStates.setProfileOptions(false)}
          >
            <ProfileOption
              option="Profile"
              action={() => {
                router.push("/profile");
              }}
              style="text-(--primary-blue)"
            >
              <FontAwesomeIcon icon={["far", "user"]} />
            </ProfileOption>

            <SeparatorLine />

            {canManageSettings && (
              <ProfileOption
                option="Settings"
                action={() => {
                  router.push("/settings");
                }}
              >
                <FontAwesomeIcon icon={["fas", "gear"]} />
              </ProfileOption>
            )}

            <ProfileOption
              option="Security"
              action={() => {
                router.push("/security");
              }}
            >
              <FontAwesomeIcon icon={["fas", "shield-halved"]} />
            </ProfileOption>

            <ProfileOption
              option="Activity"
              action={() => {
                router.push("/activity");
              }}
            >
              <FontAwesomeIcon icon={["fas", "chart-line"]} />
            </ProfileOption>

            <SeparatorLine />

            <ProfileOption
              option="logout"
              action={handleLogout}
              style="text-(--primary-red)"
            >
              <FontAwesomeIcon icon={["far", "trash-can"]} />
            </ProfileOption>
          </ul>
        )}
      </div>
    </nav>
  );
}

function ProfileOption({
  option,
  children,
  style,
  action,
}: {
  option: string;
  children: ReactNode;
  style?: string;
  action: () => void;
}) {
  return (
    <ul
      className={`flex gap-2.5 items-center px-1 py-1.5 rounded-[10px] duration-300 hover:bg-(--terciary-grey)/50 hover:font-bold ${style}`}
      onClick={action}
    >
      {children}
      <div className="">{option}</div>
    </ul>
  );
}
