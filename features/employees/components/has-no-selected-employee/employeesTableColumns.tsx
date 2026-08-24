import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { DataTableColumn } from "@/global-components/ui/DataTable";
import { getDateTimeFormatted, getRelativeDateFormatted } from "@/globals";
import Dotindicator from "@/global-components/ui/Dotindicator";
import { getInitials } from "@/global-components/layout/nav";
import { EmployeeTableRow } from "../../types/employeesTypes";
import { STATUS_STYLES } from "../../constants/STATUS_STYLES";
import { formatLabel } from "../../utils/formatLabel";

export const createEmployeeTableColumns = (
  onSelect?: (employee: EmployeeTableRow) => void,
): DataTableColumn<EmployeeTableRow>[] => [
  {
    id: "employee",
    header: "Employee",
    headerClassName: "w-70",
    cell: (employee) => (
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--primary-blue) text-style__small-text--bold text-white">
          {getInitials(employee.name)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-style__body--bold text-(--primary-blue)">
            {employee.name}
          </div>
          <div className="truncate text-(--primary-grey)">{employee.email}</div>
        </div>
      </div>
    ),
  },
  {
    id: "department",
    header: "Department",
    cellClassName: "text-(--primary-blue)",
    cell: (employee) => formatLabel(employee.department),
  },
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
    cellClassName: "text-(--primary-blue)",
  },
  {
    id: "manager",
    header: "Manager",
    accessorKey: "manager",
    cellClassName: "text-(--primary-grey)",
  },
  {
    id: "status",
    header: "Status",
    cell: (employee) => (
      <span
        className={`inline-flex rounded-[10px] border px-1 py-0.5 ${STATUS_STYLES[employee.status]}`}
      >
        {formatLabel(employee.status)}
      </span>
    ),
  },
  {
    id: "access",
    header: "Access",
    cell: (employee) => (
      <div>
        <div className="text-(--primary-blue)">
          {employee.appCount} {employee.appCount === 1 ? "app" : "apps"}
        </div>
        <div className="text-(--primary-grey)">
          {employee.roleCount} {employee.roleCount === 1 ? "role" : "roles"}
        </div>
      </div>
    ),
  },
  {
    id: "sessions",
    header: "Sessions",
    accessorKey: "sessionCount",
    cellClassName: "text-(--primary-blue)",
    cell: (employee) => {
      const hasSessions = employee.sessions > 0;

      return (
        <span className="horizontal-layout">
          <Dotindicator
            color={
              hasSessions ? "bg-(--primary-green)" : "bg-(--terciary-grey)"
            }
          />

          {hasSessions ? employee.sessions : 0}
        </span>
      );
    },
  },
  {
    id: "lastActivity",
    header: "Last activity",
    cellClassName: "whitespace-nowrap text-(--primary-grey)",
    cell: (employee) => {
      const relativeDate = getRelativeDateFormatted(employee.lastActivity);
      const exactDate = getDateTimeFormatted(employee.lastActivity);

      return relativeDate && exactDate ? (
        <time dateTime={employee.lastActivity ?? undefined} title={exactDate}>
          {relativeDate}
        </time>
      ) : (
        "No activity recorded"
      );
    },
  },
  {
    id: "actions",
    header: <span className="sr-only">Actions</span>,
    headerClassName: "w-12 px-2",
    cellClassName: "px-2",
    cell: (employee) => (
      <button
        type="button"
        title={`Open ${employee.name}`}
        aria-label={`Open ${employee.name}`}
        disabled={!onSelect}
        className="grid h-8 w-8 place-items-center rounded-[10px] text-(--primary-grey) duration-150 enabled:hover:bg-(--terciary-grey)/30 enabled:hover:text-(--primary-blue)"
        onClick={() => onSelect?.(employee)}
      >
        <FontAwesomeIcon icon={["fas", "ellipsis"]} />
      </button>
    ),
  },
];
