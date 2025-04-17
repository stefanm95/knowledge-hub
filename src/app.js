import express from "express";
import cron from "node-cron";
import { cleanupExpiredInvitations } from "./controllers/teamController.js"; // Adjust the path as necessary
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js"; // Adjust the path as necessary
import teamRoutes from "./routes/teamRoutes.js"; // Adjust the path as necessary
import folderRoutes from "./routes/folderRoutes.js"; // Adjust the path as necessary
import documentRoutes from "./routes/documentRoutes.js"; // Adjust the path as necessary
import swaggerDocs from './utils/swaggerConfig.js';
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
//Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//Swagger UI setup

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/folders", folderRoutes); // Ensure folderRoutes is imported correctly
app.use("/api/documents", documentRoutes); // Ensure fileRoutes is imported correctly

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup task...");
  await cleanupExpiredInvitations();
}
);
