# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PT Manager is a Vietnamese-language personal trainer management SPA. Single HTML file (~2500 lines) with embedded CSS and JavaScript.

**Tech Stack**: Vanilla JS, Firebase (Firestore + Auth), Chart.js, Lucide icons, Google Fonts

## Build & Run

No build step — pure static HTML. Serve with any HTTP server:
```bash
npx serve .
# or
python -m http.server 3000
```

Deployed on Vercel (vercel.json rewrites all routes to index.html).

## Architecture

### Data Layer
- **Firebase Firestore**: Cloud sync for clients, sessions, measurements, exercises
  - Path: `users/{userId}/clients`, `users/{userId}/sessions`, etc.
- **localStorage**: Offline fallback, keyed by `ptGymManager_{userId}`
- **`dataCache`**: In-memory store, synced between Firestore and localStorage
- **`syncToFirestore(collection, data, docId)`**: Persists to Firestore
- **`loadFromFirestore()`**: Sets up real-time listeners on clients/sessions

### State Management
- `currentUser`: Firebase auth user object
- `isFirebaseReady`: Whether user is authenticated
- `dataCache`: Central data store (clients, sessions, exercises, measurements, notifications)
- Real-time Firestore listeners auto-update `dataCache` and call `refreshAllViews()`

### Key Data Functions
- `getClients()`, `getSessions()`, `getExercises()`, `getMeasurements()`
- `addClient()`, `addSession()`, `addExercise()`
- `updateClient()`, `updateSession()`, `updateExercise()`
- `deleteClient()`, `deleteSession()`
- `generateId()`: Creates IDs like `id_{timestamp}_{random}`

### Modals
Modal system uses CSS class `active` to show/hide:
```js
openModal('modalId')  // adds 'active'
closeModal('modalId') // removes 'active'
```

### Sections (navigable via sidebar)
1. **dashboard** — Stats grid, today's sessions, quick actions
2. **clients** — Client list with CRUD, package assignment
3. **schedule** — Calendar view with session markers
4. **packages** — Subscription tiers (Basic/Standard/VIP or custom)
5. **programs** — Exercise library with video links
6. **measurements** — Body stats tracking with Chart.js
7. **nutrition** — BMR/TDEE calculator, macro planning
8. **reports** — Client progress, export to text
9. **notifications** — Session reminders

### Rendering Pattern
Each section has a render function (e.g., `renderDashboard()`, `renderClients()`) called on:
- Initial load
- Data changes via `refreshAllViews()`
- User interactions

### Forms
- `handleClientSubmit`, `handleSessionSubmit`, `handleExerciseSubmit`, `handlePackageSubmit`
- Each form has a hidden `Id` field for edit mode

### Charts (Chart.js)
- `weightChart`: Line chart for weight over time
- `measurementsChart`: Multi-line for chest/waist/hips
- `macroChart`: Doughnut for protein/carbs/fat

## Styling

- CSS variables for theming (`--bg-primary`, `--accent-primary`, etc.)
- Dark mode default, light mode via `[data-theme="light"]`
- Theme toggle stored in `localStorage`
- Responsive breakpoints: mobile (<768px), tablet (768-1023px), desktop (1024px+)
- Mobile: sidebar hidden, bottom nav visible, FAB button

## Icons
Lucide icons via CDN. Re-render with `lucide.createIcons()` after dynamic DOM changes.

## Common Patterns

### Adding a new data type
1. Add CRUD functions in data layer
2. Add to `initDB()` initial state
3. Add Firestore sync in `loadFromFirestore()` / `syncToFirestore()`
4. Create modal and render function

### Sample Data
- `getSampleClients()`, `getSampleSessions()`, `getSampleExercises()`, `getSampleMeasurements()`
- Used when localStorage is empty or first-time Firestore sync
