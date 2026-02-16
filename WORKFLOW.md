# 🔄 Smart Campus Dashboard Workflow

```mermaid
graph TD
    A[User Visits Site] --> B{Has Account?}
    B -- No --> C[Sign Up Page]
    C -->|Enter Details| D[Create Account]
    D --> E[Login Page]
    B -- Yes --> E
    E -->|Authenticate| F{User Role?}
    
    F -- Admin --> G[Admin Dashboard]
    F -- Student --> H[Student Dashboard]
    F -- Employee --> I[Employee Dashboard]

    subgraph Admin Features
        G --> G1[Manage Users]
        G --> G2[Resource Forecasting]
        G --> G3[Library Management]
        G --> G4[Event Management]
        G --> G5[View Sustainability Score]
    end

    subgraph Student Features
        H --> H1[View Events]
        H --> H2[Book Library Resources]
        H --> H3[View Notifications]
        H --> H4[Track Personal Impact]
    end

    subgraph Employee Features
        I --> I1[Manage Department Resources]
        I --> I2[Report Issues]
        I --> I3[View Campus Stats]
    end

    G5 --> J[Real-time Updates (Socket.io)]
    H3 --> J
    I3 --> J
```
