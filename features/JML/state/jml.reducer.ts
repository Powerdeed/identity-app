import type { RoleId } from "@/globals/types/user.type";
import { getISOCalendarDate } from "@/global-components/layout/date";
import type { MoveReasonCode } from "../constants/MOVE_REASONS";
import type { CurrentStage } from "../constants/PROCESS_STAGES";
import type { CurrentMoverStage } from "../constants/PROCESS_STAGES";
import type { CurrentLeaverStage } from "../constants/PROCESS_STAGES";
import type { LeaverReasonCode } from "../constants/LEAVER_REASONS";
import type {
  JMLEmploymentForm,
  JMLProvisionedUser,
  JMLSection,
  KeycloakGroup,
  LeaverExitForm,
  LeaverOffboardResult,
  KeycloakUser,
  MoveEmployeeResult,
  MoverChangeForm,
} from "../types/jml.types";

export type MoverState = {
  currentStage: CurrentMoverStage;
  search: string;
  searchResults: JMLProvisionedUser[];
  selectedUser: JMLProvisionedUser | null;
  keycloakGroups: KeycloakGroup[];
  change: MoverChangeForm;
  result: MoveEmployeeResult | null;
  isSearching: boolean;
  isLoadingSelection: boolean;
  isProcessing: boolean;
  error: string;
  successMessage: string;
};

export type LeaverState = {
  currentStage: CurrentLeaverStage;
  search: string;
  searchResults: JMLProvisionedUser[];
  selectedUser: JMLProvisionedUser | null;
  keycloakGroups: KeycloakGroup[];
  exit: LeaverExitForm;
  result: LeaverOffboardResult | null;
  isSearching: boolean;
  isLoadingSelection: boolean;
  isProcessing: boolean;
  error: string;
  successMessage: string;
};

export type JMLState = {
  currentStage: CurrentStage;
  activeSection: JMLSection;
  search: string;
  searchResults: KeycloakUser[];
  selectedKeycloakUser: KeycloakUser | null;
  provisionedUser: JMLProvisionedUser | null;
  employment: JMLEmploymentForm;
  keycloakGroups: KeycloakGroup[];
  selectedGroupIds: string[];
  existingGroupIds: string[];
  powerdeedRoles: RoleId[];
  selectedRoleIds: RoleId[];
  isSearching: boolean;
  isLoadingAccess: boolean;
  isProcessing: boolean;
  error: string;
  successMessage: string;
  mover: MoverState;
  leaver: LeaverState;
};

export type JMLAction =
  | { type: "stage/set"; stage: CurrentStage }
  | { type: "section/set"; section: JMLSection }
  | { type: "search/set"; search: string }
  | { type: "search/results"; users: KeycloakUser[] }
  | { type: "search/loading"; loading: boolean }
  | { type: "identity/select"; user: KeycloakUser }
  | { type: "profile/set"; user: JMLProvisionedUser }
  | {
      type: "employment/update";
      field: keyof JMLEmploymentForm;
      value: string;
    }
  | {
      type: "employment/department-select";
      id: string;
      code: string;
      name: string;
    }
  | { type: "employment/job-profile-select"; id: string; title: string }
  | { type: "employment/manager-select"; id: string; name: string }
  | {
      type: "access/options";
      groups: KeycloakGroup[];
      roles: RoleId[];
      existingGroupIds: string[];
    }
  | { type: "access/group-toggle"; groupId: string }
  | { type: "access/groups-persisted" }
  | { type: "access/role-toggle"; roleId: RoleId }
  | { type: "access/loading"; loading: boolean }
  | { type: "workflow/loading"; loading: boolean }
  | { type: "feedback/error"; message: string }
  | { type: "feedback/success"; message: string }
  | { type: "mover/stage-set"; stage: CurrentMoverStage }
  | { type: "mover/search-set"; search: string }
  | { type: "mover/search-results"; users: JMLProvisionedUser[] }
  | { type: "mover/search-loading"; loading: boolean }
  | { type: "mover/selection-loading"; loading: boolean }
  | {
      type: "mover/select";
      user: JMLProvisionedUser;
      groups: KeycloakGroup[];
    }
  | { type: "mover/clear-selection" }
  | {
      type: "mover/change-update";
      field: keyof MoverChangeForm;
      value: string;
    }
  | {
      type: "mover/department-select";
      id: string;
      code: string;
      name: string;
    }
  | { type: "mover/job-profile-select"; id: string; title: string }
  | { type: "mover/manager-select"; id: string; name: string }
  | { type: "mover/reason-select"; reasonCode: MoveReasonCode }
  | { type: "mover/processing"; loading: boolean }
  | { type: "mover/error"; message: string }
  | { type: "mover/success"; message: string }
  | { type: "mover/completed"; result: MoveEmployeeResult }
  | { type: "leaver/stage-set"; stage: CurrentLeaverStage }
  | { type: "leaver/search-set"; search: string }
  | { type: "leaver/search-results"; users: JMLProvisionedUser[] }
  | { type: "leaver/search-loading"; loading: boolean }
  | { type: "leaver/selection-loading"; loading: boolean }
  | {
      type: "leaver/select";
      user: JMLProvisionedUser;
      groups: KeycloakGroup[];
    }
  | { type: "leaver/clear-selection" }
  | {
      type: "leaver/exit-update";
      field: keyof LeaverExitForm;
      value: string | boolean;
    }
  | { type: "leaver/reason-select"; reasonCode: LeaverReasonCode }
  | { type: "leaver/processing"; loading: boolean }
  | { type: "leaver/error"; message: string }
  | { type: "leaver/success"; message: string }
  | { type: "leaver/completed"; result: LeaverOffboardResult };

export const initialJMLState: JMLState = {
  currentStage: "Search Keycloak",
  activeSection: "Joiner",
  search: "",
  searchResults: [],
  selectedKeycloakUser: null,
  provisionedUser: null,
  employment: {
    departmentId: "",
    departmentCode: "",
    departmentName: "",
    jobProfileId: "",
    jobTitle: "",
    employmentType: "",
    workLocation: "",
    managerId: "",
    managerName: "",
    startDate: "",
  },
  keycloakGroups: [],
  selectedGroupIds: [],
  existingGroupIds: [],
  powerdeedRoles: [],
  selectedRoleIds: [],
  isSearching: false,
  isLoadingAccess: false,
  isProcessing: false,
  error: "",
  successMessage: "",
  mover: {
    currentStage: "Select Person",
    search: "",
    searchResults: [],
    selectedUser: null,
    keycloakGroups: [],
    change: {
      departmentId: "",
      departmentCode: "",
      departmentName: "",
      jobProfileId: "",
      jobTitle: "",
      managerId: "",
      managerName: "",
      reasonCode: "",
      reasonDetails: "",
      effectiveDate: getISOCalendarDate(),
    },
    result: null,
    isSearching: false,
    isLoadingSelection: false,
    isProcessing: false,
    error: "",
    successMessage: "",
  },
  leaver: {
    currentStage: "Select Person",
    search: "",
    searchResults: [],
    selectedUser: null,
    keycloakGroups: [],
    exit: {
      reasonCode: "",
      reasonDetails: "",
      effectiveDate: getISOCalendarDate(),
      targetStatus: "suspended",
      disableKeycloak: true,
      removeKeycloakGroups: true,
    },
    result: null,
    isSearching: false,
    isLoadingSelection: false,
    isProcessing: false,
    error: "",
    successMessage: "",
  },
};

const toggleValue = <T,>(values: T[], value: T) =>
  values.includes(value)
    ? values.filter((candidate) => candidate !== value)
    : [...values, value];

export function jmlReducer(state: JMLState, action: JMLAction): JMLState {
  switch (action.type) {
    case "stage/set":
      return { ...state, currentStage: action.stage, error: "" };
    case "section/set":
      return { ...state, activeSection: action.section };
    case "search/set":
      return { ...state, search: action.search };
    case "search/results":
      return { ...state, searchResults: action.users };
    case "search/loading":
      return { ...state, isSearching: action.loading };
    case "identity/select":
      return { ...state, selectedKeycloakUser: action.user, error: "" };
    case "profile/set":
      return { ...state, provisionedUser: action.user };
    case "employment/update":
      return {
        ...state,
        employment: { ...state.employment, [action.field]: action.value },
      };
    case "employment/department-select":
      return {
        ...state,
        employment: {
          ...state.employment,
          departmentId: action.id,
          departmentCode: action.code,
          departmentName: action.name,
          jobProfileId: "",
          jobTitle: "",
        },
      };
    case "employment/job-profile-select":
      return {
        ...state,
        employment: {
          ...state.employment,
          jobProfileId: action.id,
          jobTitle: action.title,
        },
      };
    case "employment/manager-select":
      return {
        ...state,
        employment: {
          ...state.employment,
          managerId: action.id,
          managerName: action.name,
        },
      };
    case "access/options":
      return {
        ...state,
        keycloakGroups: action.groups,
        powerdeedRoles: action.roles,
        existingGroupIds: action.existingGroupIds,
        selectedGroupIds: action.existingGroupIds,
      };
    case "access/group-toggle":
      return state.existingGroupIds.includes(action.groupId)
        ? state
        : {
            ...state,
            selectedGroupIds: toggleValue(
              state.selectedGroupIds,
              action.groupId,
            ),
          };
    case "access/groups-persisted":
      return { ...state, existingGroupIds: state.selectedGroupIds };
    case "access/role-toggle":
      return {
        ...state,
        selectedRoleIds: toggleValue(state.selectedRoleIds, action.roleId),
      };
    case "access/loading":
      return { ...state, isLoadingAccess: action.loading };
    case "workflow/loading":
      return { ...state, isProcessing: action.loading };
    case "feedback/error":
      return { ...state, error: action.message };
    case "feedback/success":
      return { ...state, successMessage: action.message };
    case "mover/stage-set":
      return {
        ...state,
        mover: { ...state.mover, currentStage: action.stage, error: "" },
      };
    case "mover/search-set":
      return {
        ...state,
        mover: { ...state.mover, search: action.search },
      };
    case "mover/search-results":
      return {
        ...state,
        mover: { ...state.mover, searchResults: action.users },
      };
    case "mover/search-loading":
      return {
        ...state,
        mover: { ...state.mover, isSearching: action.loading },
      };
    case "mover/selection-loading":
      return {
        ...state,
        mover: { ...state.mover, isLoadingSelection: action.loading },
      };
    case "mover/select":
      return {
        ...state,
        mover: {
          ...state.mover,
          selectedUser: action.user,
          keycloakGroups: action.groups,
          searchResults: [],
          error: "",
          successMessage: "",
          result: null,
          change: {
            departmentId: "",
            departmentCode: "",
            departmentName: "",
            jobProfileId: "",
            jobTitle: "",
            managerId: "",
            managerName: "",
            reasonCode: "",
            reasonDetails: "",
            effectiveDate: getISOCalendarDate(),
          },
        },
      };
    case "mover/clear-selection":
      return {
        ...state,
        mover: {
          ...initialJMLState.mover,
          search: state.mover.search,
        },
      };
    case "mover/change-update":
      return {
        ...state,
        mover: {
          ...state.mover,
          change: { ...state.mover.change, [action.field]: action.value },
          error: "",
        },
      };
    case "mover/department-select":
      return {
        ...state,
        mover: {
          ...state.mover,
          change: {
            ...state.mover.change,
            departmentId: action.id,
            departmentCode: action.code,
            departmentName: action.name,
            jobProfileId: "",
            jobTitle: "",
          },
          error: "",
        },
      };
    case "mover/job-profile-select":
      return {
        ...state,
        mover: {
          ...state.mover,
          change: {
            ...state.mover.change,
            jobProfileId: action.id,
            jobTitle: action.title,
          },
          error: "",
        },
      };
    case "mover/manager-select":
      return {
        ...state,
        mover: {
          ...state.mover,
          change: {
            ...state.mover.change,
            managerId: action.id,
            managerName: action.name,
          },
          error: "",
        },
      };
    case "mover/reason-select":
      return {
        ...state,
        mover: {
          ...state.mover,
          change: {
            ...state.mover.change,
            reasonCode: action.reasonCode,
            reasonDetails:
              action.reasonCode === "other"
                ? state.mover.change.reasonDetails
                : "",
          },
          error: "",
        },
      };
    case "mover/processing":
      return {
        ...state,
        mover: { ...state.mover, isProcessing: action.loading },
      };
    case "mover/error":
      return {
        ...state,
        mover: { ...state.mover, error: action.message },
      };
    case "mover/success":
      return {
        ...state,
        mover: { ...state.mover, successMessage: action.message },
      };
    case "mover/completed":
      return {
        ...state,
        mover: {
          ...state.mover,
          selectedUser: action.result.user,
          result: action.result,
        },
      };
    case "leaver/stage-set":
      return {
        ...state,
        leaver: { ...state.leaver, currentStage: action.stage, error: "" },
      };
    case "leaver/search-set":
      return {
        ...state,
        leaver: { ...state.leaver, search: action.search },
      };
    case "leaver/search-results":
      return {
        ...state,
        leaver: { ...state.leaver, searchResults: action.users },
      };
    case "leaver/search-loading":
      return {
        ...state,
        leaver: { ...state.leaver, isSearching: action.loading },
      };
    case "leaver/selection-loading":
      return {
        ...state,
        leaver: { ...state.leaver, isLoadingSelection: action.loading },
      };
    case "leaver/select":
      return {
        ...state,
        leaver: {
          ...state.leaver,
          selectedUser: action.user,
          keycloakGroups: action.groups,
          searchResults: [],
          error: "",
          successMessage: "",
          result: null,
        },
      };
    case "leaver/clear-selection":
      return {
        ...state,
        leaver: {
          ...initialJMLState.leaver,
          search: state.leaver.search,
        },
      };
    case "leaver/exit-update":
      return {
        ...state,
        leaver: {
          ...state.leaver,
          exit: { ...state.leaver.exit, [action.field]: action.value },
          error: "",
        },
      };
    case "leaver/reason-select":
      return {
        ...state,
        leaver: {
          ...state.leaver,
          exit: {
            ...state.leaver.exit,
            reasonCode: action.reasonCode,
            reasonDetails:
              action.reasonCode === "other"
                ? state.leaver.exit.reasonDetails
                : "",
          },
          error: "",
        },
      };
    case "leaver/processing":
      return {
        ...state,
        leaver: { ...state.leaver, isProcessing: action.loading },
      };
    case "leaver/error":
      return {
        ...state,
        leaver: { ...state.leaver, error: action.message },
      };
    case "leaver/success":
      return {
        ...state,
        leaver: { ...state.leaver, successMessage: action.message },
      };
    case "leaver/completed":
      return {
        ...state,
        leaver: {
          ...state.leaver,
          selectedUser: action.result.user,
          result: action.result,
        },
      };
    default:
      return state;
  }
}
