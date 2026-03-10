# Setup Presence Pulse

Welcome to the Presence Pulse project! This guide will provide end-to-end instructions for developers to set up the app on their local machines, run it on an Android device, and start contributing.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **Java Development Kit (JDK)** (v17 is recommended for recent React Native projects)
- **Android Studio** (for the Android SDK, Android Virtual Device/Emulator, and build tools)
- **Git**

---

## 1. Clone the Repository

Open your terminal or command prompt and clone this repository using Git:

```bash
git clone <your-github-repo-url>
cd PresencePulse/PresencePulse
```

---

## 2. Install Dependencies

Install the project dependencies using npm (or yarn):

```bash
npm install
```

---

## 3. Configure Android Development Environment

React Native requires specific environment variables to build Android apps successfully. 

1. Open Android Studio, go to the **SDK Manager** (under Tools > SDK Manager), and ensure you have an Android SDK platform installed (API 34 or 33).
2. Set up the `ANDROID_HOME` environment variable to point to your Android SDK path.
   - On Windows, this defaults to: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
3. Add the `platform-tools` folder (inside the SDK path) to your system's `PATH` variable so you can use `adb` commands.

---

## 4. Run the Application

First, start the Metro Bundler:

```bash
npx react-native start
```

Leave that terminal running. In a new terminal window inside the project directory, build and run the Android app:

```bash
npx react-native run-android
```

This command will compile both the Javascript code and the Java native modules (such as `UsageStatsModule`), then launch the app in your connected emulator or physical Android device.

---

## 5. Required Device Settings (Crucial)

Since Presence Pulse interacts with the Android `UsageStatsManager` API natively, **you must grant the app Usage Access permissions** for the tracking to work. If you skip this, the behavior engine will not function.

1. Once the app is installed and open on your emulator or physical device.
2. Navigate to the **Settings** screen inside the Presence Pulse app and tap **App Usage Permission**.
3. Alternatively, you can go manually to your Android Device's **Settings > Security & Privacy > Usage Access** (location varies slightly by Android version).
4. Find **Presence Pulse** in the list and toggle the switch to **Allow usage tracking**.

*(Without this permission, the app will safely ignore tracking without crashing, but will not log events).*

---

## 6. Developing the Native Modules

If your work entails editing the Android native Java code:
- Open your Android Studio.
- Choose **Open an existing project** and select the `android/` folder residing inside `PresencePulse/PresencePulse`.
- Android Studio will execute a Gradle sync. 
- You can find the native codebase at `android/app/src/main/java/com/presencepulse/`. This is where `UsageStatsModule.java` and `UsageStatsPackage.java` are located.

Enjoy building Presence Pulse!
