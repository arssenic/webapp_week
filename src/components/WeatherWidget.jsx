import React, { useEffect, useState } from 'react';

// --- LIVE WEATHER WIDGET ---
const WeatherWidget = () => {
    console.log('WeatherWidget component rendering...');
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

    useEffect(() => {
        console.log('WeatherWidget useEffect triggered');
        const fetchWeatherData = async (lat, lon) => {
            console.log('fetchWeatherData called with:', lat, lon);
            try {
                const today = new Date();
                const dayOfWeek = today.getDay();
                const daysUntilSaturday = dayOfWeek === 0 ? 6 : (6 - dayOfWeek);
                const saturday = new Date(today);
                saturday.setDate(today.getDate() + daysUntilSaturday);
                const sunday = new Date(saturday);
                sunday.setDate(saturday.getDate() + 1);

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

        console.log('Requesting geolocation...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Geolocation success:', position.coords);
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.log('Geolocation error:', error);
                setError("Location access denied. Showing default forecast.");
                fetchWeatherData(21.21, 81.38); // Fallback to Bhilai, India
            }
        );
    }, []);

    console.log('WeatherWidget render - loading:', loading, 'error:', error, 'forecast:', forecast);
    
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

export default WeatherWidget;

