import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import mongoConnect from "./mongoDB/mongo.connect";
import authRoutes from "./routes/auth.routes";
import { globalException } from "./exception/global-exception-handler";
import { ensureSuperAdmin } from "./utils/superAdmin";

dotenv.config();
const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "Authentication API documentation",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // change if your base path differs
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("hello");
});

app.use(globalException);

// Connect to MongoDB and start server
const startServer = async () => {
  await mongoConnect();
  ensureSuperAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🚀 Swagger is running on http://localhost:${PORT}/api-docs`);
  });
};

startServer();
