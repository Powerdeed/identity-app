import type { User } from "@/globals/types/user.type";
import { apiRequest } from "@lib";

export type AssignmentAccessReviewStatus =
  | "not_required"
  | "pending"
  | "in_review"
  | "completed"
  | "waived";

export type AssignmentAccessReview = {
  id: string;
  status: AssignmentAccessReviewStatus;
  roleConsequences?: Record<string, unknown>;
  keycloakGroupConsequences?: Record<string, unknown>;
  notes?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: Pick<User, "id" | "name" | "email" | "username"> | null;
  createdAt: string;
  updatedAt: string;
  assignmentHistory: {
    id: string;
    effectiveDate: string;
    reasonCode: string;
    reasonDetails?: string | null;
    source: string;
    changedFields: string[];
    accessSnapshot?: {
      access?: User["access"];
      permissions?: string[];
      role?: string;
    };
    user: Pick<User, "id" | "name" | "email" | "status" | "access">;
    department?: { id: string; code: string; name: string } | null;
    jobProfile?: { id: string; code: string; title: string } | null;
    manager?: Pick<User, "id" | "name" | "email"> | null;
    actor?: Pick<User, "id" | "name" | "email"> | null;
  };
};

export type AssignmentAccessReviewPage = {
  reviews: AssignmentAccessReview[];
  total: number;
  page: number;
  pageSize: number;
};

export const getAssignmentAccessReviews = (params: {
  search?: string;
  status?: AssignmentAccessReviewStatus;
  page?: number;
  pageSize?: number;
}) =>
  apiRequest<AssignmentAccessReviewPage>({
    method: "GET",
    url: "/admin/access-reviews",
    params,
  });

export const updateAssignmentAccessReview = (
  reviewId: string,
  data: {
    status: Exclude<AssignmentAccessReviewStatus, "not_required">;
    notes?: string;
  },
) =>
  apiRequest<{ review: AssignmentAccessReview }>({
    method: "POST",
    url: `/admin/access-reviews/${reviewId}/decision`,
    data,
  });
