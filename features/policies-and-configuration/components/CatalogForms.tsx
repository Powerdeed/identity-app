"use client";

import { useState } from "react";
import type { SeniorityLevel } from "@/app/auth";
import Button from "@/global-components/ui/Button";
import SearchableSelect from "@/global-components/ui/SearchableSelect";
import type {
  Department,
  DepartmentInput,
  JobProfile,
  JobProfileInput,
} from "../types/organizationCatalog.types";

const SENIORITY_LEVELS: SeniorityLevel[] = [
  "intern",
  "junior",
  "mid",
  "senior",
  "lead",
  "manager",
  "director",
  "executive",
];

const fieldClassName = "input-style min-h-10 w-full";

export function DepartmentForm({
  department,
  departments,
  isSaving,
  onCancel,
  onSave,
}: {
  department?: Department;
  departments: Department[];
  isSaving: boolean;
  onCancel: () => void;
  onSave: (input: DepartmentInput) => Promise<unknown>;
}) {
  const [form, setForm] = useState<DepartmentInput>(() => ({
      code: department?.code ?? "",
      name: department?.name ?? "",
      description: department?.description ?? "",
      parentId: department?.parentId ?? null,
      sortOrder: department?.sortOrder ?? 0,
    }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await onSave(form);
    if (result) onCancel();
  };

  return (
    <form onSubmit={submit} className="vertical-layout__outer border-y border-(--terciary-grey) py-4">
      <div className="text-style__big-text text-(--primary-blue)">
        {department ? "Edit Department" : "New Department"}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="vertical-layout__inner">
          <span>CODE</span>
          <input
            required
            disabled={Boolean(department)}
            pattern="[a-z][a-z0-9_]{1,49}"
            value={form.code}
            onChange={(event) => setForm({ ...form, code: event.target.value })}
            className={fieldClassName}
          />
        </label>
        <label className="vertical-layout__inner">
          <span>NAME</span>
          <input
            required
            maxLength={120}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className={fieldClassName}
          />
        </label>
        <label className="vertical-layout__inner">
          <span>PARENT DEPARTMENT</span>
          <SearchableSelect
            value={form.parentId ?? ""}
            options={[
              { value: "", label: "No parent department" },
              ...departments
                .filter((candidate) => candidate.id !== department?.id)
                .map((candidate) => ({
                  value: candidate.id,
                  label: candidate.name,
                  description: candidate.code,
                })),
            ]}
            onChange={(parentId) => setForm({ ...form, parentId: parentId || null })}
          />
        </label>
        <label className="vertical-layout__inner">
          <span>SORT ORDER</span>
          <input
            type="number"
            min={0}
            max={100000}
            value={form.sortOrder}
            onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })}
            className={fieldClassName}
          />
        </label>
      </div>
      <label className="vertical-layout__inner">
        <span>DESCRIPTION</span>
        <textarea
          maxLength={1000}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className={`${fieldClassName} min-h-20`}
        />
      </label>
      <div className="horizontal-layout justify-end">
        <Button buttonType="light" buttonText="Cancel" clickAction={onCancel} disabled={isSaving} />
        <Button type="submit" buttonText={isSaving ? "Saving..." : "Save Department"} disabled={isSaving} />
      </div>
    </form>
  );
}

export function JobProfileForm({
  jobProfile,
  departments,
  isSaving,
  onCancel,
  onSave,
}: {
  jobProfile?: JobProfile;
  departments: Department[];
  isSaving: boolean;
  onCancel: () => void;
  onSave: (input: JobProfileInput) => Promise<unknown>;
}) {
  const [form, setForm] = useState<JobProfileInput>(() => ({
      code: jobProfile?.code ?? "",
      title: jobProfile?.title ?? "",
      departmentId: jobProfile?.departmentId ?? "",
      description: jobProfile?.description ?? "",
      seniorityLevel: jobProfile?.seniorityLevel ?? undefined,
      isPeopleManager: jobProfile?.isPeopleManager ?? false,
      sortOrder: jobProfile?.sortOrder ?? 0,
    }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await onSave(form);
    if (result) onCancel();
  };

  return (
    <form onSubmit={submit} className="vertical-layout__outer border-y border-(--terciary-grey) py-4">
      <div className="text-style__big-text text-(--primary-blue)">
        {jobProfile ? "Edit Job Profile" : "New Job Profile"}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="vertical-layout__inner">
          <span>CODE</span>
          <input
            required
            disabled={Boolean(jobProfile)}
            pattern="[a-z][a-z0-9_]{1,79}"
            value={form.code}
            onChange={(event) => setForm({ ...form, code: event.target.value })}
            className={fieldClassName}
          />
        </label>
        <label className="vertical-layout__inner">
          <span>JOB TITLE</span>
          <input
            required
            maxLength={160}
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className={fieldClassName}
          />
        </label>
        <label className="vertical-layout__inner">
          <span>DEPARTMENT</span>
          <SearchableSelect
            value={form.departmentId}
            options={departments.map((department) => ({
              value: department.id,
              label: department.name,
              description: department.code,
            }))}
            onChange={(departmentId) => setForm({ ...form, departmentId })}
          />
        </label>
        <label className="vertical-layout__inner">
          <span>SENIORITY</span>
          <SearchableSelect
            value={form.seniorityLevel ?? ""}
            options={SENIORITY_LEVELS.map((level) => ({
              value: level,
              label: level.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
            }))}
            onChange={(seniorityLevel) =>
              setForm({ ...form, seniorityLevel: seniorityLevel as SeniorityLevel })
            }
          />
        </label>
        <label className="vertical-layout__inner">
          <span>SORT ORDER</span>
          <input
            type="number"
            min={0}
            max={100000}
            value={form.sortOrder}
            onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })}
            className={fieldClassName}
          />
        </label>
        <label className="flex items-center gap-2.5 self-end pb-2">
          <input
            type="checkbox"
            checked={form.isPeopleManager}
            onChange={(event) => setForm({ ...form, isPeopleManager: event.target.checked })}
          />
          <span>PEOPLE MANAGER POSITION</span>
        </label>
      </div>
      <label className="vertical-layout__inner">
        <span>DESCRIPTION</span>
        <textarea
          maxLength={1000}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className={`${fieldClassName} min-h-20`}
        />
      </label>
      <div className="horizontal-layout justify-end">
        <Button buttonType="light" buttonText="Cancel" clickAction={onCancel} disabled={isSaving} />
        <Button type="submit" buttonText={isSaving ? "Saving..." : "Save Job Profile"} disabled={isSaving || !form.departmentId} />
      </div>
    </form>
  );
}
