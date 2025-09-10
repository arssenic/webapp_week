import React from 'react';

// Plan Tools component
const PlanTools = ({ theme, clearSchedule, exportPlan, sharePlanAsText, addDay }) => (
    <div className={`md:col-span-2 ${theme.card} p-4 rounded-xl shadow-lg`}>
        <h4 className="font-bold mb-2 text-gray-700">Plan Tools</h4>
        <div className="flex flex-wrap gap-2">
            <button onClick={addDay} className="px-3 py-2 border rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600">
                + Add Day
            </button>
            <button onClick={clearSchedule} className="px-3 py-2 border rounded-lg hover:bg-red-50 text-red-600">
                Clear All
            </button>
            <button onClick={exportPlan} className="px-3 py-2 border rounded-lg hover:bg-gray-100">
                Export JSON
            </button>
            <button onClick={sharePlanAsText} className="px-3 py-2 border rounded-lg hover:bg-gray-100">
                Share as Text
            </button>
        </div>
    </div>
);

export default PlanTools;

