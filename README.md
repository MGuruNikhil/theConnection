# theConnection

theConnection is a comprehensive real-time chat application built with modern web technologies including React, Firebase, Vite, and shadcn/ui. It provides a seamless messaging experience with robust authentication, profile management, and user-friendly features for both registered users and guests.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

## Features

### 🔐 Authentication & Security
- **Email/Password Authentication** - Secure user registration and login
- **Email Verification** - Mandatory email verification before account access
- **Password Reset** - Forgot password functionality with email reset links
- **Guest Login** - Anonymous login for quick access without registration
- **Account Management** - Complete account deletion with data cleanup

### 💬 Real-time Messaging
- **Instant Messaging** - Real-time chat powered by Firebase Firestore
- **Message History** - Persistent chat history with automatic scrolling
- **Chat Management** - Organized chat lists with user avatars
- **Cross-Platform Chat** - Seamless messaging between registered users and guests

### 👤 Profile Management
- **Customizable Profiles** - Edit display names and profile information
- **Profile Pictures** - Upload, crop, and manage profile images
- **Image Cropping** - Built-in image cropper for perfect profile pictures
- **Avatar Management** - Change or remove profile pictures
- **Default Avatars** - Fallback profile images for new users

### 🔍 Advanced Search
- **User Discovery** - Search users by display name or email address
- **Smart Search** - Substring matching for flexible user finding
- **Guest Search** - Find and chat with guest users
- **Real-time Results** - Instant search results as you type
- **Contact Management** - Add users to chat list through search

### 🎨 User Interface & Experience
- **Dark/Light Mode** - Toggle between dark and light themes with system preference detection
- **Responsive Design** - Fully responsive layout for desktop, tablet, and mobile
- **Modern UI Components** - Built with shadcn/ui and Radix UI primitives
- **Smooth Animations** - Polished transitions and micro-interactions
- **Toast Notifications** - User-friendly feedback for all actions
- **Loading States** - Clear loading indicators for better UX

### 📱 Mobile Optimization
- **Mobile-First Design** - Optimized for mobile devices
- **Touch-Friendly Interface** - Large touch targets and intuitive gestures
- **Adaptive Layout** - Different layouts for mobile and desktop
- **Smooth Transitions** - Slide animations between chat and sidebar views

### 🛠 Technical Features
- **Real-time Synchronization** - Live updates across all connected devices
- **Cloud Storage** - Profile pictures stored in Firebase Storage
- **Data Management** - Efficient Firestore data structure
- **Context Management** - React Context for state management
- **Error Handling** - Comprehensive error handling with user feedback
- **Performance Optimized** - Lazy loading and efficient re-renders

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/MGuruNikhil/theConnection.git
    cd theConnection
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_FB=your_firebase_api_key
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Register a new account or log in with existing credentials.
3. Verify your email address (check spam folder if needed).
4. Alternative: Use "Guest Login" for quick access without registration.
5. Search for other users by name or email to start chatting.
6. Customize your profile with display name and profile picture.
7. Toggle between dark and light modes using the theme switcher.

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Firebase Authentication** - User authentication and email verification
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Storage** - Cloud storage for profile pictures
- **React Router DOM** - Client-side routing

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing with Autoprefixer
- **Class Variance Authority** - Component variant management
- **React Easy Crop** - Image cropping functionality

### Key Files and Directories

- **`src/firebase.js`** - Firebase configuration and initialization for authentication, Firestore, and Storage
- **`src/context/`** - React Context providers for global state management (auth, chat, theme, images)
- **`src/components/`** - Reusable UI components including chat interface, search, and profile management
- **`src/components/ui/`** - shadcn/ui component library for consistent, accessible UI elements
- **`src/pages/`** - Main application pages (Chat, Login, Signup, Profile, 404)
- **`src/hooks/`** - Custom React hooks for toast notifications and other shared logic
- **`index.css`** - Global styles, CSS variables for theming, and responsive design rules
- **`tailwind.config.js`** - Tailwind CSS configuration with custom colors and design tokens
- **`components.json`** - shadcn/ui component configuration and import paths

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- Backend powered by [Firebase](https://firebase.google.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)