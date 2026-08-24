import { EmployeeStatus } from "../types/employeesTypes";

const GREY_STATUS_STYLE =
  "border-(--primary-grey-faded) bg-(--secondary-grey)/10 text-(--primary-grey)";

export const STATUS_STYLES: Record<EmployeeStatus, string> = {
  active:
    "border-(--primary-green-faded) bg-(--secondary-green)/10 text-(--primary-green)",
  pending:
    "border-(--primary-yellow-faded) bg-(--secondary-yellow)/10 text-(--primary-yellow)",
  suspended:
    "border-(--primary-red-faded) bg-(--secondary-red)/10 text-(--primary-red)",
  archived: GREY_STATUS_STYLE,
  unset: GREY_STATUS_STYLE,
};
