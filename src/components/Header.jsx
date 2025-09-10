import React from 'react';

const Header = ({ selectedTheme, setSelectedTheme, theme, exportPlan }) => (
    <header className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Weekendly ✨
                    </h1>
                    <p className="text-gray-600 font-medium">Your Personal Weekend Planner</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                        <select
                            value={selectedTheme}
                            onChange={(e) => setSelectedTheme(e.target.value)}
                            className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 font-semibold text-gray-700 shadow-md focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all"
                        >
                            <option value="default">🎨 Default</option>
                            <option value="lazy">😴 Lazy Weekend</option>
                            <option value="adventure">🏔️ Adventurous</option>
                            <option value="family">👨‍👩‍👧‍👦 Family</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <button 
                        onClick={exportPlan} 
                        className={`${theme.accent} text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export
                    </button>
                    <button 
                        onClick={() => window.print()} 
                        className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                    </button>
                </div>
            </div>
        </div>
    </header>
);

export default Header;