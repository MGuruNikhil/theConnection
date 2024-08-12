# theConnection

theConnection is a real-time chat application built with React, Firebase, and Material-UI. It allows users to communicate with each other through text messages, manage their profiles, and search for other users by display name or email.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- Real-time messaging
- User authentication
- Profile management
- Search users by display name or email
- Responsive design

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/theConnection.git
    cd theConnection
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_FB=your_firebase_api_key
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register or log in with your account.
3. Start chatting with other users!

## Project Structure

```sh
.
├── .env
├── .eslintrc.cjs
├── .gitignore
├── index.css
├── index.html
├── package.json
├── postcss.config.js
├── public/
├── README.md
├── src/
│   ├── App.jsx
│   ├── assets/
│   ├── components/
│   │   ├── CACover.jsx
│   │   ├── ChatArea.jsx
│   │   ├── ChatHeader.jsx
│   │   ├── ChatList.jsx
│   │   ├── EditDisplayName.jsx
│   │   ├── FullImg.jsx
│   │   ├── Messages.jsx
│   │   ├── MyAvatar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Send.jsx
│   │   ├── Sidebar.jsx
│   │   └── SideHeader.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ImgContext.jsx
│   ├── firebase.js
│   ├── main.jsx
│   ├── materialUI/
│   │   └── ...
│   └── pages/
│       ├── Chat.jsx
│       └── ...
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

### Key Files and Directories

- [`src/firebase.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fnikhil%2Fprogramming%2FtheConnection%2Fsrc%2Ffirebase.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/nikhil/programming/theConnection/src/firebase.js"): Firebase configuration and initialization.
- [`src/context/`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fnikhil%2Fprogramming%2FtheConnection%2Fsrc%2Fcontext%2F%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/nikhil/programming/theConnection/src/context/"): Context providers for authentication, chat, and image handling.
- [`src/components/`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fnikhil%2Fprogramming%2FtheConnection%2Fsrc%2Fcomponents%2F%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/nikhil/programming/theConnection/src/components/"): Reusable UI components.
- [`src/materialUI/`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fnikhil%2Fprogramming%2FtheConnection%2Fsrc%2FmaterialUI%2F%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/nikhil/programming/theConnection/src/materialUI/"): Custom Material-UI components.
- [`src/pages/Chat.jsx`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fnikhil%2Fprogramming%2FtheConnection%2Fsrc%2Fpages%2FChat.jsx%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/nikhil/programming/theConnection/src/pages/Chat.jsx"): Main chat page.