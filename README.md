# Personal Finance Optimizer

A simple MVP web app that collects survey responses from users and logs them to a Firestore database.

## Features

- Landing page with a headline ("Find out how much you could save, instantly!") and "Start Now" button
- Login/signup with Firebase Auth (Google/email)
- Multi-step survey with progress bar
- Firestore database integration for survey responses
- Thank you page with waitlist signup

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js)

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```
   npm start
   ```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google and Email/Password providers)
3. Create a Firestore database
4. Register a web app in your Firebase project to get your configuration
5. Copy the configuration values to your `.env` file

## Deployment on Vercel

1. Push your code to a GitHub repository
2. Sign up for [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Add your environment variables (Firebase configuration)
5. Deploy your application

## Project Structure

```
personal-finance-optimizer/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Landing.js
│   │   ├── Auth.js
│   │   ├── Survey.js
│   │   ├── ThankYou.js
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── ...
│   ├── firebase/
│   │   ├── config.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── .env
├── package.json
└── README.md
```

## License

MIT