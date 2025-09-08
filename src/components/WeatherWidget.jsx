import React from 'react';

const mockForecast = {
  saturday: { temp: '25°C', icon: '☀️' },
  sunday: { temp: '22°C', icon: '🌦️' },
};

export default function WeatherWidget() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Weekend Forecast</h3>
      <div className="flex justify-around">
        <div>
          <strong>Saturday:</strong> {mockForecast.saturday.icon} {mockForecast.saturday.temp}
        </div>
        <div>
          <strong>Sunday:</strong> {mockForecast.sunday.icon} {mockForecast.sunday.temp}
        </div>
      </div>
    </div>
  );
}