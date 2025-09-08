import React from 'react';

export default function Header({ selectedTheme, setSelectedTheme, theme, exportPlan }) {
  return (
    <header className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-3xl font-extrabold">Weekendly — Weekend Planner ✨</h1>
      <div className="flex gap-2 items-center">
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="border rounded p-2"
        >
          <option value="default">Default</option>
          <option value="lazy">Lazy Weekend</option>
          <option value="adventure">Adventurous</option>
          <option value="family">Family</option>
        </select>
        <button onClick={exportPlan} className={`${theme.accent} text-white px-3 py-1 rounded shadow`}>
          Export
        </button>
        <button onClick={() => window.print()} className={`${theme.accent} text-white px-3 py-1 rounded shadow`}>
          Print
        </button>
      </div>
    </header>
  );
}