import { hasPermission, PERMISSIONS } from "@/app/auth";
import { useGlobals } from "@/globals";
import { useEffect, useMemo, useState } from "react";

import {
  getWorkforceSessions,
  revokeWorkforceSession,
} from "../services/sessions";
import type {
  SessionFilter,
  SessionRow,
  WorkforceSession,
} from "../types/sessions.types";
import { toSessionRow } from "../utils/sessions";

export function useSessionsAndDevices(defaultSearch = "") {
  const { globalStates } = useGlobals();

  const [sessions, setSessions] = useState<WorkforceSession[]>([]);
  const [search, setSearch] = useState(defaultSearch);
  const [status, setStatus] = useState<SessionFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const timeout = window.setTimeout(() => setPage(1), 250);
    return () => window.clearTimeout(timeout);
  }, [search, status]);

  useEffect(() => {
    let isMounted = true;

    async function loadSessions() {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await getWorkforceSessions({
          status: status === "all" ? undefined : status,
          page,
          pageSize,
        });

        if (!isMounted) return;

        setSessions(response.sessions);
        setTotal(response.total);
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load workforce sessions.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, status]);

  const rows = useMemo<SessionRow[]>(() => {
    const query = search.trim().toLocaleLowerCase();

    const filteredSessions = sessions.filter((session) => {
      if (!query) return true;

      return (
        session.user.name.toLocaleLowerCase().includes(query) ||
        session.user.email.toLocaleLowerCase().includes(query) ||
        (session.ip ?? "").toLocaleLowerCase().includes(query)
      );
    });

    return filteredSessions.map(toSessionRow);
  }, [search, sessions]);

  const canManageSessions = hasPermission(
    globalStates.user,
    PERMISSIONS.IDENTITY_SESSIONS_MANAGE,
  );

  const activeCount = rows.filter((row) => row.status === "Active").length;

  async function revoke(row: SessionRow) {
    setIsMutating(true);
    setError(undefined);

    try {
      await revokeWorkforceSession(row.userId, row.id);
      const response = await getWorkforceSessions({
        status: status === "all" ? undefined : status,
        page,
        pageSize,
      });

      setSessions(response.sessions);
      setTotal(response.total);
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to revoke session.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  return {
    rows,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    isLoading,
    isMutating,
    error,
    canManageSessions,
    activeCount,
    revoke,
  };
}

export default useSessionsAndDevices;
