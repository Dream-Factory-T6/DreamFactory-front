# Dream Factory

Dream Factory is a modern web application for discovering, reviewing, and managing travel destinations. It supports user and admin roles, reviews, likes, and a full-featured admin dashboard.

## Features

- **User registration and login** (JWT + refresh tokens)
- **Role-based access**: regular users and admins
- **Browse destinations** with images, ratings, and locations
- **Leave reviews** (users only)
- **Like destinations** (with login prompt for guests)
- **Admin dashboard**: manage users (add, update, delete, assign roles)
- **Add, update, and delete destinations** (for users)
- **Responsive design** and modular CSS

## Main Pages

- **Home**: Browse all destinations, search and filter
- **Login/Register**: Authentication pages
- **User Page**: View and manage your destinations
- **Destination Details**: View details, reviews, likes, and leave a review (if user)
- **Admin Dashboard**: Manage users (admin only)
- **Add/Update Destination**: Modal forms for destination management

## Technologies Used

- React 19
- React Router DOM 7
- React Icons
- CSS Modules & global CSS variables
- JWT authentication with refresh tokens
- REST API (see backend)

## Project Structure

- `src/pages/` — Main pages (Home, UserPage, DestinationDetails, etc.)
- `src/forms/` — Modal forms (AddUser, UpdateUser, LikeLoginModal, etc.)
- `src/components/` — Header, Footer
- `src/api/` — API utilities (with automatic token refresh)
- `src/assets/images/` — App images and icons
- `src/index.css` — Global styles and CSS variables

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend server (see API endpoints below)

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000) and proxy API requests to [http://localhost:8080](http://localhost:8080).

## Environment Variables

- API proxy is set in `package.json` (`"proxy": "http://localhost:8080"`)
- No additional .env required for frontend

## API Endpoints (Backend)

- `POST /login` — Login, returns JWT and refresh token
- `POST /register` — Register new user
- `POST /register/admin` — Register admin user (admin only)
- `GET /api/destinations` — List destinations
- `GET /api/destinations/{id}` — Destination details
- `POST /api/destinations` — Add destination
- `PUT /api/destinations/{id}` — Update destination
- `DELETE /api/destinations/{id}` — Delete destination
- `GET /api/destinations/{id}/likes` — Get like info
- `POST /api/destinations/{id}/likes/toggle` — Toggle like
- `GET /api/users` — List users (admin only)
- `PUT /api/users/{id}` — Update user (admin only)
- `DELETE /api/users/{id}` — Delete user (admin only)
- `POST /auth/refresh` — Refresh access token

## Screenshots

---

**Dream Factory** — Where dreams become destination!
