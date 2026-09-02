# Identity Admin Pages Architecture

This note documents the administration pages in the Powerdeed Workforce Identity app and the backend contracts they depend on.

## Source of truth

The identity-service owns identity data, employment relationships, sessions, audit events, access-review records, and the Powerdeed permission registry.

The identity-app renders this data and performs administrative actions through identity-service APIs. It should not define role bundles or permission truth locally.

Keycloak remains the source of truth for authentication, SSO, realm roles, client roles, user sessions, and group membership. The identity-service is the integration layer that exposes safe Keycloak administration endpoints to the app.

## Shared UI model

The admin pages use a common layout pattern:

- `PageTabs` for page-level tabs.
- `DataTable` for dense operational data.
- `StatusChip` for status, risk, and type labels.
- `MetricCard` for compact summary counts.
- `Notice` for info, warning, danger, and success messaging.
- `EmptyState` for intentionally empty or not-yet-integrated sections.

Keep new pages on these components unless a workflow needs a different interaction model.

## Access Governance

Route: `/access-governance`

Purpose: read-only visibility into Powerdeed roles, permissions, Keycloak roles, Keycloak groups, and application clients.

Data sources:

- `GET /permissions/registry`
- `GET /admin/access-governance/summary`
- `GET /admin/keycloak/groups`
- `GET /admin/keycloak/realm-roles`
- `GET /admin/keycloak/clients`
- `GET /admin/keycloak/clients/:clientId/roles`

Important boundary:

Role and permission definitions come from identity-service. Assignment counts also come from identity-service so the UI is not capped by a local `pageSize` limit. The app only derives presentation values such as risk labels, descriptions, and application catalog display rows.

Operational notes:

- Roles, permissions, Keycloak roles, Keycloak groups, and applications should remain searchable in the UI because these catalogs will grow.
- Do not duplicate role bundles locally. Add new permissions and role mappings to the identity-service registry first, then let this page consume the registry.

## Sessions & Devices

Route: `/sessions-and-devices`

Purpose: show active, revoked, and expired workforce sessions with search, filtering, pagination, and single-session revocation.

Data sources:

- `GET /admin/sessions`
- `DELETE /admin/users/:userId/sessions/:sessionId`

Important boundary:

Sessions are security records. Revocation must go through identity-service so audit and entitlement behavior remains centralized.

Mutation boundary:

Session revocation controls should only be visible to users with `identity.sessions.manage`. Read-only users can inspect sessions without receiving revoke actions.

## Security Activity

Route: `/security-activity`

Purpose: browse identity audit events and expose recent activity counts for lifecycle, access, session, and Keycloak changes.

Data source:

- `GET /admin/audit-events`

Important boundary:

Identity-service owns event creation, event immutability, audit persistence, search, date filtering, category filtering, and pagination. The app renders the returned page and summarizes the visible result set for presentation.

Supported query fields:

- `search`
- `category`
- `occurredFrom`
- `occurredTo`
- `targetUserId`
- `actorUserId`
- `sessionId`
- `eventType`
- `page`
- `pageSize`

## Access Reviews

Route: `/access-reviews`

Purpose: review assignment access records generated from JML lifecycle changes, especially moves that may require access recertification.

Data sources:

- `GET /admin/access-reviews`
- `POST /admin/access-reviews/:reviewId/decision`

Current decision statuses:

- `pending`
- `in_review`
- `completed`
- `waived`

Important boundary:

This is not a full campaign scheduler yet. It is the first review queue backed by assignment access-review records. A future certification campaign engine can build on the same records or introduce campaign-specific tables without changing the core identity model.

## Policies & Configuration

Route: `/policies-and-configuration`

Purpose: show the current operating policy model and manage organization catalog data used by JML flows.

Data sources:

- `GET /organization/departments`
- `POST /organization/departments`
- `PATCH /organization/departments/:id`
- `GET /organization/job-profiles`
- `POST /organization/job-profiles`
- `PATCH /organization/job-profiles/:id`

Important boundary:

Departments and job profiles are persisted catalog records. Session policy, access policy, and integration status are currently displayed as operating documentation until editable policy APIs are introduced.

## JML Workflows

Route: `/jml`

Purpose: run joiner, mover, and leaver workflows against identity-service and the Keycloak administration bridge.

Data sources:

- `GET /admin/keycloak/users`
- `POST /admin/users/provision-from-keycloak`
- `PATCH /users/:id`
- `PATCH /users/:id/access`
- `POST /users/:id/activate`
- `POST /users/:id/move`
- `POST /admin/users/:id/offboard`

Joiner boundary:

Provisioning creates or syncs a Powerdeed identity profile in `pending` status. Pending users cannot sign in to Powerdeed apps until the workflow reaches activation. If an admin refreshes or leaves midway, the Keycloak search result must allow a `pending` provisioned user to be selected again so the joiner workflow can resume and activate the same profile.

Employment boundary:

Changing the selected department must clear department-scoped selections such as job profile and manager. This prevents stale selections from another department from reaching identity-service validation.

## Mutation Permission Rules

Administrative pages should not show write controls unless the signed-in user's effective permissions allow the mutation:

- User lifecycle actions require `identity.users.manage` or `identity.jml.manage`.
- Powerdeed role and direct-permission edits require `identity.access.manage` or `identity.users.manage`.
- Keycloak group, realm-role, and client-role edits require `identity.access.manage` or `identity.users.manage`.
- Session revocation requires `identity.sessions.manage`.

These are UI gates only. The identity-service must still enforce the same permission boundaries on every mutation endpoint.

## Extension rules

When adding a new identity administration feature:

1. Put durable security, access, lifecycle, and audit behavior in identity-service.
2. Keep Keycloak-specific changes behind identity-service endpoints.
3. Use the permission registry from identity-service instead of copying roles or permissions into the app.
4. Treat employment structure as relational: `Department`, `JobProfile`, and manager relationships should be catalog-backed where possible.
5. Add audit events for lifecycle, access, session, and Keycloak administration changes.
6. Prefer expanding existing page services before introducing unrelated API clients.
