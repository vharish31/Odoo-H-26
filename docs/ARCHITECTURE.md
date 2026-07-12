# TransitOps Architecture

## Overview

TransitOps is a full-stack fleet management application built with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js + MongoDB
- **Architecture**: RESTful API with separation of concerns

## Frontend Architecture

### Directory Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons, logos
│   ├── components/     # Reusable components
│   │   ├── common/     # Shared UI components
│   │   ├── ui/         # Base UI elements
│   │   ├── cards/      # Card components
│   │   ├── charts/     # Chart components
│   │   ├── tables/     # Table components
│   │   ├── forms/      # Form components
│   │   ├── modals/     # Modal components
│   │   └── layout/     # Layout components
│   ├── pages/          # Page components
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Vehicles/
│   │   ├── Drivers/
│   │   ├── Trips/
│   │   ├── Maintenance/
│   │   ├── Expenses/
│   │   ├── Reports/
│   │   └── Profile/
│   ├── layouts/        # Layout wrappers
│   ├── routes/         # Route configuration
│   ├── context/        # React Context
│   ├── hooks/          # Custom hooks
│   ├── services/       # API service layer
│   ├── utils/          # Utility functions
│   ├── constants/      # Constants and data
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── package.json
└── vite.config.js
```

### Key Patterns

- **Component Organization**: Components grouped by type (common, cards, charts, etc.)
- **Service Layer**: Centralized API calls in `services/api.js`
- **Page Structure**: Each page has its own directory with `index.jsx`
- **Layout System**: Separate layout components for different sections

## Backend Architecture

### Directory Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   │   ├── db.js       # Database connection
│   │   └── env.js      # Environment variables
│   ├── models/         # Mongoose models
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Driver.js
│   │   ├── Trip.js
│   │   ├── Maintenance.js
│   │   └── Expense.js
│   ├── repositories/   # Data access layer
│   │   ├── userRepository.js
│   │   ├── vehicleRepository.js
│   │   └── ...
│   ├── services/       # Business logic layer
│   │   ├── authService.js
│   │   ├── vehicleService.js
│   │   └── ...
│   ├── controllers/    # Request handlers
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   └── ...
│   ├── routes/         # Route definitions
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   └── ...
│   ├── middlewares/    # Express middleware
│   │   ├── auth.js
│   │   ├── role.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── validations/    # Request validation
│   │   ├── authValidation.js
│   │   ├── vehicleValidation.js
│   │   └── ...
│   ├── utils/          # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── response.js
│   │   └── AppError.js
│   ├── seed/           # Database seeding
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── package.json
└── .env
```

### Layered Architecture

1. **Routes Layer**: Define API endpoints
2. **Controllers Layer**: Handle HTTP requests/responses
3. **Services Layer**: Business logic and validation
4. **Repositories Layer**: Database operations
5. **Models Layer**: Mongoose schemas

### Key Patterns

- **Separation of Concerns**: Each layer has a specific responsibility
- **Repository Pattern**: Abstract database operations
- **Service Layer**: Business logic isolated from controllers
- **Error Handling**: Centralized error handling middleware
- **Validation**: Request validation using express-validator

## Data Flow

### Frontend to Backend

1. User action triggers component state change
2. Component calls service function (e.g., `vehicleAPI.getAll()`)
3. Service makes HTTP request via Axios
4. Request passes through Vite proxy (in development)
5. Backend receives request at appropriate route
6. Controller validates and calls service
7. Service performs business logic
8. Repository interacts with database
9. Response flows back through layers
10. Frontend updates UI with response data

## Security

- **Authentication**: JWT tokens
- **Authorization**: Role-based access control
- **Input Validation**: express-validator
- **CORS**: Configured for frontend origin
- **Password Hashing**: bcryptjs
- **Environment Variables**: Sensitive data in .env

## Scalability Considerations

- **Modular Structure**: Easy to add new features
- **Service Layer**: Business logic can be reused
- **Repository Pattern**: Database can be swapped
- **Component Organization**: Frontend is maintainable
- **API Versioning**: Ready for versioned endpoints
