import React from 'react';
import ActivityIcon from './ActivityIcon';

// Activity List component
const ActivityList = ({ theme, filter, setFilter, addActivity, deleteActivity, filteredActivities, onDragStart, addToSchedule, schedule }) => (
    <section className={`col-span-1 ${theme.card} p-4 rounded-xl shadow-lg max-h-[80vh] overflow-y-auto`}>
        <h2 className="font-bold mb-3 text-lg text-gray-700">Activities</h2>
        <div className="flex gap-2 mb-3">
            <input
                placeholder="Filter activities..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={() => {
                    const t = prompt("New activity title");
                    if (t) addActivity({ title: t });
                }}
                className={`${theme.accent} text-white px-4 py-2 rounded-lg font-semibold transition-transform transform hover:scale-105`}
            >
                + Add
            </button>
        </div>
        <ul className="space-y-2">
            {filteredActivities().map((a) => (
                <li
                    key={a.id}
                    className="p-3 rounded-lg border border-gray-200 hover:shadow-md flex items-center justify-between bg-white cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, { type: "activity", activity: a })}
                >
                    <div className="flex items-center gap-3">
                        <ActivityIcon category={a.cat} />
                        <div>
                            <div className="font-medium text-gray-800">{a.title}</div>
                            <div className="text-xs text-gray-500">
                                {a.cat} · {a.est} · {a.vibe}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center">
                        {Object.keys(schedule).map(day => (
                            <button
                                key={day}
                                onClick={() => addToSchedule(day, a)}
                                className="px-2 py-1 border rounded-md text-sm capitalize hover:bg-gray-100"
                            >
                                {day.slice(0, 3)}
                            </button>
                        ))}
                        <button 
                            onClick={() => deleteActivity(a.id)}
                            title="Delete this activity permanently"
                            className="ml-1 px-2 py-1 border border-transparent text-red-500 hover:bg-red-100 rounded-md text-sm font-bold"
                        >
                            &times;
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    </section>
);

export default ActivityList;

