# 🌟 Dream Factory - Travel Destination Platform

A modern, full-stack web application for discovering and managing travel destinations. Built with React frontend and Spring Boot backend, featuring real-time chat, user management, and a beautiful responsive design.

![Dream Factory](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0+-green?logo=spring)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-purple)

## ✨ Features

### 🎯 Core Functionality

- **User Authentication** - Secure JWT-based login/registration with refresh tokens
- **Role-Based Access** - Separate interfaces for users and administrators
- **Destination Management** - Browse, search, and manage travel destinations
- **Real-Time Chat** - WebSocket-powered chat system for user communication
- **Review System** - Users can leave reviews and ratings for destinations
- **Like System** - Interactive like/unlike functionality for destinations

### 🎨 User Experience

- **Modern UI/UX** - Custom design system with smooth animations
- **Search & Filter** - Real-time search by location and destination name
- **Pagination** - Efficient handling of large datasets
- **Visual Feedback** - Loading states, animations, and interactive elements

### 🔧 Admin Features

- **User Management** - Add, update, delete, and assign roles to users

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Java** >= 17
- **Maven** >= 3.6
- **Backend Server** running on port 8080

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dream-factory
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
dream-factory/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service layer
│   │   └── index.js       # Centralized API functions
│   ├── assets/            # Images and icons
│   │   └── images/
│   ├── components/        # Reusable UI components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── ChatIcon/
│   ├── forms/             # Modal forms and complex forms
│   │   ├── AddUserForm/
│   │   ├── Chat/
│   │   ├── UpdateUserForm/
│   │   └── ...
│   ├── pages/             # Main application pages
│   │   ├── Home/
│   │   ├── LoginPage/
│   │   ├── AdminDashboard/
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   └── validation.js  # Form validation logic
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Technologies Used

- **React 18** - Modern UI library with hooks
- **React Router DOM** - Client-side routing
- **CSS Modules** - Scoped styling
- **WebSocket (STOMP/SockJS)** - Real-time communication
- **JWT Authentication** - Secure user sessions

## 📱 Key Pages & Features

### 🏠 Home Page

- **Destination Grid** - Visual cards with images and details
- **Search Sidebar** - Filter by location and name
- **Pagination** - Navigate through large datasets

### 🔐 Authentication

- **Login Form** - Username/password authentication
- **Registration** - New user account creation
- **JWT Tokens** - Secure session management
- **Role Assignment** - Automatic role detection

### 👤 User Dashboard

- **Personal Destinations** - View and manage user's destinations
- **Add Destinations** - Create new travel destinations
- **Edit/Delete** - Manage existing content

### 🎯 Destination Details

- **Rich Information** - Images, descriptions, locations
- **Review System** - Read and write reviews
- **Like Functionality** - Interactive like/unlike
- **Responsive Gallery** - Image viewing experience

### 💬 Real-Time Chat

- **Multi-Room Support** - Join different chat rooms
- **WebSocket Integration** - Instant message delivery
- **Message History** - Persistent chat logs

### ⚙️ Admin Dashboard

- **User Management** - Complete CRUD operations
- **Role Assignment** - Admin/User role management

## 🔌 API Endpoints

### Authentication

```
POST /login              # User login
POST /register           # User registration
POST /register/admin     # Admin user creation
POST /auth/refresh       # Token refresh
```

### Destinations

```
GET    /api/destinations           # List all destinations
GET    /api/destinations/{id}      # Get destination details
POST   /api/destinations           # Create new destination
PUT    /api/destinations/{id}      # Update destination
DELETE /api/destinations/{id}      # Delete destination
GET    /api/destinations/{id}/likes # Get like information
POST   /api/destinations/{id}/likes/toggle # Toggle like
```

### Users (Admin Only)

```
GET    /api/users        # List all users
PUT    /api/users/{id}   # Update user
DELETE /api/users/{id}   # Delete user
```

### Reviews

```
GET    /api/reviews      # Get reviews for destination
POST   /api/reviews      # Create new review
```

### Chat

```
WebSocket /ws           # WebSocket connection
STOMP /app/chat         # Send chat messages
STOMP /topic/chat       # Subscribe to chat updates
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based sessions
- **Refresh Tokens** - Automatic session renewal
- **Role-Based Access** - Admin/User permission system
- **Input Validation** - Client and server-side validation
- **CORS Configuration** - Cross-origin request handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Screenshots

[![temp-Image-Dj-Ox-IS.avif](https://i.postimg.cc/3wpdF8HY/temp-Image-Dj-Ox-IS.avif)](https://postimg.cc/7CHHxy6W)

[![temp-Image-Ns-AKSc.avif](https://i.postimg.cc/3xGKPtfZ/temp-Image-Ns-AKSc.avif)](https://postimg.cc/4YJkcQgK)

[![temp-Image-Yz-Ur-Yr.avif](https://i.postimg.cc/0QVxpFr9/temp-Image-Yz-Ur-Yr.avif)](https://postimg.cc/5YQZJPwr)

[![temp-Imageh0d-AXX.avif](https://i.postimg.cc/rFBTCSyR/temp-Imageh0d-AXX.avif)](https://postimg.cc/xc3B9Nz9)

[![temp-Image-W7fl-SA.avif](https://i.postimg.cc/SKrph36c/temp-Image-W7fl-SA.avif)](https://postimg.cc/xkcZGsFd)

---

**🌟 Dream Factory** - Where dreams become destinations! ✈️
