import React from 'react';
import ActivityIcon from './ActivityIcon';

const ActivityList = ({ theme, filter, setFilter, addActivity, deleteActivity, filteredActivities, onDragStart, addToSchedule, schedule }) => (
    <section className={`col-span-1 ${theme.card} p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full mr-3"></div>
            <h2 className="font-bold text-xl text-gray-800">Activity Library</h2>
        </div>
        
        <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
                <input
                    placeholder="Search activities..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all bg-white/80 backdrop-blur-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <button
                onClick={() => {
                    const t = prompt("New activity title");
                    if (t) addActivity({ title: t });
                }}
                className={`${theme.accent} text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2 whitespace-nowrap`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {filteredActivities().map((a) => (
                <div
                    key={a.id}
                    className="group bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing transform hover:scale-[1.02]"
                    draggable
                    onDragStart={(e) => onDragStart(e, { type: "activity", activity: a })}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                <ActivityIcon category={a.cat} />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-lg">{a.title}</div>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                        {a.cat}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                        {a.est}
                                    </span>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                        {a.vibe}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 ml-3">
                            <div className="flex gap-1">
                                {Object.keys(schedule).slice(0, 3).map(day => (
                                    <button
                                        key={day}
                                        onClick={() => addToSchedule(day, a)}
                                        className="px-2 py-1 text-xs border-2 border-gray-200 rounded-lg capitalize hover:bg-blue-50 hover:border-blue-300 transition-all font-medium"
                                        title={`Add to ${day}`}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                            {Object.keys(schedule).length > 3 && (
                                <div className="flex gap-1">
                                    {Object.keys(schedule).slice(3).map(day => (
                                        <button
                                            key={day}
                                            onClick={() => addToSchedule(day, a)}
                                            className="px-2 py-1 text-xs border-2 border-gray-200 rounded-lg capitalize hover:bg-blue-50 hover:border-blue-300 transition-all font-medium"
                                            title={`Add to ${day}`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button 
                                onClick={() => deleteActivity(a.id)}
                                title="Delete this activity permanently"
                                className="px-2 py-1 text-xs border-2 border-transparent text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg font-bold transition-all"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {filteredActivities().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.34c-1.292-1.292-3.292-1.292-4.584 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">No activities found</p>
                    <p className="text-sm">Try adjusting your search or add a new activity</p>
                </div>
            )}
        </div>
    </section>
);

export default ActivityList;