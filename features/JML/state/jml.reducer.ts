import type { RoleId } from "@/app/auth";
import type { CurrentStage } from "../constants/PROCESS_STAGES";
import type {
  JMLEmploymentForm,
  JMLProvisionedUser,
  JMLSection,
  KeycloakGroup,
  KeycloakUser,
} from "../types/jml.types";

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
  | { type: "feedback/success"; message: string };

export const initialJMLState: JMLState = {
  currentStage: "Search Keycloak",
  activeSection: "Joiner",
  search: "",
  searchResults: [],
  selectedKeycloakUser: null,
  provisionedUser: null,
  employment: {
    departmentId: "",
    teamIds: "",
    jobTitle: "",
    positionCode: "",
    seniorityLevel: "",
    employmentType: "",
    workLocation: "",
    managerId: "",
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
    default:
      return state;
  }
}
