import React from 'react';

export default function ScheduleView({
  schedule,
  theme,
  uid,
  addToSchedule,
  setSchedule,
  allowDrop,
  onDropOnDay,
  editingId,
  setEditingId,
  form,
  setForm,
  saveEdit,
  startEditing,
  moveWithinSchedule,
  removeFromSchedule,
}) {
  return (
    <section className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.keys(schedule).map((day) => (
        <div key={day} className={`${theme.card} p-4 rounded shadow flex flex-col`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold capitalize text-lg">{day}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const a = prompt("Quick add title");
                  if (a)
                    addToSchedule(day, {
                      id: uid("sch_"),
                      title: a,
                      cat: "Custom",
                      est: "1h",
                      vibe: "Neutral",
                    });
                }}
                className={`${theme.accent} text-white px-3 py-1 rounded`}
              >
                + Add
              </button>
              <button
                onClick={() => setSchedule((s) => ({ ...s, [day]: [] }))}
                className="px-3 py-1 border rounded text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          <div
            onDragOver={allowDrop}
            onDrop={(e) => onDropOnDay(e, day)}
            className="min-h-[40vh] border-dashed border-2 border-transparent rounded p-2 transition-all"
            style={{ background: "#FBFDFF" }}
          >
            <ol className="space-y-2">
              {schedule[day].length === 0 && (
                <li className="text-sm opacity-60">Drop activities here or use the + Add</li>
              )}
              {schedule[day].map((item, idx) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(e) =>
                    onDragStart(e, { type: "schedule_item", fromDay: day, activityId: item.id })
                  }
                  className="p-3 rounded border flex items-center justify-between bg-white"
                >
                  {editingId === item.id ? (
                    <div className="flex flex-col space-y-2 w-full">
                      {/* ... edit form ... */}
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-70">
                          {item.cat} · {item.est} · {item.vibe} · {item.time}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`http://googleusercontent.com/maps/search/?api=1&query=${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 border rounded text-sm bg-blue-500 text-white"
                        >
                          Map
                        </a>
                        <button onClick={() => startEditing(item)} className="px-2 py-1 border rounded">
                          Edit
                        </button>
                        <button
                          onClick={() => moveWithinSchedule(day, idx, Math.max(0, idx - 1))}
                          className="px-2 py-1 border rounded"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() =>
                            moveWithinSchedule(day, idx, Math.min(schedule[day].length - 1, idx + 1))
                          }
                          className="px-2 py-1 border rounded"
                        >
                          ↓
                        </button>
                        <button onClick={() => removeFromSchedule(day, item.id)} className="px-2 py-1 border rounded">
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </section>
  );
}