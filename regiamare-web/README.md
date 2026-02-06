# Regia Mare Properties - Web Application

Modern luxury real estate SPA web application built with React, Vite, TypeScript, and Supabase.

## 🎯 Project Overview

Regia Mare Properties is a premium real estate company specializing in luxury properties on the Barcelona coast. This web application provides a modern, elegant interface for browsing properties, viewing services, and contacting the agency.

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router** - Client-side routing (Remix architecture philosophy)
- **Supabase** - Backend and database
- **CSS3** - Styling (no framework, custom design system)

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

## 🌍 Features

- **Landing Page** - Brand introduction and featured properties
- **Services Page** - 6 comprehensive services
- **Purchases Page** - Property portfolio with advanced filtering
- **Sales Page** - Lead generation and contact form
- **About Us Page** - Company information and values
- **Multilingual** - Spanish, English, French support

## 📝 Current Status

This is the first iteration focusing on layout and UI. Using mock data for demonstration.

Next steps:
- Connect to Supabase
- Add property detail pages  
- Implement search
- Add image galleries
- Connect contact forms
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
