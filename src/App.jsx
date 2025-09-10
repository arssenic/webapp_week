import React, { useEffect, useState } from "react";
import WeatherWidget from "./components/WeatherWidget";
import Header from "./components/Header";
import ActivityList from "./components/ActivityList";
import ScheduleView from "./components/ScheduleView";
import PlanTools from "./components/PlanTools";
import Notification from './components/Notification'; 

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

    const [reminders, setReminders] = useState(() => {
    try {
      const raw = localStorage.getItem("wg_reminders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
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

    useEffect(() => {
    localStorage.setItem("wg_reminders", JSON.stringify(reminders));
  }, [reminders]);
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
    setReminders(r => [...r, { id: instance.id, title: instance.title, day }]);
  }

  function removeFromSchedule(day, activityId) {
    setSchedule((s) => ({ ...s, [day]: s[day].filter((a) => a.id !== activityId) }));
    setReminders(r => r.filter(reminder => reminder.id !== activityId));
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
    setReminders([]);
  }

  function clearReminders() {
    setReminders([]);
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
      <Notification reminders={reminders} clearReminders={clearReminders} />

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
        Weekendly App
      </footer>
    </div>
  );
}

