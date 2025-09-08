import React, { useEffect, useState } from "react";
import {
  SunIcon,
  FilmIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Note: The import for "./index.css" is removed from this file.
// It is already correctly handled by your project's entry point (main.jsx).

// --- Reusable Components ---

// Icon component for visual richness
const ActivityIcon = ({ category }) => {
  const iconMap = {
    Outdoors: <SunIcon className="h-6 w-6 text-green-500" />,
    Entertainment: <FilmIcon className="h-6 w-6 text-purple-500" />,
    Solo: <BookOpenIcon className="h-6 w-6 text-blue-500" />,
    Food: <ShoppingBagIcon className="h-6 w-6 text-orange-500" />,
    Default: <SparklesIcon className="h-6 w-6 text-gray-400" />,
  };
  return iconMap[category] || iconMap.Default;
};

// --- LIVE WEATHER WIDGET ---
const WeatherWidget = () => {
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to get weather icon and description from WMO code
    const getWeatherInfo = (code) => {
        const info = { icon: '🤔', description: 'Unknown' };
        if ([0, 1].includes(code)) {
            info.icon = '☀️';
            info.description = 'Clear sky';
        } else if ([2].includes(code)) {
            info.icon = '⛅️';
            info.description = 'Partly cloudy';
        } else if ([3].includes(code)) {
            info.icon = '☁️';
            info.description = 'Cloudy';
        } else if ([45, 48].includes(code)) {
            info.icon = '🌫️';
            info.description = 'Fog';
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
            info.icon = '🌧️';
            info.description = 'Rain';
        } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
            info.icon = '❄️';
            info.description = 'Snow';
        } else if ([95, 96, 99].includes(code)) {
            info.icon = '⛈️';
            info.description = 'Thunderstorm';
        }
        return info;
    };

    useEffect(() => {
        const fetchWeatherData = async (lat, lon) => {
            try {
                // Calculate upcoming Saturday and Sunday
                const today = new Date();
                const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
                
                // If today is Sunday, we want the *next* weekend, not yesterday's Saturday.
                const daysUntilSaturday = dayOfWeek === 0 ? 6 : (6 - dayOfWeek);

                const saturday = new Date(today);
                saturday.setDate(today.getDate() + daysUntilSaturday);
                const sunday = new Date(saturday);
                sunday.setDate(saturday.getDate() + 1);

                // Formats a date to YYYY-MM-DD in local time, avoiding UTC conversion issues.
                const formatDate = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
                const startDate = formatDate(saturday);
                const endDate = formatDate(sunday);

                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max&timezone=auto&start_date=${startDate}&end_date=${endDate}`;
                
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Failed to fetch weather data.");
                
                const data = await response.json();
                
                const weekendForecast = data.daily.time.map((date, index) => ({
                    date,
                    day: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
                    temp: Math.round(data.daily.temperature_2m_max[index]),
                    weatherInfo: getWeatherInfo(data.daily.weather_code[index])
                }));

                setForecast(weekendForecast);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // Fallback location if user denies permission (Bhilai, India)
                    setError("Location access denied. Showing default forecast.");
                    fetchWeatherData(21.21, 81.38);
                }
            );
        };

        getLocation();
    }, []);


    return (
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2 text-gray-700">Weekend Forecast</h3>
            {loading && <div className="text-center text-gray-600">Loading forecast...</div>}
            {error && !loading && <div className="text-center text-red-500">{error}</div>}
            {forecast && !loading && (
                 <div className="flex justify-around text-gray-600">
                    {forecast.map(dayForecast => (
                        <div key={dayForecast.date} className="text-center">
                            <strong>{dayForecast.day}</strong>
                            <div className="text-2xl my-1">{dayForecast.weatherInfo.icon}</div>
                            <div>{dayForecast.temp}°C</div>
                             <div className="text-xs text-gray-500">{dayForecast.weatherInfo.description}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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
                        <button onClick={() => setSchedule(s => ({ ...s, [day]: [] }))} className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100">
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


// --- Constants ---

const SAMPLE_ACTIVITIES = [
  { id: "a1", title: "Brunch", cat: "Food", est: "1.5h", vibe: "Relaxed" },
  { id: "a2", title: "Hiking", cat: "Outdoors", est: "3h", vibe: "Energetic" },
  { id: "a3", title: "Movie Night", cat: "Entertainment", est: "2.5h", vibe: "Chill" },
  { id: "a4", title: "Reading", cat: "Solo", est: "1h", vibe: "Calm" },
  { id: "a5", title: "Coffee Run", cat: "Food", est: "0.5h", vibe: "Happy" },
];

function uid(prefix = "id_") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

const themeConfig = {
  default: {
    bg: "from-gray-100 to-slate-200",
    card: "bg-white/80 backdrop-blur-sm",
    accent: "bg-blue-500 hover:bg-blue-600",
  },
  lazy: {
    bg: "from-pink-100 to-purple-200",
    card: "bg-pink-50/80 backdrop-blur-sm",
    accent: "bg-purple-500 hover:bg-purple-600",
  },
  adventure: {
    bg: "from-green-200 to-emerald-300",
    card: "bg-green-50/80 backdrop-blur-sm",
    accent: "bg-emerald-600 hover:bg-emerald-700",
  },
  family: {
    bg: "from-yellow-100 to-orange-200",
    card: "bg-yellow-50/80 backdrop-blur-sm",
    accent: "bg-orange-500 hover:bg-orange-600",
  },
};

// --- Main App Component ---

export default function App() {
  // --- State Management ---
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
      const parsed = raw ? JSON.parse(raw) : { saturday: [], sunday: [] };
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : { saturday: [], sunday: [] };
    } catch {
      return { saturday: [], sunday: [] };
    }
  });

  const [selectedTheme, setSelectedTheme] = useState("default");
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ time: "", vibe: "", est: "" });

  // --- Effects for Persistence ---
  useEffect(() => {
    localStorage.setItem("wg_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("wg_schedule", JSON.stringify(schedule));
  }, [schedule]);


  // --- Logic and Handler Functions ---

  function addActivity({ title, cat = "General", est = "1h", vibe = "Neutral" }) {
    const a = { id: uid("act_"), title, cat, est, vibe };
    setActivities((s) => [a, ...s]);
    return a;
  }

  function deleteActivity(activityId) {
    if (window.confirm("Are you sure you want to permanently delete this activity? This cannot be undone.")) {
        setActivities(prevActivities => prevActivities.filter(a => a.id !== activityId));
    }
  }

  function addToSchedule(day, activity) {
    const instance = { ...activity, id: uid("sch_"), time: "09:00", vibe: activity.vibe || "Neutral" };
    setSchedule((s) => ({ ...s, [day]: [...(s[day] || []), instance] }));
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
      if (fromDay === day) return; // Prevent dropping in the same list for now
      const item = schedule[fromDay].find((a) => a.id === activityId);
      if (!item) return;
      removeFromSchedule(fromDay, activityId);
      addToSchedule(day, item);
    }
  }

  function allowDrop(e) {
    e.preventDefault();
  }

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

  function sharePlanAsText() {
    let planText = "My Weekendly Plan:\n\n";
    for (const day of Object.keys(schedule).sort()) {
      planText += `--- ${day.toUpperCase()} ---\n`;
      const sortedActivities = [...schedule[day]].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      if (sortedActivities.length === 0) {
        planText += "No activities planned.\n\n";
      } else {
        sortedActivities.forEach(item => {
          planText += `- ${item.time || 'All day'}: ${item.title} (${item.vibe})\n`;
        });
        planText += "\n";
      }
    }
    navigator.clipboard.writeText(planText).then(() => {
      alert("Weekend plan copied to clipboard!");
    }).catch(() => alert("Could not copy plan."));
  }

  function clearSchedule() {
    if (!window.confirm("Are you sure you want to clear the whole schedule?")) return;
    const cleared = {};
    Object.keys(schedule).forEach(day => {
        cleared[day] = [];
    });
    setSchedule(cleared);
  }
  
  function addDay() {
    const dayName = prompt("Enter the name of the new day (e.g., Friday):")?.toLowerCase().trim();
    if (dayName && !schedule[dayName]) {
      setSchedule(s => ({ ...s, [dayName]: [] }));
    } else if (dayName) {
      alert(`The day "${dayName}" already exists.`);
    }
  }

  const filteredActivities = () => {
    if (!filter) return activities;
    return activities.filter(
      (a) =>
        a.title.toLowerCase().includes(filter.toLowerCase()) ||
        a.cat.toLowerCase().includes(filter.toLowerCase())
    );
  };

  function startEditing(item) {
    setEditingId(item.id);
    setForm({ time: item.time || "09:00", vibe: item.vibe || "", est: item.est || "1h" });
  }

  function saveEdit(day, id) {
    updateScheduleItem(day, id, form);
    setEditingId(null);
  }

  // --- Render ---
  const theme = themeConfig[selectedTheme];

  return (
    <div className={`min-h-screen p-4 md:p-6 bg-gradient-to-br ${theme.bg}`}>
      <Header
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        theme={theme}
        exportPlan={exportPlan}
      />

      <div className="max-w-5xl mx-auto mb-6">
          <WeatherWidget />
      </div>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActivityList
          theme={theme}
          filter={filter}
          setFilter={setFilter}
          addActivity={addActivity}
          deleteActivity={deleteActivity}
          filteredActivities={filteredActivities}
          onDragStart={onDragStart}
          addToSchedule={addToSchedule}
          schedule={schedule}
        />
        <div className="md:col-span-2 flex flex-col gap-6">
            <ScheduleView
              schedule={schedule}
              theme={theme}
              uid={uid}
              addToSchedule={addToSchedule}
              setSchedule={setSchedule}
              allowDrop={allowDrop}
              onDropOnDay={onDropOnDay}
              editingId={editingId}
              setEditingId={setEditingId}
              form={form}
              setForm={setForm}
              saveEdit={saveEdit}
              startEditing={startEditing}
              moveWithinSchedule={moveWithinSchedule}
              removeFromSchedule={removeFromSchedule}
              onDragStart={onDragStart}
            />
            <PlanTools
                theme={theme}
                clearSchedule={clearSchedule}
                exportPlan={exportPlan}
                sharePlanAsText={sharePlanAsText}
                addDay={addDay}
            />
        </div>
      </main>

      <footer className="max-w-5xl mx-auto mt-6 text-sm text-gray-600 text-center">
        Refactored & Enhanced Weekendly App
      </footer>
    </div>
  );
}

