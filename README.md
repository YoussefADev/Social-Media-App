# Social Media App

A full-stack social media application built with Node.js, Express, MySQL, and Vanilla JavaScript.

Users can create accounts, publish posts, interact through likes and comments, and manage their profiles through a secure authentication system.

---

## Features

### Authentication
- User registration
- User login
- JWT authentication
- Refresh token support
- Protected routes
- Secure logout

### Posts
- Create posts
- View posts feed
- Delete own posts
- Pagination support

### Interactions
- Like and unlike posts
- Add comments
- View post interactions

### Profiles
- User profile page
- View user's posts

### Validation & Security
- Joi request validation
- Custom error handling
- Authentication middleware
- Protected API endpoints

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- Joi

### Frontend
- HTML
- CSS
- JavaScript (Vanilla JS)
- Axios

---

## Project Structure

```text
project/
│
├── controllers/
├── routes/
├── middleware/
├── validations/
├── utils/
├── database/
├── views/
├── storage
└── app.js
```

---

## Installation

### Clone repository

```bash
git clone https://github.com/your-username/social-media-app.git
cd social-media-app
```

### Install dependencies

```bash
npm install
```

### Create environment variables

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=social_media

JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Start development server

```bash
npm run dev
```

or

```bash
npm start
```

---

## Database

Import the provided SQL schema and create the required tables.

Example entities:

- Users
- Posts
- Comments
- Likes
- Refresh Tokens

---

## Authentication Flow

1. User logs in.
2. Server generates:
   - Access Token
   - Refresh Token
3. Access token is used for protected requests.
4. Refresh token is stored securely and used to obtain new access tokens when needed.

---

## API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Posts

```http
GET    /api/posts
POST   /api/posts
DELETE /api/posts/:id
```

### Comments

```http
POST   /api/comments
DELETE /api/comments/:id
```

### Likes

```http
POST /api/posts/:id/like
```

### Users

```http
GET  /api/users/:id
PUT  /api/users/profile
```


---

## Future Improvements
- Cloud storage integration
- Redis caching
- Real-time notifications
- Follow system
- Chat system
- React frontend migration

---

## Learning Goals

This project was built to strengthen skills in:

- Backend development
- REST API design
- Authentication & Authorization
- Database relationships
- Full-stack application architecture

---

## Author

Built by [YoussefADev]

GitHub: https://github.com/your-username