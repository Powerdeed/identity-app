// context
export * from "./context/GlobalContext";
export { default as GlobalProvider } from "./context/GlobalProvider";
export * from "./context/GlobalProvider";

// components
export { default as UnsavedChangesGuard } from "./components/UnsavedChangesGuard";
export * from "./components/UnsavedChangesGuard";

// conversions
export * from "./conversions/toPascalCase";
export * from "./conversions/urlConversions";

// helpers
export * from "../global-components/layout/date/utils/currentDate";
export * from "./helper functions/getRandomColor";
export * from "./helper functions/handleEmailFormat";
export * from "./helper functions/toCamelCase";
export * from "./helper functions/truncateTxt";

// constants
export * from "./constants/unsavedChangesNotice";

// hooks
export { default as useGlobals } from "./hooks/useGlobals";
export * from "./hooks/useGlobals";
export { default as useGlobalStates } from "./hooks/useGlobalStates";
export { default as useUnsavedChangesGuard } from "./hooks/useUnsavedChangesGuard";
export * from "./hooks/useUnsavedChangesGuard";
export { default as useClipboard } from "./hooks/useClipboard";
export * from "./hooks/useClipboard";
