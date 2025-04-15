# Team Knowledge Hub Backend

This project is a backend application for a team knowledge hub, built using Node.js, Express, and MongoDB. It provides user authentication features using JWT (JSON Web Tokens).

## Features

- User registration and login
- JWT-based authentication
- MongoDB for data storage

## Folder Structure

```
team-knowledge-hub-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── db.js            # Database connection logic
│   ├── controllers
│   │   └── authController.js # Handles user authentication
│   ├── middlewares
│   │   └── authMiddleware.js  # Middleware for JWT verification
│   ├── models
│   │   └── User.js           # User model definition
│   ├── routes
│   │   └── authRoutes.js     # Authentication routes
│   └── utils
│       └── jwtHelper.js      # Utility functions for JWT
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

4. Create a `.env` file in the root directory and add your MongoDB connection string and JWT secret key:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Usage

To start the application, run:
```
npm start
```

The server will start on the specified port (default is 3000). You can then access the API endpoints for user registration and login.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.