# Presence Pulse
Detect. Reflect. Reconnect.

Presence Pulse is a behavioral awareness mobile application that detects unconscious phone usage patterns and provides real-time attention insights to help users reconnect with intentional device use.

Unlike traditional screen-time trackers that only measure duration, Presence Pulse focuses on **micro-interaction behavior**, identifying short attention breaks, burst usage patterns, and focus drift.

## Problem Statement

Modern smartphone users repeatedly check their phones without conscious intent. These micro-checks fragment attention, reduce deep focus, and increase digital distraction.

Existing digital wellbeing tools only measure total screen time, which fails to capture **behavioral attention patterns**.

Presence Pulse introduces a **behavior-aware system** that detects and analyzes attention fragmentation in real time.

## Implemented Phases

### Phase 1 — Real Phone Interaction Tracking

Presence Pulse integrates directly with the **Android UsageStats API** to monitor real app usage behavior.

The system detects:

- App launch sessions
- Session duration
- Micro-check events (very short app visits)
- Burst interaction patterns

Micro-check detection occurs when an application session duration falls below a defined threshold (e.g. < 5 seconds).

This allows the system to identify **attention drift behavior** instead of simply tracking screen time.

Key outcomes of Phase 1:

- Real device usage tracking
- Session parsing
- Micro-check detection
- Burst interaction detection
- Presence score calculation based on behavior

### Phase 2 — Behavioral Data Persistence

To support behavioral analytics and historical insights, Presence Pulse persists detected usage patterns using **AsyncStorage**.

The persistence layer stores:

- Micro-check counts
- Burst interaction events
- Calculated presence score
- Session history

Data is stored locally and restored when the application restarts, allowing the system to maintain behavioral continuity across sessions.

Session history is structured as:

```javascript
{
  packageName,
  startTime,
  endTime,
  duration,
  type
}
```

The storage system also implements **history limits** to prevent uncontrolled data growth.

Key outcomes of Phase 2:

- Persistent behavioral tracking
- Historical session storage
- App restart state restoration
- Foundation for timeline analytics

## Technical Architecture

The system follows a modular behavioral detection pipeline:

```text
Android UsageStats API  
↓  
usageTrackingService.js  
↓  
contextEngine.js (behavior engine)  
↓  
storageService.js (AsyncStorage persistence)  
↓  
React Native UI
```

Component responsibilities:

**usageTrackingService**  
Collects real device usage events using UsageStats API.

**contextEngine**  
Processes usage events and classifies behavior patterns such as micro-checks and bursts.

**storageService**  
Handles persistence of behavioral metrics and session history.

**UI Layer**  
Displays Presence Score, interaction insights, and behavioral analytics.

## Presence Score System

Presence Pulse computes a dynamic **Presence Score** that reflects user attention stability.

The score considers:

- Frequency of micro-checks
- Burst interaction patterns
- Session continuity

Severity levels are categorized as:

- High Focus
- Moderate Drift
- Low Focus

This scoring model helps users understand how fragmented their attention is during device usage.

## Current UI Features

The application currently includes:

- Presence Score Dashboard
- Micro-check counter
- Burst interaction tracking
- Attention Insights screen
- Timeline navigation (UI prepared for Phase 3)

## Technology Stack

**Mobile Framework**  
React Native

**Language**  
JavaScript / TypeScript

**Android Integration**  
Android UsageStats API

**Data Persistence**  
AsyncStorage

**State Management**  
React Hooks

**Architecture**  
Modular behavioral processing engine

## Future Phases

**Phase 3**  
Attention Timeline Visualization

**Phase 4**  
Adaptive Reflection Prompts

**Phase 5**  
Context-aware "Reconnect Mode"

**Phase 6**  
Behavioral Pattern Intelligence

## Project Vision

Presence Pulse aims to shift digital wellbeing tools from **screen-time measurement** to **behavioral awareness systems**.

By detecting unconscious phone usage patterns, the app encourages users to become more intentional with their digital habits.

## Author

Built as part of a hackathon project exploring behavioral technology and attention-aware computing.
