import React from "react";

const PosterCard = ({ schedule }) => (
  <div className="w-[600px] bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-2xl p-8 font-sans border border-gray-200">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        ✨ My Weekend Plan ✨
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
    </div>
    
    <div className="space-y-6">
      {Object.keys(schedule).map((day) => (
        <div key={day} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-indigo-700 capitalize mb-4 flex items-center">
            <span className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-3"></span>
            {day}
          </h3>
          {schedule[day].length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">No activities planned</p>
          ) : (
            <div className="space-y-3">
              {schedule[day].map((item, index) => (
                <div key={item.id} className="flex items-center bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-4 border-l-4 border-indigo-400">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 text-lg">{item.title}</span>
                      <span className="text-indigo-600 font-medium">{item.time || "—"}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs mr-2">
                        {item.est}
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                        {item.vibe}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
    
    <div className="text-center mt-8 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Generated on {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <p className="text-xs text-gray-400 mt-1">✨ Created with Weekendly ✨</p>
    </div>
  </div>
);

export default PosterCard;