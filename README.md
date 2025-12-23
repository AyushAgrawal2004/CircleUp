# CircleUp

<div align="center">
  <img src="./Print.svg" alt="CircleUp Logo" width="120" height="120" />
  <br />
  <h3>Connect, Share, and Thrive</h3>
</div>

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
![Node](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-v18+-blue)

</div>

---

**CircleUp** is a modern, real-time chat and community application built to foster connection. Whether you're coordinating with a group, planning events, or just sharing your daily vibe with music-enhanced statuses, CircleUp brings it all together in a sleek, dark-mode-ready interface.

## 🌟 Key Features

### 💬 Real-Time Communication
*   **Instant Messaging**: Powered by Socket.IO for seamless, real-time chat.
*   **Group Chats**: Create and manage communities.
*   **Media Support**: Share images and files effortlessly.

### 📅 Event Management
*   **Plan Events**: Communities can organize events with Title, Date, and Location.
*   **RSVP System**: Users can request to join, and creators can manage attendee lists.
*   **Restricted Control**: Only event creators can delete their events.

### 🎵 Status Updates
*   **Multimedia Statuses**: Share photos or videos.
*   **Custom Background Music**: Upload your own local audio tracks to set the mood for your status (stored locally for privacy/bandwidth).
*   **Viewer Insights**: See who viewed your status.

### 🎨 User Experience
*   **Dark Mode**: Native dark mode support with a convenient toggle.
*   **Responsive Design**: Built with TailwindCSS and DaisyUI for a smooth experience on any device.
*   **Secure Authentication**: JWT-based auth with secure cookie handling.
*   **Dashboard**: A central hub to explore communities and events.

---

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) installed
*   [MongoDB](https://www.mongodb.com/) installed (or Atlas URI)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd chatapp-master
    ```

2.  **Install dependencies:**

    *   **Frontend:**
        ```bash
        cd Frontend
        npm install
        ```
    *   **Backend:**
        ```bash
        cd Backend
        npm install
        ```

### Configuration

1.  **Backend:**
    Create a `.env` file in the `Backend` directory:
    ```env
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

2.  **Frontend:**
    (Optional) Create `.env` in `Frontend` if you have custom API endpoints.

### Running the App

1.  **Start Backend:**
    ```bash
    cd Backend
    npm start
    ```
2.  **Start Frontend:**
    ```bash
    cd Frontend
    npm run dev
    ```

## 🛠️ Technologies Used

*   **Frontend:** React, Vite, TailwindCSS, DaisyUI, Zustand, Axios
*   **Backend:** Node.js, Express, Mongoose, Socket.IO, JWT, Cookie-Parser, Multer

## 📄 License

This project is licensed under the ISC License.
