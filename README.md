Weekendly ✨ — Your Personal Weekend Planner
Weekendly is a delightful, interactive web application designed to help you plan the perfect weekend. Say goodbye to decision fatigue and hello to beautifully organized, fun-filled days off.

This tool allows you to browse and select from a list of activities, drag them into your Saturday and Sunday schedule, and customize your plan with different themes and vibes. With a live weather forecast and the ability to plan for long weekends, Weekendly makes weekend planning simple, visual, and fun.

⭐ Core Features
Activity Library: A pre-populated list of common weekend activities to get you started.

Add & Delete Custom Activities: Quickly add your own activities to the library or remove ones you don't need.

Drag & Drop Scheduling: Intuitively drag activities from the library and drop them onto your weekend schedule.

Dynamic Weekend Schedule: Plan for Saturday and Sunday, with the ability to add more days (like Friday for a long weekend).

Edit in Place: Click to edit the time, vibe, and duration of any scheduled activity.

Persistence: Your plans are automatically saved to your browser's localStorage, so they'll be there when you come back.

🚀 Bonus Features Implemented
Live Weather Forecast: See the upcoming weekend's weather forecast for your current location, helping you plan better.

Visual Richness: Activities are enhanced with icons for different categories (e.g., Food, Outdoors) using Heroicons.

Personalized Themes: Switch between four visual themes (Default, Lazy, Adventurous, Family) to match your weekend's mood.

Plan Long Weekends: Easily add extra days to your schedule for holidays or long weekends.

Share & Export:

Export your plan as a JSON file.

Share a clean, text-based summary of your plan to your clipboard.

Print a hard copy of your schedule.

Google Maps Integration: Each scheduled activity has a "Map" button that opens a Google Maps search for that location.

🛠️ Tech Stack
Frontend: React.js

Build Tool: Vite

Styling: Tailwind CSS

Icons: Heroicons

Weather Data: Open-Meteo API

📁 Project Structure
The project follows a professional and scalable structure to keep the code organized and maintainable:

/src
├── assets/         # Static assets like images
├── components/     # Reusable React components
├── constants/      # App-wide constants (e.g., sample data, themes)
├── hooks/          # Custom React hooks (e.g., useLocalStorage)
├── App.jsx         # Main application component (state management)
├── index.css       # Global styles
└── main.jsx        # Application entry point

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later)

npm

Installation
Clone the repo:

git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)

Navigate to the project directory:

cd your-repository-name

Install NPM packages:

npm install

Run the development server:

npm run dev

The application will be available at http://localhost:5173 (or the next available port).

🔮 Future Enhancements
Backend Integration: Save plans to a database to allow sharing via a unique link.

Account System: Allow users to create accounts and save multiple weekend plans.

Mobile App: Develop a native mobile version for on-the-go planning.

Smarter Suggestions: Recommend activities based on the weather forecast or user's past choices.