import { EmployeeStatus } from "../types/employeesTypes";

export const STATUS_STYLES: Record<EmployeeStatus, string> = {
  active:
    "border-(--primary-green)/50 bg-(--primary-green)/10 text-(--primary-blue) text-(--primary-green)",
  pending:
    "border-(--primary-yellow)/70 bg-(--primary-yellow)/15 text-(--primary-blue) text-(--primary-yellow)",
  suspended:
    "border-(--primary-red)/30 bg-(--primary-red)/10 text-(--primary-red) text-(--primary-red)",
  archived:
    "border-(--secondary-grey) bg-(--terciary-grey)/25 text-(--primary-grey) text-(--primary-grey)",
  unset:
    "border-(--secondary-grey) bg-(--terciary-grey)/25 text-(--primary-grey) text-(--primary-grey)",
};
