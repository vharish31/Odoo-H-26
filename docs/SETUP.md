# TransitOps Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Project Structure

```
TransitOps/
├── client/          # React Frontend
├── server/          # Express Backend
├── docs/            # Documentation
└── postman/         # API Collection
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TransitOps
```

### 2. Backend Setup

```bash
cd server
npm install
```

#### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/transitops
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

#### Start MongoDB

```bash
# Using MongoDB Compass or CLI
mongod
```

#### Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
```

#### Start Frontend Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Verification

1. Open `http://localhost:5173` in your browser
2. Navigate to the Dashboard
3. Verify that vehicle data loads from the backend API
4. Test the Vehicles page for CRUD operations

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- Verify MongoDB is accessible on the specified port

### CORS Errors

- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches the CORS origin

### API Errors

- Check backend server is running
- Verify API endpoints in browser console
- Check backend logs for errors
