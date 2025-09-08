import React from 'react';

export default function PlanTools({ theme, clearSchedule, exportPlan, sharePlanAsText, addDay }) {
  return (
    <div className={`col-span-2 ${theme.card} p-4 rounded shadow`}>
      <h4 className="font-semibold mb-2">Plan tools</h4>
      <div className="flex flex-wrap gap-2">
        <button onClick={addDay} className="px-3 py-1 border rounded bg-blue-100">
          + Add Day
        </button>
        <button onClick={clearSchedule} className="px-3 py-1 border rounded">
          Clear All
        </button>
        <button onClick={exportPlan} className="px-3 py-1 border rounded">
          Export JSON
        </button>
        <button
          onClick={sharePlanAsText}
          className="px-3 py-1 border rounded"
        >
          Share as Text
        </button>
      </div>
    </div>
  );
}