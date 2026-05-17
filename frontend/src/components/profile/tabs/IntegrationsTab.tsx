import React, { useEffect, useState } from "react";
import { IntegrationKey } from "../../../types";

const INTEGRATIONS: { key: IntegrationKey; name: string; desc: string }[] = [
  { key: "google", name: "Google", desc: "Sign in with Google calendar" },
  { key: "github", name: "GitHub", desc: "Sync issues and pull requests" },
];

const IntegrationsTab: React.FC = () => {
  const [connected, setConnected] = useState<Record<IntegrationKey, boolean>>(() => {
    const saved = localStorage.getItem("profile.integrations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<Record<IntegrationKey, boolean>>;
        return { google: !!parsed.google, github: !!parsed.github };
      } catch {
        // ignore
      }
    }
    return { google: false, github: false };
  });

  useEffect(() => {
    localStorage.setItem("profile.integrations", JSON.stringify(connected));
  }, [connected]);

  const toggle = (key: IntegrationKey) =>
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-800">Integrations</h2>
        <p className="text-xs text-gray-400 mt-0.5">Connect services (mock, stored locally)</p>
      </div>

      <div className="space-y-3">
        {INTEGRATIONS.map((it) => (
          <div
            key={it.key}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{it.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{it.desc}</p>
            </div>
            <button
              onClick={() => toggle(it.key)}
              className={`text-sm font-medium rounded-lg px-4 py-2 transition-colors ${
                connected[it.key]
                  ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {connected[it.key] ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsTab;