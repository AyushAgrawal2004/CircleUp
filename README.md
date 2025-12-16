# ChatApp

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## Project Structure

- **Frontend**: React application maintained with Vite.
- **Backend**: Node.js/Express server with MongoDB.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running (or a MongoDB Atlas connection string)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd chatapp-master
    ```

2.  **Install dependencies:**

    *   **Root (if applicable):**
        ```bash
        npm install
        ```
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
    Create a `.env` file in the `Backend` directory with the following variables:
    ```env
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    # Add other necessary environment variables here
    ```

2.  **Frontend:**
    Create a `.env` file in the `Frontend` directory if required by your setup (e.g., API URL).

### Running the Application

1.  **Start the Backend:**
    ```bash
    cd Backend
    npm start
    ```
    The server will run on `http://localhost:5000` (or your defined PORT).

2.  **Start the Frontend:**
    ```bash
    cd Frontend
    npm run dev
    ```
    The application will act as a SPA.

## Technologies Used

- **Frontend:** React, Vite, TailwindCSS, DaisyUI, Zustand, Axios, Socket.IO Client
- **Backend:** Node.js, Express, Mongoose, Socket.IO, JWT, BcryptJS, Cookie-Parser, Multer, Cloudinary

## License

ISC
