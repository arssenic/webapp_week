import { useState } from "react";

export default function Schedule({ day, activities, onUpdate, onRemove }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ time: "", theme: "" });

  const startEditing = (activity) => {
    setEditingId(activity.id);
    setForm({ time: activity.time, theme: activity.theme });
  };

  const saveEdit = (id) => {
    onUpdate(id, form);
    setEditingId(null);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-2">{day}</h2>
      {activities.length === 0 && (
        <p className="text-gray-500">No activities planned yet.</p>
      )}

      <ul className="space-y-2">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="p-3 bg-white rounded-xl shadow flex justify-between items-center"
          >
            {editingId === activity.id ? (
              <div className="flex flex-col space-y-2 w-full">
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Theme (e.g. Relaxed, Energetic)"
                  value={form.theme}
                  onChange={(e) => setForm({ ...form, theme: e.target.value })}
                  className="border p-2 rounded"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit(activity.id)}
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
                  <p className="font-semibold">{activity.name}</p>
                  <p className="text-sm text-gray-600">
                    {activity.time} • {activity.theme}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(activity)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onRemove(activity.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
