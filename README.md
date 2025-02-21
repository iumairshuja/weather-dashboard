
# Weather Dashboard

A modern weather dashboard application providing real-time weather data and forecasts.

## Tech Stack

- TypeScript, JavaScript, HTML, CSS

## Features

- Real-time weather updates
- Weather forecasts
- Responsive UI

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Docker & Docker Compose (for containerized deployment)

### Installation (Local Development)

1. **Clone the repository**  
   ```bash
   git clone https://github.com/iumairshuja/weather-dashboard.git
   cd weather-dashboard
   ```
2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Create a `.env` file**  
   ```bash
   VITE_OPENWEATHER_KEY=your_openweather_key
   VITE_WEATHERAPI_KEY=your_weatherapi_key
   ```
4. **Start the app**  
   ```bash
   npm run dev
   ```

---

## 🐳 Running with Docker

1. **Create a `.env` file** (same as above).  
2. **Run the app**  
   ```bash
   docker-compose up -d
   ```
3. **Stop the container**  
   ```bash
   docker-compose down
   ```

---

## Scripts

- `npm run dev` - Run the dev server  
## Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit changes (`git commit -m 'Add AmazingFeature'`)  
4. Push to GitHub (`git push origin feature/AmazingFeature`)  
5. Open a PR  

## License

Private and proprietary.
```
