# Xpand_IT Challenge

## Project Setup

This repository contains two main folders: `backend` and `frontend`. Follow the instructions below to set up each part of the project.

### Backend Setup (Node.js)

1. **Create a `.env` file** in the `backend` folder with the following variables:

    ```plaintext
    DB_HOST=<your-database-host>
    DB_USER=<your-database-user>
    DB_PASSWORD=<your-database-password>
    DB_DATABASE=<your-database-name>
    DB_PORT=<your-database-port>
    PORT=<your-server-port>
    ```

2. **Ensure your MySQL database is populated** with data. You can import the `movies.sql` file to insert fake data created with [Mockaroo](https://mockaroo.com/).

3. **Install dependencies**:

    ```bash
    cd backend
    npm install
    ```

4. **Run the backend server**:
    ```bash
    npm run dev
    ```

### Frontend Setup (React)

1. **Create a `.env` file** in the `frontend` folder with the following variable:

    ```plaintext
    VITE_BASE_URL=http://localhost:<your-backend-port>/api
    ```

2. **Install dependencies**:

    ```bash
    cd frontend
    npm install
    ```

3. **Run the frontend server**:
    ```bash
    npm run dev
    ```
