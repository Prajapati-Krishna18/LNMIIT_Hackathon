# LNMIIT Hackathon Project: Presence Pulse 🚀

Welcome to the **Presence Pulse** repository! This project was developed as part of the LNMIIT Hackathon.

## 📱 About Presence Pulse

Presence Pulse is a React Native mobile application designed to detect unconscious phone habits (like constantly picking up the phone just to check it for 5 seconds). Instead of tracking total "Screen Time" like native OS features, we track **Behavior**. We classify these tiny interactions as **Micro-checks** and use them to calculate a user's **Presence Score**.

## 🛠️ Key Features

- **Real Phone Interaction Tracking**: A custom Android Native Module tracks real-time usage stats events (`ACTIVITY_RESUMED` and `ACTIVITY_PAUSED`) via the `UsageStatsManager` API.
- **Behavior Engine**: A robust algorithmic engine that identifies short, unconscious phone usages ("micro-checks") versus standard sessions.
- **Attention Drift Burst Detection**: Recognizes when a user falls into a loop of multiple micro-checks within a 10-minute window.
- **Dynamic Presence Score**: Decrements from 100% based on micro-checks and bursts to indicate your level of focus (High Focus, Moderate Drift, Low Focus).
- **Offline & Persistent Storage**: Integrates SQLite to store behavioral data securely directly on the local device, ensuring privacy and reliable App Launch Hydration (State Restoration).
- **Auto Data Cleanup**: Automatically tidies up session history older than 30 days to ensure performance and prevent massive storage usage.

## 🚀 Technologies Used

- **Framework**: React Native (v0.84), React 19, TypeScript
- **Storage**: SQLite (`react-native-sqlite-storage`)
- **Native Android Integrations**: Java, Android `UsageStatsManager` API
- **Build & Testing**: Metro, Jest, Babel, ESLint

## 📁 Repository Structure

- `PresencePulse/`: The core React Native application source code directory.
  - `src/`: Contains app architecture components, DB definitions, and services (e.g., `usageTrackingService.js`, `databaseService.js`, `contextEngine.js`).
  - `android/`: Custom Android native Java integration codes for system usage stats extraction (`UsageStatsModule.java`, `UsageStatsPackage.java`).
  - `What_We_Have_Implemented_Till_Now.md`: A highly detailed developer document outlining our technical journey.
  - `setup.md`: Guides for spinning up the development environment.

## 🔮 Roadmap & Future Visions

Our vision for the upcoming phases of the app:
1. **Attention Timeline Visualization**: A scrollable, dynamically populated timeline plotting when and where exactly a user drifted down into micro-checks.
2. **Adaptive Reflection Prompts**: Proactive messaging that interrupts a user entering a drift zone ("We noticed you're distracted. What are you looking for right now?").
3. **Context-Aware "Reconnect Mode"**: Triggering suggested offline grounding actions (like a 2-minute breathing exercise) after substantial drifting.
4. **Behavioral Pattern Intelligence**: Predictive, contextual wellbeing advice generated from the user's historical habits.

---

*Built with ❤️ for intentional digital wellbeing at the LNMIIT Hackathon.*
