# Mind Empowered - Official Web Application

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An official Web Application designed and developed for **Mind Empowered** (`#MEforYouth`). 

## 🦋 About Mind Empowered
**Mind Empowered** is an organization dedicated to illuminating minds and transforming lives through mental health awareness, professional counselling, and youth empowerment. Run by passionate individuals, their goal is to provide safe spaces, build an inclusive community, and organize impactful initiatives—such as their flagship event, **Dhriti**—to prioritize mental health conversations among the youth and beyond. 

The Mind Empowered platform serves as the central digital hub for all their activities, event registrations, resources, and community engagements.

---

## 🚀 Tech Stack

The application is built using a modern, performant, and highly scalable stack designed to provide a premium user experience with complex styling and interactive elements.

### Core Architecture
- **Framework:** [React.js](https://reactjs.org/) (v18+) for building dynamic, interactive user interfaces.
- **Build Tooling:** [Vite.js](https://vitejs.dev/) for blazing fast Hot Module Replacement (HMR) and optimized production builds.
- **Routing:** [React Router v6](https://reactrouter.com/) for seamless Single Page Application (SPA) navigation.

### Styling & UI Experience
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/) paired with Vanilla CSS for custom keyframe animations and glassmorphism aesthetic.
- **Iconography:** `react-icons` for scalable, lightweight vector icons.
- **Carousels & Media:**
  - `react-slick` & `slick-carousel` for smooth content sliders (e.g., testimonials, team members).
  - `react-image-gallery`, `react-photo-view`, and `medium-zoom` for highly interactive, immersive media viewing experiences.
- **Interactions:** `react-draggable` for creating floating, draggable UI components like the accessibility tool panel.

### Specialized Integrations
- **Event Management:** [@fullcalendar/react](https://fullcalendar.io/) (with `daygrid`, `list`, and `interaction` plugins) for rendering dynamic event schedules.
- **Date Picking:** `react-calendar` & `react-datepicker`.
- **Network Requests:** `axios` for handling asynchronous data fetching and API integrations.

---

## 🌟 Key Platform Features

* **Premium UI/UX Design:** High-end, custom-designed visual aesthetics utilizing modern glassmorphism, dynamic gradients, and meticulous animations.
* **Extreme Accessibility:** A robust, deeply integrated accessibility menu providing users with control over:
  * Dynamic Font Sizing (A-, A, A+)
  * High Contrast Mode
  * Reduced Motion Overrides
  * Dyslexia-Friendly Fonts
  * Link Highlighting
  * Custom Reading Preferences (Line Height, Letter Spacing, Scale)
  * Dark Mode Toggle
  * Automated Background Ambient Music
* **True Bilingual Localization:** Seamless real-time translation and layout structure swapping between **English** and **Malayalam (മലയാളം)**.
* **Optimized Performance:** Extensive asset preloading to reduce the initial Time-to-Interactive.
* **Responsive Architecture:** Fully seamless experience scaling uniformly from mobile devices to ultrawide desktops.

---

## 📦 Project Structure

```text
me-main-website/
├── public/                 # Static assets (images, gifs, calendar config)
│   ├── brand/              # Core identity assets (Logos, mascots)
│   └── events/             # Media related to flagship events (e.g. Dhriti)
├── src/
│   ├── components/         # Reusable feature modules (hero, team, calendar, etc.)
│   ├── App.jsx             # Main Application Entry & Layout Orchestrator
│   ├── App.css             # High-level component CSS & Keyframe animations
│   ├── Navbar.jsx          # Primary UI Navigation
│   └── translations.js     # Dictionary matrix for EN <-> ML localization
└── package.json
```

## 🛠️ Development Setup

To run this project locally, execute the following commands in your terminal:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 🌐 Assets & Content Delivery
The application connects dynamically to several off-site components (Google Forms/Portals for Registrations/Volunteering) and loads media content. Ensure reliable network connectivity for full asset rendering.

---
*Created with ❤️ for Mind Empowered.*
