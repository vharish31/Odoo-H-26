# TransitOps Test Cases

## Authentication

### User Registration

**Test Case 1: Successful Registration**
- **Input**: Valid name, email, password, role
- **Expected**: User created, returns user data without password
- **Status**: 201 Created

**Test Case 2: Duplicate Email**
- **Input**: Email already registered
- **Expected**: Error message "Email is already registered"
- **Status**: 409 Conflict

**Test Case 3: Invalid Email**
- **Input**: Invalid email format
- **Expected**: Validation error
- **Status**: 400 Bad Request

### User Login

**Test Case 4: Successful Login**
- **Input**: Valid email and password
- **Expected**: JWT token and user data returned
- **Status**: 200 OK

**Test Case 5: Invalid Credentials**
- **Input**: Wrong password
- **Expected**: Error message "Invalid credentials"
- **Status**: 401 Unauthorized

**Test Case 6: Non-existent User**
- **Input**: Unregistered email
- **Expected**: Error message "Invalid credentials"
- **Status**: 401 Unauthorized

## Vehicle Management

### Get All Vehicles

**Test Case 7: Fetch Vehicles**
- **Input**: Valid auth token
- **Expected**: Array of vehicles with count
- **Status**: 200 OK

**Test Case 8: Unauthorized Access**
- **Input**: No auth token
- **Expected**: Error message "Unauthorized"
- **Status**: 401 Unauthorized

### Create Vehicle

**Test Case 9: Successful Creation**
- **Input**: Valid vehicle data with unique registration
- **Expected**: Vehicle created with data returned
- **Status**: 201 Created

**Test Case 10: Duplicate Registration**
- **Input**: Registration number already exists
- **Expected**: Error message "Registration number already exists"
- **Status**: 409 Conflict

**Test Case 11: Invalid Year**
- **Input**: Year < 1900 or > current year + 1
- **Expected**: Validation error
- **Status**: 400 Bad Request

**Test Case 12: Invalid Capacity**
- **Input**: Capacity < 1
- **Expected**: Validation error
- **Status**: 400 Bad Request

### Update Vehicle

**Test Case 13: Successful Update**
- **Input**: Valid update data
- **Expected**: Vehicle updated with new data returned
- **Status**: 200 OK

**Test Case 14: Update with Duplicate Registration**
- **Input**: Registration number used by another vehicle
- **Expected**: Error message "Registration number already exists"
- **Status**: 409 Conflict

**Test Case 15: Non-existent Vehicle**
- **Input**: Invalid vehicle ID
- **Expected**: Error message "Vehicle not found"
- **Status**: 404 Not Found

### Delete Vehicle

**Test Case 16: Successful Deletion**
- **Input**: Valid vehicle ID
- **Expected**: Vehicle deleted, data returned
- **Status**: 200 OK

**Test Case 17: Delete Non-existent Vehicle**
- **Input**: Invalid vehicle ID
- **Expected**: Error message "Vehicle not found"
- **Status**: 404 Not Found

## Business Logic

### Vehicle Dispatch

**Test Case 18: Dispatch Available Vehicle**
- **Input**: Vehicle with status "available"
- **Expected**: Vehicle status changes to "on-trip"
- **Status**: 200 OK

**Test Case 19: Dispatch Unavailable Vehicle**
- **Input**: Vehicle with status "on-trip"
- **Expected**: Error message "Vehicle is not available for dispatch"
- **Status**: 400 Bad Request

### Vehicle Restoration

**Test Case 20: Restore from Trip**
- **Input**: Vehicle with status "on-trip"
- **Expected**: Vehicle status changes to "available"
- **Status**: 200 OK

### Vehicle Retirement

**Test Case 21: Retire Vehicle**
- **Input**: Valid vehicle ID
- **Expected**: Vehicle status changes to "retired"
- **Status**: 200 OK

### Driver Assignment

**Test Case 22: Assign Available Driver**
- **Input**: Driver with valid license
- **Expected**: Driver status changes to "on-trip"
- **Status**: 200 OK

**Test Case 23: Assign Driver with Expired License**
- **Input**: Driver with expired license
- **Expected**: Error message "Driver license has expired"
- **Status**: 400 Bad Request

### Trip Validation

**Test Case 24: Valid Trip Creation**
- **Input**: Available vehicle, available driver, valid cargo weight
- **Expected**: Trip created, vehicle and driver marked "on-trip"
- **Status**: 201 Created

**Test Case 25: Exceed Vehicle Capacity**
- **Input**: Cargo weight > vehicle capacity
- **Expected**: Error message "Cargo weight exceeds vehicle capacity"
- **Status**: 400 Bad Request

**Test Case 26: Invalid Status Transition**
- **Input**: Attempt to change status from "completed" to "pending"
- **Expected**: Error message "Cannot transition from completed to pending"
- **Status**: 400 Bad Request

## Maintenance

**Test Case 27: Schedule Maintenance**
- **Input**: Available vehicle, valid maintenance data
- **Expected**: Maintenance created, vehicle status changes
- **Status**: 201 Created

**Test Case 28: Complete Maintenance**
- **Input**: Maintenance with status "in-progress"
- **Expected**: Maintenance completed, vehicle marked "available"
- **Status**: 200 OK

## Expenses

**Test Case 29: Add Expense**
- **Input**: Valid expense data
- **Expected**: Expense created
- **Status**: 201 Created

**Test Case 30: Fuel Expense Calculation**
- **Input**: 50 litres at ₹100/litre
- **Expected**: Amount calculated as ₹5000
- **Status**: 201 Created

**Test Case 31: Invalid Amount**
- **Input**: Amount <= 0
- **Expected**: Validation error
- **Status**: 400 Bad Request

## Error Handling

**Test Case 32: Invalid MongoDB ID**
- **Input**: Non-ObjectId string
- **Expected**: Error message "Invalid ID"
- **Status**: 400 Bad Request

**Test Case 33: Database Connection Error**
- **Input**: MongoDB not running
- **Expected**: Server error, connection failed message
- **Status**: 500 Internal Server Error

**Test Case 34: Missing Required Fields**
- **Input**: Request missing required fields
- **Expected**: Validation error with field names
- **Status**: 400 Bad Request

## Frontend Integration

**Test Case 35: Vehicle Table Rendering**
- **Input**: API returns vehicle data
- **Expected**: Table displays all vehicles with correct data
- **Status**: Visual verification

**Test Case 36: Search Functionality**
- **Input**: Search term in search box
- **Expected**: Table filters to matching vehicles
- **Status**: Visual verification

**Test Case 37: Filter Functionality**
- **Input**: Select type or status filter
- **Expected**: Table filters to matching vehicles
- **Status**: Visual verification

**Test Case 38: Pagination**
- **Input**: More than PAGE_SIZE vehicles
- **Expected**: Pagination controls displayed, correct page shown
- **Status**: Visual verification

**Test Case 39: Modal Open/Close**
- **Input**: Click add/edit button
- **Expected**: Modal opens with correct data, closes on cancel
- **Status**: Visual verification

**Test Case 40: Loading States**
- **Input**: API request in progress
- **Expected**: Loading indicator displayed
- **Status**: Visual verification

**Test Case 41: Error States**
- **Input**: API request fails
- **Expected**: Error message displayed
- **Status**: Visual verification
