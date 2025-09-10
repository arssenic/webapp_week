import React from 'react';

const ScheduleView = ({ schedule, theme, uid, addToSchedule, setSchedule, allowDrop, onDropOnDay, editingId, setEditingId, form, setForm, saveEdit, startEditing, moveWithinSchedule, removeFromSchedule, onDragStart }) => (
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(schedule).map((day) => (
            <div key={day} className={`${theme.card} p-6 rounded-2xl shadow-xl flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full mr-3"></div>
                        <h3 className="font-bold capitalize text-xl text-gray-800">{day}</h3>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const a = prompt("Quick add activity:");
                                if (a) addToSchedule(day, { id: uid("sch_"), title: a, cat: "Custom", est: "1h", vibe: "Neutral" });
                            }}
                            className={`${theme.accent} text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-1`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                        </button>
                        <button
                            onClick={() =>
                                setSchedule(s => {
                                    const copy = { ...s };
                                    delete copy[day]; 
                                    return copy;
                                })
                            }
                            className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-xs font-semibold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                        >
                            Remove Day
                        </button>
                    </div>
                </div>
                
                <div
                    onDragOver={allowDrop}
                    onDrop={(e) => onDropOnDay(e, day)}
                    className="min-h-[50vh] bg-gradient-to-br from-gray-50/50 to-blue-50/30 border-2 border-dashed border-gray-300 rounded-2xl p-4 transition-all hover:border-blue-400 hover:bg-blue-50/20 flex-grow"
                >
                    {schedule[day].length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="font-semibold text-lg mb-2">No activities planned</p>
                            <p className="text-sm text-center">Drag activities here or click the Add button</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {schedule[day].map((item, idx) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, { type: "schedule_item", fromDay: day, activityId: item.id })}
                                    className="group bg-white/90 backdrop-blur-sm p-4 rounded-xl border-2 border-gray-100 hover:border-blue-300 shadow-md hover:shadow-lg transition-all cursor-grab active:cursor-grabbing"
                                >
                                    {editingId === item.id ? (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                                    <input 
                                                        type="time" 
                                                        value={form.time} 
                                                        onChange={(e) => setForm({ ...form, time: e.target.value })} 
                                                        className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="e.g., 1h, 2.5h" 
                                                        value={form.est} 
                                                        onChange={(e) => setForm({ ...form, est: e.target.value })} 
                                                        className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Vibe</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Theme / Vibe" 
                                                    value={form.vibe} 
                                                    onChange={(e) => setForm({ ...form, vibe: e.target.value })} 
                                                    className="w-full border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => saveEdit(day, item.id)} 
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={() => setEditingId(null)} 
                                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 text-lg">{item.title}</div>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                                                {item.time || "—"}
                                                            </span>
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                                {item.est}
                                                            </span>
                                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                                                {item.vibe}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => startEditing(item)} 
                                                        className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all"
                                                        title="Edit activity"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => removeFromSchedule(day, item.id)} 
                                                        className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 hover:border-red-300 transition-all"
                                                        title="Remove activity"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <a 
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title)}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="px-3 py-1 text-xs border-2 border-blue-200 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 hover:border-blue-300 transition-all flex items-center gap-1"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Map
                                                </a>
                                                <div className="flex gap-1">
                                                    <button 
                                                        onClick={() => moveWithinSchedule(day, idx, Math.max(0, idx - 1))} 
                                                        className="px-2 py-1 border-2 border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                                                        disabled={idx === 0}
                                                        title="Move up"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button 
                                                        onClick={() => moveWithinSchedule(day, idx, Math.min(schedule[day].length - 1, idx + 1))} 
                                                        className="px-2 py-1 border-2 border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                                                        disabled={idx === schedule[day].length - 1}
                                                        title="Move down"
                                                    >
                                                        ↓
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ))}
    </div>
);

export default ScheduleView;