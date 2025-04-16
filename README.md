# Team Knowledge Hub Backend

This project is a backend application for a team knowledge hub, built using Node.js, Express, and MongoDB. It provides user authentication, team management, and invitation features.

## Features

- User registration and login
- JWT-based authentication
- MongoDB for data storage
- Team creation and management
- Invitation system for adding users to teams
- Cron job for cleaning up expired invitations

## Folder Structure

```
team-knowledge-hub-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── db.js             # Database connection logic
│   ├── controllers
│   │   ├── authController.js # Handles user authentication
│   │   └── teamController.js # Handles team-related operations
│   ├── middlewares
│   │   └── authMiddleware.js # Middleware for JWT verification
│   ├── models
│   │   ├── User.js           # User model definition
│   │   └── Team.js           # Team model definition
│   ├── routes
│   │   ├── authRoutes.js     # Authentication routes
│   │   └── teamRoutes.js     # Team-related routes
│   └── utils
│       └── cleanup.js        # Utility for cleaning expired invitations
├── package.json               # NPM configuration file
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/team-knowledge-hub-backend.git
   ```

2. Navigate to the project directory:
   ```
   cd team-knowledge-hub-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection string, JWT secret key, and frontend URL:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   ```

## Usage

To start the application, run:
```
npm start
```

The server will start on the specified port (default is 5000). You can then access the API endpoints for user registration, login, team management, and invitations.

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user and receive a JWT token

### Team Management
- `POST /api/team`: Create a new team
- `POST /api/team/invite/:teamId`: Invite a user to a team
- `POST /api/team/accept-invitation/:token`: Accept an invitation to join a team

### Cron Job
- A cron job runs daily at midnight to clean up expired invitations from the database.

## Testing the Invitation System

1. **Send an Invitation**:
   - Use the `/api/team/invite/:teamId` endpoint to send an invitation.
   - Check the server logs for the Ethereal email preview URL.

2. **Accept the Invitation**:
   - Use the `/api/team/accept-invitation/:token` endpoint to accept the invitation.

3. **Expired Invitations**:
   - Expired invitations are automatically cleaned up by the cron job.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.