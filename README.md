# 🌱 Smart Campus Environmental Sustainability Dashboard

> A MERN-stack based solution for monitoring and managing campus resources, energy usage, and sustainability metrics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue)

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Architecture](#-architecture)
- [Workflow](#-workflow)
- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [How to Connect](#how-to-connect)

---

## 🧐 About the Project
This dashboard provides real-time insights into campus sustainability. It tracks energy consumption, waste management, and resource usage, offering actionable analytics for students, employees, and administrators.

## 🏗 Architecture
The system is built on the **MERN Stack** (MongoDB, Express, React, Node.js) and utilizes **Socket.io** for real-time updates.

👉 **[View Detailed Architecture Diagram](ARCHITECTURE.md)**

*   **Frontend**: React (Vite) + Tailwind CSS + Recharts
*   **Backend**: Node.js + Express
*   **Database**: MongoDB
*   **Real-time Layer**: Socket.io

## 🔄 Workflow
The application serves three primary user roles: **Admin**, **Student**, and **Employee**. Each has a tailored dashboard and set of features.

👉 **[View Detailed User Workflow](WORKFLOW.md)**

## 🌟 Features
-   **Real-time Dashboard**: Live updates on energy and resource usage via WebSockets.
-   **Sustainability Score**: AI-driven score based on waste reduction and energy efficiency.
-   **Role-Based Access**: Secure login for Admins, Students, and Employees.
-   **Resource Forecasting**: Predictive analysis for campus resource needs.
-   **Library & Event Management**: integrated booking and scheduling systems.
-   **Interactive Charts**: Visual breakdown of data using Recharts.

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
-   **Node.js**: [Download here](https://nodejs.org/)
-   **MongoDB**: [Download here](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-campus-dashboard.git
cd smart-campus-dashboard
```

#### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file if required (see below)
node seed.js  # Optional: Populates database with dummy data
npm start
```
*   **Server runs on:** `http://localhost:5000`

#### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
*   **Client runs on:** `http://localhost:5173`

### How to Connect
1.  **Start MongoDB**: Ensure your local MongoDB service is running (`mongod`) or update the connection string in `server/config/db.js` (or `.env` file).
2.  **Verify Backend**: Visit `http://localhost:5000` in your browser. You should see a confirmation message (e.g., "API Running").
3.  **Launch Frontend**: Open `http://localhost:5173`.
4.  **Login**:
    *   **Admin**: `admin@university.edu` / `admin123` (Example)
    *   **Student**: `student@university.edu` / `student123` (Examples)

---

## 🛠 .env Configuration
Create a `.env` file in the `server` directory with the following keys:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-campus
JWT_SECRET=your_super_secret_key_123
```
