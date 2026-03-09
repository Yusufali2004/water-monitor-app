# 💧 Smart Water Usage Monitoring System

A dynamic, single-page web application that helps users **track daily water usage**, **visualize consumption patterns**, and **receive smart suggestions** to reduce water waste.

> Built as a college project to promote water conservation awareness through technology.

---

## 🌟 Live Demo

Simply open `index.html` in any modern browser — **no server setup required**.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Application Sections](#-application-sections)
- [Smart Analysis Logic](#-smart-analysis-logic)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Authors](#-authors)
- [License](#-license)

---

## ✨ Features

### 🔹 Water Usage Input
- Log water consumption by **date**, **liters**, and **category**
- Supported categories: 🛁 Bath, 🍳 Kitchen, 👕 Laundry, 🌱 Gardening, 🥤 Drinking
- Data is persisted in **LocalStorage** (no backend needed)
- Auto-fills today's date for quick logging

### 🔹 Interactive Dashboard
- **Total Usage** — cumulative water consumption
- **Average Daily Usage** — average liters per unique day
- **Latest Entry** — most recent log with date
- **Weekly Consumption** — current week's total
- **Bar Chart** — daily water usage trend (last 14 days)
- **Pie Chart** — category-wise consumption breakdown
- All stats and charts **auto-update** on every new entry

### 🔹 Smart Water Insights (AI-Style Analysis)
- ⚠️ **High usage warning** when average exceeds 400 L/day
- ✅ **Sustainable usage** confirmation when within limits
- 📊 **Peak usage day** identification
- 🏷️ **Top category** detection
- 🚨 **Spike alerts** for days exceeding 500 L

### 🔹 Personalized Water Saving Tips
- Dynamic tips generated based on **highest usage category**
- Category-specific recommendations:
  - **Bath** → Bucket vs. shower, low-flow showerheads
  - **Kitchen** → Bowl washing, reusing water for plants
  - **Laundry** → Full loads, front-loading machines
  - **Gardening** → Drip irrigation, rainwater harvesting
  - **Drinking** → RO wastewater reuse, refillable bottles

### 🔹 Data Management
- 🗑️ **Delete individual entries** with one click
- 🔄 **Reset all data** with confirmation modal
- 📋 **Recent entries table** sorted by latest first

### 🔹 UI/UX Highlights
- 🎨 Water-themed color palette (blues & teals)
- 🪟 Glassmorphism card design with backdrop blur
- 💫 Animated header with floating bubble effects
- 🔔 Toast notifications for user feedback
- 📱 Fully responsive (desktop, tablet, mobile)
- 🧭 Sticky navigation with scroll-aware active states
- ✨ Hover animations and micro-interactions

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Application structure & semantic markup |
| **CSS3** | Custom styling, animations, glassmorphism |
| **JavaScript (ES6+)** | Application logic, DOM manipulation, LocalStorage |
| **Bootstrap 5.3** | Responsive grid, components, modal (via CDN) |
| **Bootstrap Icons** | Icon library (via CDN) |
| **Chart.js 4.4** | Bar chart & doughnut chart visualization (via CDN) |
| **Google Fonts (Inter)** | Modern typography |
| **LocalStorage API** | Client-side data persistence |

---

## 📁 Project Structure

```
water/
├── index.html      # Main HTML page (single-page app)
├── style.css       # Custom styles, animations, responsive design
├── script.js       # All application logic (CRUD, charts, analysis)
└── README.md       # Project documentation (this file)
```

- **No frameworks** — pure vanilla HTML/CSS/JS
- **No build tools** — no npm, webpack, or bundlers needed
- **No backend** — all data stored in browser LocalStorage
- **CDN-powered** — Bootstrap, Chart.js, and fonts loaded via CDN

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for loading CDN resources on first load)

### Installation

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/Yusufali2004/water-monitor-app.git 
   ```

2. **Navigate** to the project folder:
   ```bash
   cd water-monitor-app
   ```

3. **Open** `index.html` in your browser:
   - Double-click the file, **OR**
   - Right-click → Open With → Browser, **OR**
   - Use a local server:
     ```bash
     python -m http.server 8080
     ```
     Then visit `http://localhost:8080`

That's it! No build steps, no dependencies to install. ✅

---

## 📖 How to Use

1. **Add Water Usage**
   - Select a date (defaults to today)
   - Enter the liters of water used
   - Choose a category (Bath, Kitchen, Laundry, Gardening, Drinking)
   - Click **"Log Water Usage"**

2. **View Dashboard**
   - Scroll to the Dashboard section to see stat cards and charts
   - Charts automatically update with every new entry

3. **Check Insights**
   - The Smart Insights section analyzes your data
   - Provides warnings if usage is too high
   - Identifies peak days and top categories

4. **Read Tips**
   - Personalized tips appear based on your top usage categories
   - Tips are sorted by highest to lowest consumption

5. **Manage Data**
   - Click the ✕ icon on any entry to delete it
   - Click **"Reset All"** to clear all data (with confirmation)

---

## 📊 Application Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **Add Water Usage** | Input form to log date, liters, and category |
| 2 | **Recent Entries** | Table of all logged entries with delete option |
| 3 | **Dashboard** | Stat cards + Bar chart + Pie chart |
| 4 | **Smart Water Insights** | Automated analysis with warnings & alerts |
| 5 | **Water Saving Tips** | Category-based personalized recommendations |

---

## 🧠 Smart Analysis Logic

### Usage Level Detection

```
IF average daily usage > 400 liters:
   → Show WARNING with conservation suggestions
ELSE:
   → Show SUCCESS message (sustainable range)
```

### Spike Detection

```
IF any single day > 500 liters:
   → Show ALERT with specific dates flagged
```

### Category-Based Recommendations

```
Categories ranked by total consumption (highest first)
Each category triggers specific water-saving tips:

Bath (highest)     → Bucket showers, 5-min limit, low-flow heads
Kitchen (highest)  → Bowl washing, plant reuse, full dishwasher loads
Laundry (highest)  → Full loads, front-loader, rinse water reuse
Gardening (highest)→ Drip irrigation, morning watering, rainwater
Drinking (highest) → RO reuse, fridge jug, refillable bottles
```

---

## 📸 Screenshots

<img width="1895" height="884" alt="Screenshot 2026-03-10 011904" src="https://github.com/user-attachments/assets/c75a35f0-be20-418e-ac0d-19ffdfb8f555" />
<img width="1893" height="884" alt="Screenshot 2026-03-10 011930" src="https://github.com/user-attachments/assets/a72efbe8-1edb-491b-a6b2-7cc4854d0464" />
<img width="1485" height="800" alt="Screenshot 2026-03-10 012001" src="https://github.com/user-attachments/assets/93a2844e-9fee-42c7-932b-f919ae12c726" />
<img width="1116" height="433" alt="Screenshot 2026-03-10 012034" src="https://github.com/user-attachments/assets/aa1dad1f-564a-47cc-bf23-8a08532290ff" />
<img width="1100" height="430" alt="Screenshot 2026-03-10 012048" src="https://github.com/user-attachments/assets/f9d2fe91-94b3-48e7-83ac-2e60b7e25bda" />


| Section | Description |
|---------|-------------|
| Header & Form | Water-themed hero with input form |
| Dashboard | Stat cards with bar and pie charts |
| Insights | Smart analysis with warnings |
| Tips | Category-based saving recommendations |

---

## 🔮 Future Enhancements

- [ ] Export data as CSV / PDF report
- [ ] Water usage goal setting & progress tracking
- [ ] Multi-user / household support
- [ ] Dark mode toggle
- [ ] Push notification reminders
- [ ] Integration with IoT water meters
- [ ] Monthly/yearly trend comparison
- [ ] Water bill estimation based on usage

---

## 👥 Authors

| Name | Role |
|------|------|
| Md Yusuf Ali | Developer & Designer |
| Nobel V John | Concept Initiator |

---

## 📜 License

This project is created for **educational purposes** as part of a college project submission.

Feel free to use, modify, and distribute this code for learning and non-commercial purposes.

---

## 🙏 Acknowledgements

- [Bootstrap](https://getbootstrap.com/) — Responsive CSS framework
- [Chart.js](https://www.chartjs.org/) — JavaScript charting library
- [Bootstrap Icons](https://icons.getbootstrap.com/) — Icon library
- [Google Fonts](https://fonts.google.com/) — Inter typeface

---

<p align="center">
  💧 <strong>Save Water, Save Life</strong> 💧
  <br/>
  <em>Every drop counts.</em>
</p>
