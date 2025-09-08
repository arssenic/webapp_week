import React, { useEffect, useState } from "react";
import "./index.css";

const SAMPLE_ACTIVITIES = [
  { id: "a1", title: "Brunch", cat: "Food", est: "1.5h", vibe: "Relaxed", begin: "17:00" },
  { id: "a2", title: "Hiking", cat: "Outdoors", est: "3h", vibe: "Energetic", begin: "21:00" },
  { id: "a3", title: "Movie Night", cat: "Entertainment", est: "2.5h", vibe: "Chill", begin: "18:00" },
  { id: "a4", title: "Reading", cat: "Solo", est: "1h", vibe: "Calm", begin: "17:00" },
  { id: "a5", title: "Coffee Run", cat: "Food", est: "0.5h", vibe: "Happy", begin: "19:00" },
];

function uid(prefix = "id_") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

const themeConfig = {
  default: {
    bg: "from-white to-slate-50",
    card: "bg-white",
    accent: "bg-blue-500 hover:bg-blue-600",
  },
  lazy: {
    bg: "from-pink-100 to-purple-100",
    card: "bg-pink-50",
    accent: "bg-purple-500 hover:bg-purple-600",
  },
  adventure: {
    bg: "from-green-100 to-emerald-200",
    card: "bg-green-50",
    accent: "bg-emerald-600 hover:bg-emerald-700",
  },
  family: {
    bg: "from-yellow-100 to-orange-100",
    card: "bg-yellow-50",
    accent: "bg-orange-500 hover:bg-orange-600",
  },
};

export default function App() {
  const [activities, setActivities] = useState(() => {
    try {
      const raw = localStorage.getItem("wg_activities");
      return raw ? JSON.parse(raw) : SAMPLE_ACTIVITIES;
    } catch {
      return SAMPLE_ACTIVITIES;
    }
  });

  const [schedule, setSchedule] = useState(() => {
    try {
      const raw = localStorage.getItem("wg_schedule");
      return raw ? JSON.parse(raw) : { saturday: [], sunday: [] };
    } catch {
      return { saturday: [], sunday: [] };
    }
  });

  const [selectedTheme, setSelectedTheme] = useState("default");
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ time: "", vibe: "" });

  useEffect(() => {
    localStorage.setItem("wg_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("wg_schedule", JSON.stringify(schedule));
  }, [schedule]);

  // Add a quick custom activity
  function addActivity({ title, cat = "General", est = "1h", vibe = "Neutral" }) {
    const a = { id: uid("act_"), title, cat, est, vibe };
    setActivities((s) => [a, ...s]);
    return a;
  }

  // Schedule management
  function addToSchedule(day, activity) {
    const instance = { ...activity, id: uid("sch_"), time: "09:00", vibe: activity.vibe || "Neutral" };
    setSchedule((s) => ({ ...s, [day]: [...s[day], instance] }));
  }

  function removeFromSchedule(day, activityId) {
    setSchedule((s) => ({ ...s, [day]: s[day].filter((a) => a.id !== activityId) }));
  }

  function updateScheduleItem(day, id, updates) {
    setSchedule((s) => ({
      ...s,
      [day]: s[day].map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }

  function moveWithinSchedule(day, fromIndex, toIndex) {
    setSchedule((s) => {
      const arr = [...s[day]];
      const [item] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);
      return { ...s, [day]: arr };
    });
  }

  // Drag-drop
  function onDragStart(e, payload) {
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
  }

  function onDropOnDay(e, day) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;
    const payload = JSON.parse(raw);
    if (payload.type === "activity") {
      addToSchedule(day, payload.activity);
    }
    if (payload.type === "schedule_item") {
      const { fromDay, activityId } = payload;
      const item = schedule[fromDay].find((a) => a.id === activityId);
      if (!item) return;
      removeFromSchedule(fromDay, activityId);
      addToSchedule(day, item);
    }
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  // Export
  function exportPlan() {
    const payload = { generatedAt: new Date().toISOString(), schedule };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weekendly-plan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearSchedule() {
    if (!confirm("Clear the whole schedule?")) return;
    setSchedule({ saturday: [], sunday: [] });
  }

  // Helpers
  function filteredActivities() {
    if (!filter) return activities;
    return activities.filter(
      (a) =>
        a.title.toLowerCase().includes(filter.toLowerCase()) ||
        a.cat.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Edit handling
  function startEditing(item) {
    setEditingId(item.id);
    setForm({ time: item.time || "09:00", vibe: item.vibe || "", est: item.est || "1h" });
  }

  function saveEdit(day, id) {
    updateScheduleItem(day, id, form);
    setEditingId(null);
  }

  // 🎨 Theme shortcut
  const theme = themeConfig[selectedTheme];

  return (
    <div className={`min-h-screen p-6 bg-gradient-to-br ${theme.bg}`}>
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

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activities */}
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
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs opacity-70">
                    {a.cat} · {a.est} · {a.vibe}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => addToSchedule("saturday", a)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    Sat
                  </button>
                  <button
                    onClick={() => addToSchedule("sunday", a)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    Sun
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Schedule */}
        <section className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {["saturday", "sunday"].map((day) => (
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
                          <input
                            type="time"
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                            className="border p-2 rounded"
                          />
                          <input
                            type="text"
                            placeholder="Theme / Vibe"
                            value={form.vibe}
                            onChange={(e) => setForm({ ...form, vibe: e.target.value })}
                            className="border p-2 rounded"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 1h, 2.5h)"
                            value={form.est}
                            onChange={(e) => setForm({ ...form, est: e.target.value })}
                            className="border p-2 rounded"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEdit(day, item.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-400 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
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
                              onClick={() => moveWithinSchedule(day, idx, Math.min(schedule[day].length - 1, idx + 1))}
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

          <div className={`col-span-2 ${theme.card} p-4 rounded shadow`}>
            <h4 className="font-semibold mb-2">Plan tools</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={clearSchedule} className="px-3 py-1 border rounded">
                Clear All
              </button>
              <button onClick={exportPlan} className="px-3 py-1 border rounded">
                Export JSON
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(schedule));
                  alert("Copied JSON to clipboard");
                }}
                className="px-3 py-1 border rounded"
              >
                Copy JSON
              </button>
              <button
                onClick={() =>
                  alert("Share link feature: implement by saving plan to backend or encode in URL")
                }
                className="px-3 py-1 border rounded"
              >
                Share (stub)
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto mt-6 text-sm opacity-70 text-center">
        Starter demo — extended with editable times & themes.
      </footer>
    </div>
  );
}
