# TransitOps Workflow Documentation

## Vehicle Management Workflow

### Adding a New Vehicle

1. **User Action**: Click "Add Vehicle" on Vehicles page
2. **Form Display**: VehicleFormModal opens with empty fields
3. **User Input**: Fill in vehicle details:
   - Registration Number
   - Vehicle Type
   - Manufacturer
   - Model
   - Year
   - Capacity
   - Fuel Type
4. **Validation**: Frontend validates required fields
5. **API Call**: POST /vehicles with vehicle data
6. **Backend Processing**:
   - Controller receives request
   - Service validates business logic
   - Repository checks for duplicate registration
   - Vehicle created in database
7. **Response**: Success with vehicle data
8. **UI Update**: Vehicle added to table, modal closes

### Editing a Vehicle

1. **User Action**: Click edit icon on vehicle row
2. **Form Display**: VehicleFormModal opens with vehicle data
3. **User Input**: Modify vehicle fields
4. **Validation**: Frontend validates changes
5. **API Call**: PUT /vehicles/:id with updated data
6. **Backend Processing**:
   - Controller receives request
   - Service validates business logic
   - Repository checks for duplicate registration (if changed)
   - Vehicle updated in database
7. **Response**: Success with updated vehicle data
8. **UI Update**: Vehicle row updated in table, modal closes

### Deleting a Vehicle

1. **User Action**: Click delete icon on vehicle row
2. **Confirmation**: ConfirmDialog displays warning
3. **User Confirmation**: Click "Delete" button
4. **API Call**: DELETE /vehicles/:id
5. **Backend Processing**:
   - Controller receives request
   - Service checks if vehicle can be deleted
   - Repository removes vehicle from database
6. **Response**: Success with deleted vehicle data
7. **UI Update**: Vehicle removed from table

## Trip Management Workflow

### Creating a Trip

1. **User Action**: Click "New Trip" on Dashboard
2. **Form Display**: Trip form opens
3. **User Input**: Fill trip details:
   - Select Vehicle (must be available)
   - Select Driver (must be available)
   - Enter Origin
   - Enter Destination
   - Enter Cargo Weight
4. **Validation**:
   - Vehicle availability check
   - Driver availability check
   - License expiry check
   - Cargo weight vs vehicle capacity
5. **API Call**: POST /trips with trip data
6. **Backend Processing**:
   - Service validates all constraints
   - Vehicle marked as "on-trip"
   - Driver marked as "on-trip"
   - Trip created with status "pending"
7. **Response**: Success with trip data
8. **UI Update**: Trip added to trips list

### Completing a Trip

1. **User Action**: Click "Complete" on trip
2. **API Call**: PUT /trips/:id with status "completed"
3. **Backend Processing**:
   - Service validates status transition
   - Vehicle marked as "available"
   - Driver marked as "available"
   - Trip marked as "completed"
   - End time recorded
4. **Response**: Success with updated trip data
5. **UI Update**: Trip status updated

## Maintenance Workflow

### Scheduling Maintenance

1. **User Action**: Click "Schedule Service" on Maintenance page
2. **Form Display**: Maintenance form opens
3. **User Input**: Fill maintenance details:
   - Select Vehicle
   - Service Type
   - Workshop
   - Due Date
   - Estimated Cost
4. **API Call**: POST /maintenance with data
5. **Backend Processing**:
   - Service validates vehicle status
   - Maintenance record created
   - Vehicle status may change to "requires-maintenance"
6. **Response**: Success with maintenance data
7. **UI Update**: Maintenance added to timeline

### Completing Maintenance

1. **User Action**: Click "Complete" on maintenance item
2. **API Call**: PUT /maintenance/:id with status "completed"
3. **Backend Processing**:
   - Service validates status
   - Vehicle marked as "available"
   - Maintenance marked as "completed"
   - End date recorded
4. **Response**: Success with updated maintenance data
5. **UI Update**: Maintenance status updated

## Expense Management Workflow

### Adding an Expense

1. **User Action**: Click "Add Expense" on Expenses page
2. **Form Display**: Expense form opens
3. **User Input**: Fill expense details:
   - Select Vehicle
   - Category (fuel, maintenance, toll, etc.)
   - Amount
   - Payment Method
   - Date
   - Description
4. **API Call**: POST /expenses with data
5. **Backend Processing**:
   - Service validates expense data
   - For fuel expenses: calculates amount from litres × price
   - Expense record created
6. **Response**: Success with expense data
7. **UI Update**: Expense added to list, totals updated

## Authentication Workflow

### User Registration

1. **User Action**: Submit registration form
2. **Validation**: Frontend validates email format, password strength
3. **API Call**: POST /api/auth/register
4. **Backend Processing**:
   - Service checks for duplicate email
   - Password hashed with bcrypt
   - User created in database
5. **Response**: Success with user data (excluding password)
6. **UI Update**: Redirect to login page

### User Login

1. **User Action**: Submit login form
2. **API Call**: POST /api/auth/login
3. **Backend Processing**:
   - Service finds user by email
   - Password comparison with bcrypt
   - JWT token generated
4. **Response**: Success with token and user data
5. **UI Update**: Token stored in localStorage, redirect to dashboard
6. **Subsequent Requests**: Token included in Authorization header

## Status Transitions

### Vehicle Status Flow

```
available → on-trip → available
available → requires-maintenance → under-maintenance → available
available → retired (final state)
```

### Driver Status Flow

```
available → on-trip → available
available → unavailable → available
```

### Trip Status Flow

```
pending → in-progress → completed
pending → cancelled
in-progress → cancelled
```

### Maintenance Status Flow

```
scheduled → in-progress → completed
scheduled → overdue → in-progress → completed
```
