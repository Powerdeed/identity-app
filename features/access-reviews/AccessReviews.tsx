"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";

import { useSectionParams } from "@/app/[section]/SectionParamsContext";
import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import EmptyState from "@/global-components/ui/EmptyState";
import Loader from "@/global-components/ui/Loader";
import MetricCard from "@/global-components/ui/MetricCard";
import Notice from "@/global-components/ui/Notice";
import Selector from "@/global-components/ui/Selector";
import StatusChip from "@/global-components/ui/StatusChip";
import { SectionTitle } from "@/global-components/ui/Title";
import { getDateTimeFormatted, useGlobals } from "@/globals";
import { hasPermission, PERMISSIONS } from "@/app/auth";
import {
  getAssignmentAccessReviews,
  updateAssignmentAccessReview,
  type AssignmentAccessReview,
  type AssignmentAccessReviewStatus,
} from "./services/accessReviews";

type ReviewFilter = "all" | AssignmentAccessReviewStatus;

type DecisionState = {
  review: AssignmentAccessReview;
  status: Exclude<AssignmentAccessReviewStatus, "not_required">;
  label: string;
};

const statusTone = {
  not_required: "grey",
  pending: "yellow",
  in_review: "blue",
  completed: "green",
  waived: "purple",
} as const;

const statusLabels: Record<AssignmentAccessReviewStatus, string> = {
  not_required: "Not required",
  pending: "Pending",
  in_review: "In review",
  completed: "Completed",
  waived: "Waived",
};

const reviewStatusOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(statusLabels).map(([value, label]) => ({
    value: value as AssignmentAccessReviewStatus,
    label,
  })),
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAssignmentLabel(review: AssignmentAccessReview) {
  const department = review.assignmentHistory.department?.name;
  const jobProfile = review.assignmentHistory.jobProfile?.title;
  if (department && jobProfile) return `${department} / ${jobProfile}`;
  return department || jobProfile || "Employment assignment";
}

function getAccessSnapshot(review: AssignmentAccessReview) {
  const roles =
    review.assignmentHistory.accessSnapshot?.access?.roles?.map(
      (role) => role.roleId,
    ) ?? [];
  const permissions =
    review.assignmentHistory.accessSnapshot?.permissions ?? [];
  return [...new Set([...roles, ...permissions])];
}

function DecisionDialog({
  decision,
  isSaving,
  onCancel,
  onConfirm,
}: {
  decision: DecisionState;
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-5">
      <section className="w-full max-w-xl rounded-[10px] border border-(--terciary-grey) bg-white">
        <div className="flex items-center justify-between border-b border-(--terciary-grey) p-4">
          <h2 className="text-style__big-text text-(--primary-blue)">
            Record Review Decision
          </h2>
          <button
            type="button"
            className="buttonize p-2 text-(--primary-grey)"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <FontAwesomeIcon icon={["fas", "xmark"]} />
          </button>
        </div>
        <div className="vertical-layout__inner p-4">
          <div className="rounded-lg border border-(--terciary-grey) bg-(--terciary-grey)/10 p-3">
            <div className="text-style__small-text--bold text-(--primary-blue)">
              {decision.review.assignmentHistory.user.name}
            </div>
            <div className="text-style__small-text text-(--primary-grey)">
              {getAssignmentLabel(decision.review)}
            </div>
          </div>
          <label className="vertical-layout__inner">
            <span className="text-style__small-text--bold uppercase text-(--primary-grey)">
              Notes
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-28 rounded-lg border border-(--terciary-grey) bg-(--terciary-grey)/20 p-3 outline-none focus:border-(--secondary-blue)"
              placeholder="Document the decision or why this access still makes sense."
            />
          </label>
        </div>
        <div className="flex justify-end gap-2.5 border-t border-(--terciary-grey) p-4">
          <Button
            buttonText="Cancel"
            buttonType="light"
            clickAction={onCancel}
          />
          <Button
            buttonText={decision.label}
            disabled={isSaving}
            clickAction={() => onConfirm(notes)}
          />
        </div>
      </section>
    </div>
  );
}

export default function AccessReviews() {
  const { search: routeSearch } = useSectionParams();
  const { globalStates } = useGlobals();
  const [reviews, setReviews] = useState<AssignmentAccessReview[]>([]);
  const [status, setStatus] = useState<ReviewFilter>("all");
  const [search, setSearch] = useState(routeSearch);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [decision, setDecision] = useState<DecisionState>();

  async function loadReviews() {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await getAssignmentAccessReviews({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page,
        pageSize,
      });
      setReviews(response.reviews);
      setTotal(response.total);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load access reviews.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => setPage(1), 250);
    return () => window.clearTimeout(timeout);
  }, [search, status]);

  useEffect(() => {
    let isMounted = true;

    async function loadPage() {
      setIsLoading(true);
      setError(undefined);
      try {
        const response = await getAssignmentAccessReviews({
          search: search || undefined,
          status: status === "all" ? undefined : status,
          page,
          pageSize,
        });
        if (!isMounted) return;
        setReviews(response.reviews);
        setTotal(response.total);
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load access reviews.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, search, status]);

  const counts = useMemo(
    () => ({
      pending: reviews.filter((review) => review.status === "pending").length,
      inReview: reviews.filter((review) => review.status === "in_review")
        .length,
      completed: reviews.filter((review) => review.status === "completed")
        .length,
      waived: reviews.filter((review) => review.status === "waived").length,
    }),
    [reviews],
  );
  const canManageReviews = hasPermission(
    globalStates.user,
    PERMISSIONS.IDENTITY_ACCESS_REVIEWS_MANAGE,
  );

  async function submitDecision(notes: string) {
    if (!decision) return;
    setIsSaving(true);
    setError(undefined);
    try {
      await updateAssignmentAccessReview(decision.review.id, {
        status: decision.status,
        notes,
      });
      setDecision(undefined);
      await loadReviews();
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to update review decision.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const columns: DataTableColumn<AssignmentAccessReview>[] = [
    {
      id: "person",
      header: "PERSON",
      cell: (review) => (
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--primary-yellow-faded)/15 text-style__small-text--bold text-(--primary-yellow)">
            {initials(review.assignmentHistory.user.name)}
          </div>
          <div>
            <div className="text-style__small-text--bold text-(--primary-blue)">
              {review.assignmentHistory.user.name}
            </div>
            <div className="text-(--primary-grey)">
              {review.assignmentHistory.user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "assignment",
      header: "ASSIGNMENT",
      cell: (review) => (
        <div>
          <div>{getAssignmentLabel(review)}</div>
          <div className="text-(--primary-grey)">
            {review.assignmentHistory.reasonCode.replaceAll("_", " ")}
          </div>
        </div>
      ),
    },
    {
      id: "access",
      header: "ACCESS SNAPSHOT",
      cell: (review) => {
        const snapshot = getAccessSnapshot(review);
        return (
          <div className="flex flex-wrap gap-1.5">
            {snapshot.length
              ? snapshot.slice(0, 3).map((item) => (
                  <StatusChip key={item} tone="blue">
                    {item}
                  </StatusChip>
                ))
              : "-"}
            {snapshot.length > 3 ? (
              <StatusChip tone="grey">+{snapshot.length - 3}</StatusChip>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "reviewer",
      header: "REVIEWER",
      cell: (review) =>
        review.reviewedBy?.name || review.assignmentHistory.actor?.name || "-",
    },
    {
      id: "created",
      header: "CREATED",
      cell: (review) => (
        <time dateTime={review.createdAt}>
          {getDateTimeFormatted(review.createdAt) || "-"}
        </time>
      ),
    },
    {
      id: "status",
      header: "STATUS",
      cell: (review) => (
        <StatusChip tone={statusTone[review.status]}>
          {statusLabels[review.status]}
        </StatusChip>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
      cellClassName: "min-w-60",
      cell: (review) =>
        canManageReviews ? (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              className="buttonize rounded-lg border border-(--secondary-blue) px-2 py-1 text-style__small-text--bold text-(--secondary-blue)"
              onClick={() =>
                setDecision({
                  review,
                  status: "completed",
                  label: "Mark Completed",
                })
              }
            >
              Complete
            </button>
            <button
              type="button"
              className="buttonize rounded-lg border border-(--primary-yellow) px-2 py-1 text-style__small-text--bold text-(--primary-yellow)"
              onClick={() =>
                setDecision({
                  review,
                  status: "in_review",
                  label: "Keep In Review",
                })
              }
            >
              Review
            </button>
            <button
              type="button"
              className="buttonize rounded-lg border border-(--primary-purple) px-2 py-1 text-style__small-text--bold text-(--primary-purple)"
              onClick={() =>
                setDecision({
                  review,
                  status: "waived",
                  label: "Waive Review",
                })
              }
            >
              Waive
            </button>
          </div>
        ) : (
          <span className="text-(--primary-grey)">Read only</span>
        ),
    },
  ];

  return (
    <div className="uniform-page-display min-w-0 text-style__body">
      <SectionTitle
        title="Access Reviews"
        subtitle="Assignment access review queue created by JML lifecycle changes"
      />

      <Notice tone="info">
        This page is backed by identity-service assignment access review
        records. Periodic campaign scheduling can be added as a separate
        workflow later.
      </Notice>

      <div className="grid gap-2.5 md:grid-cols-4">
        <MetricCard
          label="Pending"
          value={counts.pending}
          description="Current page"
          tone="yellow"
        />
        <MetricCard
          label="In review"
          value={counts.inReview}
          description="Current page"
          tone="blue"
        />
        <MetricCard
          label="Completed"
          value={counts.completed}
          description="Current page"
          tone="green"
        />
        <MetricCard
          label="Waived"
          value={counts.waived}
          description="Current page"
        />
      </div>

      {error ? <Notice tone="danger">{error}</Notice> : null}

      <DataTable
        title="Assignment Reviews"
        description={
          isLoading ? (
            <div className="horizontal-layout">
              <Loader />
              <span>Loading access reviews...</span>
            </div>
          ) : (
            `${total} review${total === 1 ? "" : "s"} found`
          )
        }
        headerAside={
          <div className="min-w-42.5">
            <Selector
              options={reviewStatusOptions.map((option) => option.label)}
              selectedOption={
                status === "all"
                  ? "All statuses"
                  : statusLabels[status as AssignmentAccessReviewStatus]
              }
              setSelectedOption={(nextValue) => {
                const nextStatus = reviewStatusOptions.find(
                  (option) => option.label === nextValue,
                );

                if (nextStatus) {
                  setStatus(nextStatus.value as ReviewFilter);
                }
              }}
              selectFirstOption={false}
            />
          </div>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Filter by person, email, or reason",
        }}
        columns={columns}
        data={reviews}
        getRowId={(review) => review.id}
        minWidthClassName="min-w-280"
        emptyState={
          <EmptyState
            icon="clipboard-list"
            title="No access reviews found"
            description="Mover workflows create review records when a role or group may need confirmation after an employment change."
          />
        }
        pagination={{
          totalItems: total,
          currentPage: page,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          dataType: "reviews",
        }}
      />

      {decision ? (
        <DecisionDialog
          decision={decision}
          isSaving={isSaving}
          onCancel={() => setDecision(undefined)}
          onConfirm={submitDecision}
        />
      ) : null}
    </div>
  );
}
