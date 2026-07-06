"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  className = "",
  children,
}: {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-lg bg-zinc-800 p-1 text-zinc-400 ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      className={`inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
        active
          ? "bg-zinc-950 text-white shadow-sm"
          : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className = "",
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");

  if (ctx.value !== value) return null;

  return <div className={className}>{children}</div>;
}