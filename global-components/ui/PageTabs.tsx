"use client";

export type PageTab<T extends string> = {
  id: T;
  label: string;
};

export default function PageTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: readonly PageTab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}) {
  return (
    <div className="section-scrollbar flex max-w-full overflow-x-auto border-b border-(--terciary-grey)">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`buttonize whitespace-nowrap border-b-2 px-4 py-3 text-style__small-text--bold ${
            activeTab === tab.id
              ? "border-(--secondary-blue) text-(--secondary-blue)"
              : "border-transparent text-(--primary-grey) hover:text-(--primary-blue)"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
