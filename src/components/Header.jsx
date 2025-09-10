import React from 'react';

// Header component
const Header = ({ selectedTheme, setSelectedTheme, theme, exportPlan }) => (
    <header className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Weekendly — Your Weekend Planner ✨</h1>
        <div className="flex gap-2 items-center">
            <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
            >
                <option value="default">Default</option>
                <option value="lazy">Lazy Weekend</option>
                <option value="adventure">Adventurous</option>
                <option value="family">Family</option>
            </select>
            <button onClick={exportPlan} className={`${theme.accent} text-white px-4 py-2 rounded-lg shadow font-semibold transition-transform transform hover:scale-105`}>
                Export
            </button>
            <button onClick={() => window.print()} className={`${theme.accent} text-white px-4 py-2 rounded-lg shadow font-semibold transition-transform transform hover:scale-105`}>
                Print
            </button>
        </div>
    </header>
);

export default Header;

