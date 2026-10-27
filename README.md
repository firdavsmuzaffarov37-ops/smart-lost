# FindIt AI — Premium Lost & Found Platform

**FindIt AI** is a modern, responsive, and visually stunning web application designed to help people in Uzbekistan report, locate, and reunite with lost belongings through intelligent matching and interactive geolocation mapping.

The application’s visual hierarchy and layout are inspired by the clean, card-based SaaS aesthetics of the **Voiceon** dashboard:
- Crisp white content panels with subtle borders and soft shadows
- Fixed light-gray left sidebar with active pill states and line icons
- Vibrant promotional gradient cards with micro-illustrations
- Modern typography powered by Google Fonts (Plus Jakarta Sans)
- Interactive Leaflet & OpenStreetMap integration with custom lost/found SVG markers

---

## 🚀 Technology Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Routing**: React Router v7 (`react-router-dom`)
- **Backend / Cloud DB**: Supabase (`@supabase/supabase-js`)
- **Icons**: Lucide React (`lucide-react`)
- **Interactive Maps**: Leaflet + React-Leaflet with OpenStreetMap tiles
- **Persistence**: Hybrid (Supabase Cloud Database + LocalStorage Offline-First Cache)
- **Celebration Effects**: Canvas Confetti

---

## ✨ Core Features

### 1. Main Dashboard
- **Voiceon-Style Architecture**: Left navigation sidebar, responsive top header, and spacious card-based content grid.
- **Hero Promo Banner**: *"Lost Something? Let's Find It."* with soft blue gradient, live matching score card preview, and quick report CTAs.
- **Popular Services**: 4 quick action cards for reporting lost/found items, exploring the map, and running AI matches.
- **Recent Reports Grid**: Categorized cards with real images, status badges (`LOST`, `FOUND`, `REUNITED`), location details, and optional rewards.
- **Helpful Tips & Safety Guide**: Practical guidance on safe return handoffs, identifying marks, and data privacy.

### 2. Multi-Language Support
Full live translation across three languages:
- 🇬🇧 **English** (Default)
- 🇺🇿 **O'zbekcha**
- 🇷🇺 **Русский**

### 3. Interactive Leaflet Map (`/map`)
- Live OpenStreetMap rendered with Leaflet.
- Custom SVG pins with animated pulsing rings:
  - 🔴 **Rose Pins**: Lost items
  - 🟢 **Emerald Pins**: Found items
- Split View: Toggle between full screen map or synchronized map + sidebar list.
- City switcher centered on Uzbekistan hubs: **Tashkent**, **Samarkand**, **Bukhara**, **Fergana**, **Namangan**, **Andijan**.
- Interactive popup cards with item image, date, reward, and direct detail links.

### 4. Local AI Matching Engine (`/matching`)
Heuristic comparison engine analyzing:
- **Category Similarity** (30% weight)
- **Keyword & Semantic Token Overlap** in titles and descriptions (35% weight)
- **Geographic Proximity** via Haversine distance calculations (20% weight)
- **Date Proximity Window** (15% weight)
- Displays match scores (e.g., *96% High Confidence*), detailed explanation breakdown, and a **Side-by-Side Comparison Modal**.

### 5. Report Lost & Found Belongings
- Working multi-field forms with validation and error alerts.
- Image upload with instant preview and preset sample photos for fast testing.
- Uzbekistan city and landmark pickers.
- Optional reward input and secret verification question.
- Confetti celebration and automatic LocalStorage persistence.

### 6. Safe Messaging & Chat (`/messages`)
- In-app demo messenger simulation to contact finders and owners without revealing sensitive personal contact numbers.
- Suggested safe handoff points (Metro Helpdesk, Police Information Kiosk, Mall Security).
- Instant message delivery and demo dialogue threads.

### 7. My Reports & Profile Management (`/my-reports`)
- Summary statistics: Total Reports, Active Lost Items, Active Found Items, and Potential AI Matches.
- Edit report modal (title, description, location, reward).
- One-click toggle: **Mark as Reunited**.
- Delete reports with confirmation.

### 8. Settings & Persistence (`/settings`)
- Localization language selector.
- Profile information editor.
- Notification preference toggles.
- **Reset Demo Data**: Restore default realistic Uzbekistan listings at any time.

### 9. Telegram Bot Alerts (`@FindItAi_Robot`)
- Live simulated or direct Telegram Bot API integration.
- Instant notifications when AI finds a >90% match or when a finder reaches out.
- Interactive Telegram chat preview bubble with sound effects and custom settings.

### 10. Smart QR Sticker Generator
- Generates downloadable and printable QR stickers for personal belongings (wallets, keys, bags, laptops).
- If scanned, takes the finder directly to the owner's verification page.
- Direct PNG download and Print Notice capabilities.

### 11. Escrow Reward Payout (Payme / Click)
- Secure, 0% commission reward payout flow for returning lost belongings.
- Supports both **Payme** (teal) and **Click** (blue) with 3D-Secure SMS OTP simulation and confetti celebration.

### 12. Progressive Web App (PWA)
- Installable on mobile devices (Android/iOS) and desktop browsers via `manifest.json`.
- Offline shell caching with dedicated Service Worker.

---

## 📦 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### 3. Production Build
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 🗺️ Project Structure

```
├── index.html                  # HTML template with Google Fonts and meta tags
├── package.json                # Dependencies and build scripts
├── vite.config.js              # Vite configuration with Tailwind CSS plugin
├── src/
│   ├── main.jsx                # Application entry point
│   ├── App.jsx                 # Route definitions and AppLayout shell
│   ├── index.css               # Global styles, Tailwind v4, and Leaflet CSS
│   ├── components/
│   │   ├── common/             # Sidebar, Header, ItemCard, Toast, LanguageSelector, Notifications
│   │   ├── dashboard/          # HeroPromoBanner, PopularServices, RecentReportsGrid, TipsSection
│   │   ├── map/                # LostFoundMap (Leaflet container & custom SVG markers)
│   │   └── matching/           # MatchComparisonModal
│   ├── context/
│   │   └── AppContext.jsx      # Central state, CRUD operations, translation hook, toasts
│   ├── data/
│   │   ├── initialData.js      # Sample Uzbekistan dataset (Tashkent, Samarkand, Bukhara)
│   │   └── translations.js     # Multilingual dictionaries (EN, UZ, RU)
│   ├── pages/
│   │   ├── DashboardPage.jsx   # Voiceon-inspired main dashboard
│   │   ├── LostItemsPage.jsx   # Filterable lost items directory
│   │   ├── FoundItemsPage.jsx  # Filterable found items directory
│   │   ├── ReportLostPage.jsx  # Report lost item form with preview
│   │   ├── ReportFoundPage.jsx # Report found item form with custody selection
│   │   ├── MapPage.jsx         # Interactive Leaflet map with split-view
│   │   ├── AiMatchingPage.jsx  # AI match scoring & pair discovery
│   │   ├── ItemDetailsPage.jsx # Dedicated report details with mini-map & matches
│   │   ├── MessagesPage.jsx    # Safe demo messenger
│   │   ├── MyReportsPage.jsx   # User reports management & statistics
│   │   ├── SettingsPage.jsx    # Settings, language switcher & reset demo data
│   │   ├── LoginPage.jsx       # Demo authentication
│   │   └── RegisterPage.jsx    # Account registration
│   └── services/
│       ├── aiMatchingService.js # Heuristic keyword, geo-proximity & date matching engine
│       └── storageService.js    # LocalStorage CRUD and persistence layer
```

---

## 🔒 Safety and Privacy Standard
FindIt AI promotes safe lost-and-found practices:
- **Private Data Protection**: Contact numbers and email addresses are masked by default.
- **Verification Questions**: Owners can ask identifying details (e.g., lock screen wallpaper, engraving) before meeting.
- **Public Meetups**: Always arrange handoffs in public zones such as Metro Information Desks or Police Precincts.
