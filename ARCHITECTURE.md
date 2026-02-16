# 🏗️ Smart Campus Dashboard Architecture

```mermaid
graph LR
    subgraph Client [Frontend (Vite + React)]
        UI[User Interface]
        Redux[State Management]
        SocketClient[Socket.io Client]
        Auth[Auth Service]
    end

    subgraph Server [Backend (Node.js + Express)]
        API[ReST API Endpoints]
        SocketServer[Socket.io Server]
        Middleware[Auth Middleware]
        Controllers[Controllers]
    end

    subgraph Database [MongoDB]
        Users[(Users Collection)]
        Events[(Events Collection)]
        Resources[(Resources Collection)]
        Logs[(Logs/History)]
    end

    UI --> Redux
    Redux --> Auth
    Auth -->|HTTP Requests| API
    UI -->|Real-time Events| SocketClient
    SocketClient <-->|WebSockets| SocketServer
    
    API --> Middleware
    Middleware --> Controllers
    Controllers --> Users
    Controllers --> Events
    Controllers --> Resources
    Controllers --> Logs

    SocketServer -.->|Updates| UI
```
