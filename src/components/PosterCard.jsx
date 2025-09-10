import React from "react";

const PosterCard = ({ schedule }) => (
  <div
    id="poster-card"
    className="w-[500px] bg-gradient-to-br from-yellow-100 via-white to-blue-100 rounded-2xl shadow-2xl p-6 font-sans"
  >
    <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">📅 My Plan</h2>
    {Object.keys(schedule).map((day) => (
      <div key={day} className="mb-4">
        <h3 className="text-lg font-semibold text-blue-700 capitalize">🌟 {day}</h3>
        <ul className="list-none ml-4">
          {schedule[day].map((item) => (
            <li key={item.id} className="text-gray-700">
              ⏰ {item.time || "—"} — <span className="font-medium">{item.title}</span> ({item.est}, {item.vibe})
            </li>
          ))}
        </ul>
      </div>
    ))}
    <p className="text-xs text-gray-500 text-center mt-6">✨ Generated with My Planner ✨</p>
  </div>
);

export default PosterCard;
