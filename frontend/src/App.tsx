// src/App.tsx
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Reconciliation from "./pages/Reconciliation";
import DeliveryConfirmation from "./pages/DeliveryConfirmation";
import SectionThree from "./pages/SectionThree";

export default function App() {
  const timestamp =
    new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "America/Chicago",
    }) + " CT";

  const tabs = [
    { to: "/reconciliation", label: "Ship Confirmation (EDI 945) Reconciliation" },
    { to: "/delivery", label: "Delivery Confirmation" },
    { to: "/section-three", label: "NO_SONUM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Top bar */}
      <Navbar timestamp={timestamp} />

      {/* Content container */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {tabs.map(({ to, label }) => (
            <NavLink
              key={to} // <- stable key; avoids the "index is not defined" issue
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

        {/* Routes */}
        <Routes>
          {/* Default route redirects to Section 1 */}
          <Route path="/" element={<Navigate to="/reconciliation" replace />} />

          {/* Section 1 */}
          <Route path="/reconciliation" element={<Reconciliation />} />

          {/* Section 2 (stub for now) */}
          <Route path="/delivery" element={<DeliveryConfirmation />} />

          {/* Section 3 (placeholder) */}
          <Route path="/section-three" element={<SectionThree />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/reconciliation" replace />} />
        </Routes>
      </div>
    </div>
  );
}
