// src/components/Tabs.tsx
import { NavLink } from "react-router-dom";

interface Tab {
  to: string;
  label: string;
}

interface TabsProps {
  items: Tab[];
  className?: string;
}

export default function Tabs({ items, className = "" }: TabsProps) {
  return (
    <div className={`flex gap-6 border-b border-gray-200 mb-6 ${className}`}>
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `pb-3 -mb-px text-sm font-medium transition-colors ${
              isActive
                ? "text-gray-900 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
