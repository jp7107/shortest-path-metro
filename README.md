# Metro Pathfinder

A full-stack web application designed to compute the shortest path between metro stations. This project combines a high-performance **C++** routing engine with a **Node.js/Express** backend and a beautiful, interactive frontend powered by **HTML/CSS/JS**.

## Features

* **High-Performance Core:** C++ backend ensures ultra-fast Data Structures & Algorithms execution.
* **REST API Middleware:** A Node.js server to bridge front-facing clients with core calculations.
* **Interactive UI:** A highly responsive frontend.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or later)
- C++ Compiler (e.g., GCC/G++ or Clang)
- [Git](https://git-scm.com/)

---

## 🚀 How to Run the Project Locally

Follow these steps to get a local copy running on your machine.

### 1. Compilation of the Core Engine (C++)
The pathfinding logic is written in C++ and needs to be compiled before the server runs.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Compile the C++ entrypoint
g++ metro.cpp -o metro
```
> Note: On Windows, use `g++ metro.cpp -o metro.exe`

### 2. Setting Up the Backend Server (Node.js)

```bash
# 1. Be sure you are still inside the `backend` directory
# cd backend  (if not already there)

# 2. Install required Node modules (Express, CORS, etc.)
npm install

# 3. Start the Express server
node server.js
```
*Your server should now be running and listening for requests (usually on `http://localhost:3000`). Leave this terminal open.*

### 3. Launching the Frontend Application

1. Open a **new terminal tab or window**.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Open the `index.html` file using your web browser, or serve it using any local HTTP server. For example:
   ```bash
   # Using Live Server extension, or Python's built-in http server:
   python3 -m http.server 8000
   ```
4. Access the application in your browser at `http://localhost:8000` (or whichever port you opened it on).

---

## 📂 Project Structure

- `backend/` - Node.js server scripts, core `metro.cpp` source, and `metro_data.txt` representation.
- `frontend/` - Standard HTML, CSS (vanilla), and JavaScript for user-facing experience.
