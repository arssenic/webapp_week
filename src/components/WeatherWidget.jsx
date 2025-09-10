import React, { useEffect, useState } from 'react';

const WeatherWidget = ({ schedule }) => {
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getWeatherInfo = (code) => {
        const info = { icon: '🤔', description: 'Unknown' };
        if ([0, 1].includes(code)) { info.icon = '☀️'; info.description = 'Clear'; }
        else if ([2].includes(code)) { info.icon = '⛅️'; info.description = 'Partly cloudy'; }
        else if ([3].includes(code)) { info.icon = '☁️'; info.description = 'Cloudy'; }
        else if ([45, 48].includes(code)) { info.icon = '🌫️'; info.description = 'Fog'; }
        else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) { info.icon = '🌧️'; info.description = 'Rain'; }
        else if ([71, 73, 75, 77, 85, 86].includes(code)) { info.icon = '❄️'; info.description = 'Snow'; }
        else if ([95, 96, 99].includes(code)) { info.icon = '⛈️'; info.description = 'Thunderstorm'; }
        return info;
    };

    const getDayName = (dayKey) => {
        const dayNames = {
            'saturday': 'Saturday',
            'sunday': 'Sunday',
            'friday': 'Friday',
            'monday': 'Monday',
            'tuesday': 'Tuesday',
            'wednesday': 'Wednesday',
            'thursday': 'Thursday'
        };
        return dayNames[dayKey.toLowerCase()] || dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
    };

    const getDateForDay = (dayName) => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        
        const dayMap = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
        };
        
        const targetDay = dayMap[dayName.toLowerCase()];
        if (targetDay === undefined) return today; // fallback for custom day names
        
        const daysUntilTarget = (targetDay - currentDay + 7) % 7;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
        
        return targetDate;
    };

    useEffect(() => {
        const fetchWeatherData = async (lat, lon) => {
            try {
                const scheduleDays = Object.keys(schedule);
                if (scheduleDays.length === 0) {
                    setForecast([]);
                    setLoading(false);
                    return;
                }

                // Get dates for all scheduled days
                const dates = scheduleDays.map(day => {
                    const date = getDateForDay(day);
                    return {
                        day,
                        date: date,
                        dateString: date.toISOString().split('T')[0]
                    };
                });

                // Sort dates chronologically
                dates.sort((a, b) => a.date - b.date);

                const startDate = dates[0].dateString;
                const endDate = dates[dates.length - 1].dateString;

                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max&timezone=auto&start_date=${startDate}&end_date=${endDate}`;
                
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Failed to fetch weather data.");
                
                const data = await response.json();
                
                // Map weather data to our scheduled days
                const weekendForecast = dates.map(({ day, dateString }) => {
                    const dataIndex = data.daily.time.indexOf(dateString);
                    if (dataIndex === -1) {
                        return {
                            day: getDayName(day),
                            temp: '—',
                            weatherInfo: { icon: '🤔', description: 'No data' }
                        };
                    }
                    
                    return {
                        day: getDayName(day),
                        temp: Math.round(data.daily.temperature_2m_max[dataIndex]),
                        weatherInfo: getWeatherInfo(data.daily.weather_code[dataIndex])
                    };
                });
                
                setForecast(weekendForecast);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                setError("Location access denied. Showing default forecast.");
                fetchWeatherData(21.21, 81.38); // Fallback to Bhilai, India
            }
        );
    }, [schedule]);
    
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-200">
            <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full mr-3"></div>
                <h3 className="font-bold text-xl text-gray-800">Weather Forecast</h3>
            </div>
            {loading && (
                <div className="text-center text-gray-600 py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    Loading forecast...
                </div>
            )}
            {error && !loading && (
                <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}
            {forecast && !loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {forecast.map((dayForecast, index) => (
                        <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-md border border-white/50 hover:shadow-lg transition-shadow">
                            <div className="font-semibold text-gray-800 mb-2">{dayForecast.day}</div>
                            <div className="text-4xl mb-2">{dayForecast.weatherInfo.icon}</div>
                            <div className="text-2xl font-bold text-indigo-600 mb-1">
                                {typeof dayForecast.temp === 'number' ? `${dayForecast.temp}°C` : dayForecast.temp}
                            </div>
                            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                {dayForecast.weatherInfo.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;