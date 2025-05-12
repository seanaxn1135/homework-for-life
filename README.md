# Homework For Life 📝✨

Homework For Life is a simple mobile application designed to help you capture your single most story-worthy moment of each day. Inspired by the "Homework for Life" exercise from Matthew Dicks' book "Storyworthy," this app provides a focused and delightful experience for building a daily habit of reflection and memory preservation.

This project is currently in its early MVP (Minimum Viable Product) / SLC (Simple, Lovable, Complete) development phase.

## Table of Contents

- [Project Philosophy](#project-philosophy)
- [Features (MVP)](#features-mvp)
- [Tech Stack](#tech-stack)
- [Screenshots (Coming Soon!)](#screenshots-coming-soon)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Running Tests](#running-tests)
- [Linting](#linting)
- [Building for Production (EAS)](#building-for-production-eas)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Project Philosophy

This application is being built with a strong emphasis on:

*   **User-Centricity:** Focusing on solving the user's core problem effectively and providing a delightful experience.
*   **Lean & Agile Principles:** Starting with a Simple, Lovable, Complete (SLC) MVP and iterating based on feedback and learning.
*   **Simplicity:** Aiming for an intuitive, uncluttered interface that makes the core task effortless.
*   **Quality:** Incorporating practices like Test-Driven Development (TDD) and clean code principles.

## Features (MVP)

The current MVP focuses on the core experience:

*   **Daily Prompt:** A gentle nudge to think about your day.
*   **Simple Entry:** A dedicated space to quickly write down your story-worthy moment.
*   **View Past Entries:** Easily look back on your recorded moments.
*   **Daily Reminder:** An optional notification to help you build the habit.
*   **Minimalist Design:** A clean and calming interface to encourage reflection.

## Tech Stack

*   **Framework:** React Native with Expo (Managed Workflow)
*   **Language:** TypeScript
*   **Navigation:** React Navigation (Bottom Tabs)
*   **State Management:** (To be determined - starting with React Context or local state)
*   **Local Storage:** (To be determined - likely AsyncStorage for MVP)
*   **Styling:** React Native StyleSheet
*   **Testing:** Jest with `@testing-library/react-native`
*   **Linting:** ESLint
*   **Icons:** `react-native-vector-icons/Ionicons`

## Screenshots (Coming Soon!)

[ Placeholder for screenshots of the app's main screens - e.g., entry screen, list view ]

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

*   [Node.js](https://nodejs.org/) (LTS version recommended - e.g., 18.x or 20.x)
*   [Yarn](https://classic.yarnpkg.com/en/docs/install) (v1.x) or npm (comes with Node.js)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/):
    ```bash
    npm install -g expo-cli
    ```
*   [Watchman](https://facebook.github.io/watchman/docs/install/) (for macOS users, recommended for better performance)
*   A mobile simulator/emulator (Xcode for iOS simulator, Android Studio for Android Emulator) or a physical device with the Expo Go app installed.
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [Your Repository URL Here - e.g., https://github.com/your-username/HomeworkForLife.git]
    cd HomeworkForLife
    ```

2.  **Install dependencies:**
    Using Yarn:
    ```bash
    yarn install
    ```
    Or using npm:
    ```bash
    npm install
    ```

### Running the Development Server

1.  **Start the Metro Bundler (Expo Development Server):**
    Using Yarn:
    ```bash
    yarn start
    ```
    Or using npm:
    ```bash
    npm start
    # Or directly:
    # npx expo start
    ```

2.  **Run on a device or simulator:**
    *   The command above will open Expo Dev Tools in your browser.
    *   **To run on a physical device:** Install the "Expo Go" app on your iOS or Android phone and scan the QR code shown in the terminal or Dev Tools.
    *   **To run on an iOS Simulator (macOS only):** Press `i` in the terminal where Metro is running.
    *   **To run on an Android Emulator:** Ensure your emulator is running, then press `a` in the terminal.

## Running Tests

This project uses Jest and `@testing-library/react-native` for testing.

1.  **Execute all tests:**
    Using Yarn:
    ```bash
    yarn test
    ```
    Or using npm:
    ```bash
    npm test
    ```

2.  **Run tests in watch mode (reruns tests on file changes):**
    Using Yarn:
    ```bash
    yarn test --watch
    ```
    Or using npm:
    ```bash
    npm test -- --watch
    ```

## Linting

ESLint is configured to help maintain code quality and consistency.

1.  **Run the linter:**
    Using Yarn:
    ```bash
    yarn lint
    ```
    Or using npm:
    ```bash
    npm run lint
    ```

## Building for Production (EAS)

This project is set up to use [Expo Application Services (EAS)](https://docs.expo.dev/build/introduction/) for building standalone app binaries.

1.  **Install EAS CLI (if you haven't already):**
    ```bash
    npm install -g eas-cli
    ```
2.  **Log in to your Expo account:**
    ```bash
    eas login
    ```
3.  **Configure your project (if not done yet):**
    ```bash
    eas project:init
    eas build:configure
    ```
4.  **Start a build:**
    For Android:
    ```bash
    eas build -p android --profile preview 
    # (or --profile production)
    ```
    For iOS:
    ```bash
    eas build -p ios --profile preview 
    # (or --profile production)
    ```
    Refer to the [EAS Build documentation](https://docs.expo.dev/build/introduction/) for more details.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
<!-- You can expand this section later with more detailed contribution guidelines -->
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
[Sean Ang] - [2025]