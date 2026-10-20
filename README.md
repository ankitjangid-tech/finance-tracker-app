# 💰 Finora — Personal Finance & Wealth Tracker

![Finora PWA](public/pwa-192x192.png)

A modern, SaaS-grade **Personal Finance Tracker** built with React 19, Vite, Tailwind CSS, Recharts, and Capacitor. Upgraded into a fully installable **Progressive Web App (PWA)** with complete offline support and a standalone **Android Native APK**.

---

## ✨ Features

- **📊 Comprehensive Financial Dashboard**:
  - Live Total Balance, Monthly Income, Monthly Expense, and Net Flow cards.
  - Interactive Cash Flow Bar Chart (monthly income vs. expense breakdown).
  - Expense Category Doughnut Chart with responsive legends.
  - Recent transactions list with search, category filtering, and instant status pills.

- **💳 Full Transaction CRUD & Management**:
  - Add, edit, and delete transactions seamlessly.
  - Smart categorization (Salary, Freelance, Food, Shopping, Transport, Housing, Entertainment, etc.).
  - Date filtering (This Month, Last 30 Days, Year-to-Date, All Time).
  - Search by note, category, or amount.
  - Attractive empty state illustrations when no transactions match.

- **🎯 Monthly Budgets**:
  - Category-level spending limits with real-time progress bars.
  - Over-budget warnings, safe threshold alerts, and remaining budget calculation.

- **🏆 Savings Goals & Progress**:
  - Visual target trackers with deadline indicators and percentage completion.
  - Quick deposit modal to add funds to any active savings goal.

- **📈 Visual Analytics & Reports**:
  - Income vs. Expense monthly progression charts.
  - Category-by-category breakdown and spend distribution.

- **📄 RFC 4180 CSV Export**:
  - Instant one-click CSV export with UTF-8 BOM encoding for Microsoft Excel & Google Sheets.
  - Native phone integration: uses Android share dialog to save to Downloads or share directly via WhatsApp, Drive, or Gmail.

- **📲 Progressive Web App (PWA)**:
  - Installable on desktop Chrome, Edge, Android browsers, and iOS Safari.
  - Standalone mode with zero browser address bar distractions.
  - Workbox Service Worker caching the application shell for instant offline loading.
  - 100% offline functionality: All CRUD operations and CSV generation work completely offline.

- **🔒 100% Private & Device-Local**:
  - Zero backend, no API keys, no mandatory cloud accounts.
  - All financial data is encrypted in the user's isolated local browser storage (`LocalStorage`).

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA / Service Worker**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + [Workbox](https://developer.chrome.com/docs/workbox/)
- **Mobile Native Runtime**: [Capacitor 8](https://capacitorjs.com/) (Android SDK 34 / 35 / 36)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/ankitjangid-tech/finance-tracker-app.git
cd finance-tracker-app
npm install
```

### 2. Run Locally in Development Mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
```

This generates an optimized production bundle in `dist/` with precached service workers and Web App Manifest.

### 4. Preview Production Build Locally

```bash
npm run preview
```

---

## 📱 Mobile App (Android APK)

The project includes native Android configuration powered by Capacitor:

```bash
# Sync web changes to Android native project
npm run android:sync

# Build Debug APK with Gradle (requires JDK 17+ and Android SDK)
cd android
./gradlew assembleDebug
```

Compiled APK output path:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🌐 Deploy to Vercel

Finora is preconfigured with `vercel.json` SPA routing rewrites:

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repository directly to [Vercel](https://vercel.com/) for automatic CI/CD deployments on every push.

---

## 📄 License

MIT License. Designed & developed with Finora.
