# CircleUp Project Report

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture](#3-project-architecture)
4. [Key Features](#4-key-features)
5. [Project Structure](#5-project-structure)
6. [Source Code Explanation](#6-source-code-explanation)
    - [6.1 Frontend and Backend](#61-frontend-and-backend)
7. [Application Screenshots](#7-application-screenshots)
8. [Setup and Installation](#8-setup-and-installation)
9. [Testing the Application](#9-testing-the-application)
10. [Conclusion](#10-conclusion)

---

## 1. Project Overview

**CircleUp** is a modern, real-time chat and community application designed to foster meaningful connections. Unlike standard messaging apps, CircleUp integrates event planning and expressive status updates directly into the chat experience.

The platform addresses common frustrations with group coordination by offering:
- **Unified Communication**: Seamlessly combining chat and event management.
- **Expressive Sharing**: "Status Music" and multimedia updates to capture the "vibe."
- **Community Focus**: Dedicated tools for managing groups and events without the noise of generic social media.

---

## 2. Technology Stack

The application is built using the **MERN Stack** (MongoDB, Express, React, Node.js), ensuring a robust full-stack Javascript environment, enhanced with real-time capabilities.

### Frontend
- **Framework**: [React](https://react.dev/) (v18+) with [Vite](https://vitejs.dev/) for fast development and build performance.
- **Styling**: [TailwindCSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/) for rapid, responsive, and dark-mode-ready UI.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for efficient global state handling.
- **HTTP Client**: [Axios](https://axios-http.com/) for API requests.
- **Routing**: React Router DOM.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) for RESTful API routing.
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose ODM) for flexible, document-based data storage.
- **Real-Time Engine**: [Socket.IO](https://socket.io/) for instant bidirectional communication (chat & status).
- **Authentication**: JSON Web Tokens (JWT) with secure HTTP-only cookies.

---

## 3. Project Architecture

CircleUp follows a classic **Client-Server architecture** supplemented by a widely accessible **WebSocket layer** for real-time interactions.

1.  **Client (Frontend)**: A Single Page Application (SPA) served to the browser. It manages User Interface state and communicates with the backend via REST APIs (for persistent actions like Auth, Creating Events) and WebSockets (for live Chat/Status updates).
2.  **Server (Backend)**: An Express application acts as the controller. It handles:
    -   **API Requests**: Authenticating users and performing CRUD operations on the database.
    -   **Socket Server**: Managing persistent connections for instant message delivery and status broadcasting.
3.  **Database**: MongoDB stores all persistent data, including Users, Messages, Groups, and Events.

**Data Flow**:
- **Auth**: User logs in -> Server verifies -> JWT set in Cookie.
- **Chat**: User sends message -> Socket emits to Server -> Server saves to DB -> Server broadcasts to Recipient.

---

## 4. Key Features

### 💬 Real-Time Communication
-   **Instant Messaging**: Powered by Socket.IO, messages are delivered instantly without page refreshes.
-   **Group Chats**: Create communities to discuss specific topics.
-   **Media Support**: Share images and files seamlessly alongside text.

### 📅 Event Management
-   **Integrated Planning**: Create events with Title, Date, and Location directly within a community.
-   **RSVP System**: Members can request to join events, and creators can manage the attendee list.
-   **Secure Control**: Event deletion and modification are restricted to the event creator.

### 🎵 Status Updates
-   **Multimedia Statuses**: Share photos or videos that disappear after 24 hours.
-   **Status Music**: Unique feature allowing users to upload local audio files to accompany their visual status, enhancing personal expression.
-   **Viewer Insights**: Creators can see exactly who has viewed their status.

### 🎨 User Experience
-   **Dark Mode**: Native, system-wide dark mode support with a user toggle.
-   **Responsive Design**: Fully optimized for desktop, tablet, and mobile views.

---

## 5. Project Structure

The project is divided into two main directories: `Frontend` and `Backend`.

### Backend Structure
```
Backend/
├── controller/       # Business logic for Events, Messages, Users
├── models/           # Mongoose schemas (User, Conversation, Message)
├── routes/           # API route definitions
├── middleware/       # Auth protection (protectRoute.js)
├── SocketIO/         # Socket server configuration
├── index.js          # Entry point, server initialization
└── .env              # Environment variables
```

### Frontend Structure
```
Frontend/
├── src/
│   ├── components/   # Reusable UI components (Login, Signup, skeletons)
│   ├── pages/        # Main views (Dashboard, GroupPage)
│   ├── home/         # Dashboard sub-components (Leftpart/Rightpart)
│   ├── context/      # React Contexts (AuthProvider, SocketContext)
│   ├── zustand/      # Global state stores
│   ├── utils/        # Helper functions
│   └── App.jsx       # Main application component & Routing
└── index.html        # Entry HTML file
```

---

## 6. Source Code Explanation

### 6.1 Frontend and Backend

#### **Frontend Logic**
-   **`App.jsx`**: Serving as the root component, it handles Client-Side Routing. It uses `useAuth` to check if a user is logged in, protecting routes like `/` (Dashboard) and `/group/:id` while redirecting unauthenticated users to `/login`.
-   **`Dashboard.jsx`**: The core interface. It typically splits the view into a **Sidebar** (Leftpart) for navigation/contacts and a **Chat Area** (Rightpart) for the active conversation.
-   **`GroupPage.jsx`**: A specialized page for community interaction, displaying group-specific events and member lists.
-   **State Management**: `Zustand` stores are used for handling transient data like the "selected conversation" or "online users" list, avoiding prop-drilling.

#### **Backend Logic**
-   **`index.js`**: Initializes the Express app and the HTTP server. It connects to MongoDB and configures the Socket.IO server with CORS policies to allow frontend connections.
-   **Controllers**:
    -   `auth.controller.js`: Handles Signup (hashing passwords with bcrypt), Login (generating JWT), and Logout.
    -   `message.controller.js`: Manages fetching and sending messages. `sendMessage` controller saves the message to MongoDB and immediately attempts toemit it via Socket.IO if the receiver is online.
-   **`protectRoute.js`**: A middleware function that runs before protected API routes. It verifies the JWT token from cookies; if invalid, the request is rejected immediately, ensuring security.

---

## 7. Application Screenshots

*(Note: Replace placeholders below with actual screenshots when generating the final document)*

1.  **Login/Signup Screen**: A clean, centered form allowing users to create an account or sign in securely.
2.  **Dashboard (Home)**: The main view featuring a contact list on the left and a chat window on the right. Dark mode styling is evident here.
3.  **Group Page**: A dedicated view for a specific group, listing upcoming events and allowing RSVP actions.
4.  **Status Viewer**: A modal overlay displaying a user's status image/video with audio controls for the background music.

---

## 8. Setup and Installation

### Prerequisites
- Node.js installed
- MongoDB installed (or a cloud Atlas URI)

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd chatapp-master
    ```

2.  **Install Dependencies**
    *   **Frontend**: `cd Frontend && npm install`
    *   **Backend**: `cd Backend && npm install`

3.  **Configuration (.env)**
    Creates a `.env` file in `Backend/` with:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

4.  **Running the App**
    *   **Start Backend**: `cd Backend && npm start`
    *   **Start Frontend**: `cd Frontend && npm run dev`

---

## 9. Testing the Application

Since this is a real-time application, testing focuses on connectivity and synchronization.

**Manual Testing Steps:**
1.  **Authentication Flow**: Open the app in a browser. Try signing up with a new account. Verify you are redirected to the Dashboard. Logout and try logging in again.
2.  **Real-Time Chat**: Open the application in **two different browsers** (e.g., Chrome and Safari) or an Incognito window. Log in as usage A and user B. Send a message from A to B. Verify B receives it instantly without refreshing.
3.  **Responsiveness**: Resize the browser window to mobile width. Ensure the sidebar collapses or adapts as expected (using DaisyUI's responsive classes).
4.  **Status Upload**: Upload a status with a music file. Check if it appears in the status list and if the audio plays correctly.

---

## 10. Conclusion

**CircleUp** successfully bridges the gap between simple messaging apps and complex event management tools. By leveraging the **MERN stack**, it delivers a high-performance, responsive experience. The implementation of **Socket.IO** ensures users feel instantly connected, while features like **Status Music** and **Dark Mode** add a layer of modern polish found in top-tier social applications. The project structure allows for easy scalability, making it a solid foundation for future enhancements.
