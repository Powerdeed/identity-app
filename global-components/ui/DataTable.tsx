"use client";

import type { ReactNode } from "react";
import Pagination, { type PaginationProps } from "./Pagination";
import SearchBar from "./SearchBar";

export interface DataTableColumn<T> {
  id: string;
  header?: ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T, rowIndex: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface DataTableProps<T> {
  title: ReactNode;
  description?: ReactNode;
  headerAside?: ReactNode;
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T, rowIndex: number) => string;
  minWidthClassName?: string;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  pagination?: PaginationProps;
  getData?: (data: T) => void;
  search?: DataTableSearchProps;
}

const formatHeading = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const renderValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined || value === "") return "-";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (["string", "number", "bigint"].includes(typeof value)) {
    return String(value);
  }

  return "-";
};

export default function DataTable<T>({
  title,
  description,
  headerAside,
  columns,
  data,
  getRowId,
  minWidthClassName = "min-w-full",
  emptyState,
  onRowClick,
  pagination,
  getData,
  search,
}: DataTableProps<T>) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[10px] border border-(--terciary-grey) bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-(--terciary-grey) px-4 py-3">
        <div>
          <h2 className="text-style__big-text text-(--primary-blue)">
            {title}
          </h2>
          {description ? (
            <div className="text-style__small-text text-(--primary-grey)">
              {description}
            </div>
          ) : null}
        </div>

        {search || headerAside ? (
          <div className="flex w-full flex-wrap items-center justify-end gap-2.5 sm:w-auto">
            {search ? (
              <div className="w-full sm:w-72">
                <SearchBar
                  placeholder={search.placeholder ?? "Search table"}
                  val={search.value}
                  changeFunc={search.onChange}
                />
              </div>
            ) : null}
            {headerAside ? <div>{headerAside}</div> : null}
          </div>
        ) : null}
      </div>

      <div className="section-scrollbar max-w-full overflow-x-auto">
        <table
          className={`w-full border-collapse text-left ${minWidthClassName}`}
        >
          <thead className="bg-(--terciary-grey)/20">
            <tr className="border-b border-(--terciary-grey) text-style__small-text--bold text-(--primary-grey)">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-4 py-3 ${column.headerClassName || ""}`}
                >
                  {column.header ??
                    formatHeading(String(column.accessorKey ?? column.id))}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-(--terciary-grey)">
            {data.map((row, rowIndex) => (
              <tr
                key={getRowId(row, rowIndex)}
                className={`text-style__small-text duration-150 hover:bg-(--terciary-grey)/10 ${onRowClick || getData ? "cursor-pointer" : ""}`}
                onClick={() => {
                  onRowClick?.(row);
                  getData?.(row);
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`px-4 py-3 ${column.cellClassName || ""}`}
                  >
                    {column.cell
                      ? column.cell(row, rowIndex)
                      : renderValue(
                          column.accessorKey
                            ? row[column.accessorKey]
                            : undefined,
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0
        ? (emptyState ?? (
            <div className="grid min-h-44 place-items-center px-5 py-10 text-center">
              <div>
                <div className="text-style__body--bold text-(--primary-blue)">
                  No records found
                </div>

                <p className="mt-1 text-style__small-text text-(--primary-grey)">
                  There is no data available for this table.
                </p>
              </div>
            </div>
          ))
        : null}

      {pagination ? (
        <div className="border-t border-(--terciary-grey) px-4 py-3">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </section>
  );
}
