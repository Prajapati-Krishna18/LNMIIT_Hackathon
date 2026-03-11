# What We Have Implemented Till Now 🚀

Welcome to the **Presence Pulse** project! This document is a comprehensive guide to everything we have built so far. Whether you are a new developer joining the team or just someone curious about how this app works under the hood, this guide will walk you through our technical journey, detailing **what** we built, **how** we built it, and **what is coming next**.

---

## The Core Concept
Presence Pulse is a React Native mobile application designed to detect unconscious phone habits (like constantly picking up the phone just to check it for 5 seconds). Instead of just tracking total "Screen Time" like Apple or Google do, we track **Behavior**. We classify these tiny interactions as **Micro-checks** and use them to calculate a user's **Presence Score**.

---

## 🏗️ Phase 1: Real Phone Interaction Tracking

In the first phase, we successfully built the capability to track exactly when the user opens and closes apps on their Android phone in real-time. 

### 1. Android Native Module (Java)
React Native cannot access device usage stats out of the box. To solve this, we wrote custom Android native code.
- **What we did:** We created `UsageStatsModule.java` and `UsageStatsPackage.java` inside the Android directory.
- **How it works:** This code taps into Android's `UsageStatsManager` API. It looks precisely for Android's internal `ACTIVITY_RESUMED` (foreground) and `ACTIVITY_PAUSED` (background) events. It then packages these events (App Name, Timestamp, Event Type) and sends them across the bridge to our JavaScript code.
- **Permissions:** We added the `PACKAGE_USAGE_STATS` permission to our `AndroidManifest.xml` and created a helper function (`openUsageAccessSettings`) so users can be redirected to the Android Settings page to grant the app tracking permissions.

### 2. React Native Tracking Service (JS)
- **What we did:** We created `src/services/usageTrackingService.js`.
- **How it works:** This service exposes an asynchronous function called `getRecentUsageEvents()`. When called, it reaches into the Java module and pulls an array of all the app usage events that happened in the last 5 minutes. 

### 3. The Behavior Engine (`contextEngine.js`)
This is the "brain" of Phase 1. 
- **What we did:** We wrote an algorithm that parses the raw events coming from the tracking service. 
- **Session Parsing:** It matches a `FOREGROUND` event with a `BACKGROUND` event for a specific app (e.g., Instagram) and calculates the **duration** of that session.
- **Micro-check Detection:** If the parsed session lasted less than **20 seconds**, the engine classifies it as a **"micro-check"**. If it's longer, it's a standard "session".
- **Burst Tracking:** If a user performs multiple micro-checks within a 10-minute window (e.g., 5 micro-checks), the engine triggers an **Attention Drift Burst**.
- **Presence Score Calculation:** The engine recalculates the user's "Presence Score" (starting at 100%) by deducting points for every micro-check and burst, placing the user in categories like *High Focus*, *Moderate Drift*, or *Low Focus*.
- **Polling Loop:** Inside `App.tsx`, we set up a `setInterval` loop that asks the tracking service for new events every 5 seconds and feeds them straight into the Behavior Engine.

---

## 💾 Phase 2: Behavioral Data Persistence (SQLite)

In Phase 1, our counts (like the number of micro-checks) were stored in temporary device memory. If the user force-closed the app, all their metrics for the day reset to zero. Phase 2 solved this.

### 1. SQLite Database Integration
- **What we did:** We installed `react-native-sqlite-storage` and created `src/database/databaseService.js`.
- **How it works:** We built a local SQL database on the device named `PresencePulse.db`. Inside, we created two tables:
  1. `sessions`: Stores every single time an app is opened (Package Name, Start Time, End Time, Duration, Type).
  2. `daily_metrics`: Stores the ongoing count for the day (Date, Micro-Check Count, Burst Count, Presence Score).

### 2. Hooking the Database to the Engine
- **What we did:** We connected `contextEngine.js` to `databaseService.js`.
- **How it works:** Every time the Behavior Engine finalizes calculating a session or detects a new micro-check, it immediately runs an asynchronous SQL `INSERT` command to save that data. This process runs in the background so it never slows down the UI.

### 3. App Launch Hydration (State Restoration)
- **What we did:** We updated `App.tsx` and the Engine to "remember" the past.
- **How it works:** Now, the moment the app is opened, it talks to the database, requests today's `daily_metrics`, and restores the micro-check and burst counts inside `contextEngine.js`. You can close the app entirely, and when you open it back up, your Presence Score and tracking numbers remain perfectly accurate.

### 4. History Limits (Database Cleanup)
- **What we did:** We protected the app from using too much phone storage.
- **How it works:** Whenever the database initializes on app launch, it runs a background query (`cleanOldSessions`) that automatically deletes any individual session entries older than 30 days. This keeps the database lightweight and fast.

---

## 📱 The User Interface (`App.tsx`)

We have built a visually engaging React Native UI structure to interact with all this data:
- **Home Screen:** Displays the dynamic Presence Score ring, micro-check metrics, and the current focus category.
- **Insights Screen:** Provides deeper analytical views into the user's behavior.
- **Settings Screen:** Allows users to grant Usage Access permissions and select how strict the algorithm should be (`Strict`, `Normal`, or `Relaxed` burst thresholds).

---

## 🔭 What Are We Going to Do Next? (Future Phases)

Now that we have successfully successfully tracked real phone usage, parsed it into behavioral metrics, and securely stored it in a local database, we are ready to build user-facing features on top of this data!

### Phase 3: Attention Timeline Visualization
Currently, the SQLite database is storing hundreds of sessions accurately, but the UI is showing "dummy" hardcoded timeline text. 
**Next Step:** We will build a dynamic, scrollable timeline UI screen that actually queries the `sessions` table in the database and graphs out exactly what apps the user opened and when they triggered micro-checks throughout the day.

### Phase 4: Adaptive Reflection Prompts
When the engine detects an "Attention Drift" (a burst of micro-checks), the app will send a notification or open a proactive prompt asking the user, *"We noticed you're distracted. What are you looking for right now?"* to encourage conscious reflection.

### Phase 5: Context-Aware "Reconnect Mode"
When a user formally ends a deep-work "Social Session" or is caught drifting heavily, the app will offer specific guided offline actions—like a 2-minute breathing exercise, or a suggestion to take a short walk—bringing them back to the physical world.

### Phase 6: Behavioral Pattern Intelligence
Using historical data, the app will learn an individual's uniquely vulnerable times (e.g., *"You usually drift into micro-checks at 3:00 PM"*), providing predictive wellbeing advice instead of just reactive metrics. 

---
*Built with ❤️ for intentional digital wellbeing.*
