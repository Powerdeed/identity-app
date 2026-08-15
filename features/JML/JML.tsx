"use client";

import JMLView from "./components/JMLView";
import JMLProvider from "./context/JMLProvider";

export default function JML() {
  return (
    <JMLProvider>
      <JMLView />
    </JMLProvider>
  );
}
