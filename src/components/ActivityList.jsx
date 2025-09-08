import React from 'react';
import ActivityIcon from './ActivityIcon';

export default function ActivityList({
  theme,
  filter,
  setFilter,
  addActivity,
  filteredActivities,
  onDragStart,
  addToSchedule,
}) {
  return (
    <section className={`col-span-1 ${theme.card} p-4 rounded shadow max-h-[70vh] overflow-y-auto`}>
      <h2 className="font-semibold mb-2 text-lg">Activities</h2>
      <div className="flex gap-2 mb-3">
        <input
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={() => {
            const t = prompt("New activity title");
            if (t) addActivity({ title: t });
          }}
          className={`${theme.accent} text-white px-3 py-1 rounded`}
        >
          + Add
        </button>
      </div>

      <ul className="space-y-2">
        {filteredActivities().map((a) => (
          <li
            key={a.id}
            className="p-3 rounded border hover:shadow-md flex items-center justify-between bg-white"
            draggable
            onDragStart={(e) => onDragStart(e, { type: "activity", activity: a })}
          >
            <div className="flex items-center gap-3">
              <ActivityIcon category={a.cat} />
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs opacity-70">
                  {a.cat} · {a.est} · {a.vibe}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {Object.keys(addToSchedule.schedule).map(day => (
                  <button
                    key={day}
                    onClick={() => addToSchedule.func(day, a)}
                    className="px-2 py-1 border rounded text-sm capitalize"
                  >
                    {day.slice(0, 3)}
                  </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}