import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import mongoConnect from "./mongoDB/mongo.connect";
import { globalException } from "./exception/global-exception-handler";

// -----------seeds----------------
import { ensureSuperAdmin } from "./seed/super-admin";
import { ensureDefaultBird } from "./seed/default-bird";
import { ensureDefaultTier } from "./seed/default-tier";
import { ensureDefaultSeason } from "./seed/default-season";

// ------------routes----------
import authRoutes from "./routes/auth.routes";
import birdRoutes from "./routes/bird.routes";
import tiersRoutes from "./routes/tier.routes";
import storeRoutes from "./routes/store.routes";
import userItemRoutes from "./routes/userItem.routes";

//--------------cron-jobs----------------
import { seasonCronJob } from "./jobs/season-updater";

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
app.use("/api/birds", birdRoutes);
app.use("/api/tiers", tiersRoutes);
app.use("/api/store-items", storeRoutes);
app.use("/api/user-items", userItemRoutes);

app.get("/", (req, res) => {
  console.log("hello");
});

app.use(globalException);

// Connect to MongoDB and start server
const startServer = async () => {
  await mongoConnect();
  ensureSuperAdmin();
  ensureDefaultBird();
  ensureDefaultTier();
  ensureDefaultSeason();
  seasonCronJob();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🚀 Swagger is running on http://localhost:${PORT}/api-docs`);
  });
};

startServer();
