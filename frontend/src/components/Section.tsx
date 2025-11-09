// src/components/Section.tsx
import { useState } from "react";

type Props = {
  title: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export default function Section({
  title,
  caption,
  children,
  className = "",
  collapsible = false,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`section-block ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="section-title">{title}</h3>
          {caption && <p className="section-caption">{caption}</p>}
        </div>

        {collapsible && (
          <button
            onClick={() => setOpen(!open)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {open ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {(!collapsible || open) && <div className="mt-5">{children}</div>}
    </section>
  );
}
