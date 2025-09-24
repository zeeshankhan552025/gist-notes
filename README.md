# Gist Notes App

A React application for managing GitHub Gists with Firebase Authentication.

## Features

- Firebase Authentication with GitHub OAuth
- View public GitHub Gists
- Create, edit, and delete your own Gists (when authenticated)
- Search Gists by ID
- Responsive design with Ant Design components

## Firebase Authentication Setup

This application uses Firebase Authentication with GitHub OAuth to provide secure access to GitHub's Gist API.

### Prerequisites

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication and configure GitHub as a sign-in provider
3. Create a GitHub OAuth App at [https://github.com/settings/developers](https://github.com/settings/developers)

### Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### GitHub OAuth Configuration in Firebase

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable GitHub provider
3. Add your GitHub OAuth app's Client ID and Client Secret
4. Set the Authorization callback URL in your GitHub OAuth app to:
   ```
   https://your-project-id.firebaseapp.com/__/auth/handler
   ```

## Development Setup

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Authentication Features

- **Login with GitHub**: Click the "Login with GitHub" button in the header
- **Token Storage**: GitHub access tokens are securely stored in localStorage
- **Automatic Token Usage**: Authenticated API calls automatically use stored tokens
- **Scope Management**: App requests appropriate GitHub scopes (gist, read:user, public_repo)
- **Session Persistence**: Authentication state persists across browser sessions

## API Integration

The application integrates with GitHub's API to:
- Fetch public gists
- Create new gists (authenticated users)
- Update existing gists (authenticated users)
- Delete gists (authenticated users)
- Search gists by ID

## Technology Stack

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
