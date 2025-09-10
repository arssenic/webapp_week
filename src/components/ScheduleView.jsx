import React from 'react';

// Schedule View component
const ScheduleView = ({ schedule, theme, uid, addToSchedule, setSchedule, allowDrop, onDropOnDay, editingId, setEditingId, form, setForm, saveEdit, startEditing, moveWithinSchedule, removeFromSchedule, onDragStart }) => (
     <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(schedule).map((day) => (
            <div key={day} className={`${theme.card} p-4 rounded-xl shadow-lg flex flex-col`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold capitalize text-lg text-gray-700">{day}</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const a = prompt("Quick add title");
                                if (a) addToSchedule(day, { id: uid("sch_"), title: a, cat: "Custom", est: "1h", vibe: "Neutral" });
                            }}
                            className={`${theme.accent} text-white px-3 py-1 rounded-lg font-semibold`}
                        >
                            +
                        </button>
                        <button
                          onClick={() =>
                            setSchedule(s => {
                              const copy = { ...s };
                              delete copy[day]; 
                              return copy;
                            })
                          }
                          className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
                        >
                          Clear
                        </button>
                    </div>
                </div>
                <div
                    onDragOver={allowDrop}
                    onDrop={(e) => onDropOnDay(e, day)}
                    className="min-h-[40vh] bg-gray-50/50 border-dashed border-2 border-gray-300 rounded-lg p-2 transition-all flex-grow"
                >
                    <ol className="space-y-2">
                        {schedule[day].length === 0 && (
                            <li className="text-sm text-gray-500 text-center py-10">Drop activities here</li>
                        )}
                        {schedule[day].map((item, idx) => (
                            <li
                                key={item.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, { type: "schedule_item", fromDay: day, activityId: item.id })}
                                className="p-3 rounded-lg border border-gray-200 flex flex-col gap-2 bg-white shadow-sm"
                            >
                                {editingId === item.id ? (
                                    <div className="flex flex-col space-y-2 w-full">
                                        <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="border p-2 rounded-lg" />
                                        <input type="text" placeholder="Theme / Vibe" value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} className="border p-2 rounded-lg" />
                                        <input type="text" placeholder="Duration (e.g. 1h, 2.5h)" value={form.est} onChange={(e) => setForm({ ...form, est: e.target.value })} className="border p-2 rounded-lg" />
                                        <div className="flex space-x-2">
                                            <button onClick={() => saveEdit(day, item.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg">Save</button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded-lg">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                   <>
                                        <div className="flex items-center justify-between">
                                             <div>
                                                <div className="font-medium text-gray-800">{item.title}</div>
                                                <div className="text-xs text-gray-500">
                                                    {item.time} · {item.est} · {item.vibe}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => startEditing(item)} className="px-2 py-1 border rounded-md text-sm">Edit</button>
                                                <button onClick={() => removeFromSchedule(day, item.id)} className="px-2 py-1 border rounded-md text-sm text-red-500">X</button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center pt-2 border-t mt-2">
                                             <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs border rounded-md bg-blue-50 text-blue-600">
                                                Map
                                            </a>
                                            <div className="flex-grow"></div>
                                            <button onClick={() => moveWithinSchedule(day, idx, Math.max(0, idx - 1))} className="px-2 py-1 border rounded-md text-sm">↑</button>
                                            <button onClick={() => moveWithinSchedule(day, idx, Math.min(schedule[day].length - 1, idx + 1))} className="px-2 py-1 border rounded-md text-sm">↓</button>
                                        </div>
                                   </>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        ))}
    </div>
);

export default ScheduleView;

