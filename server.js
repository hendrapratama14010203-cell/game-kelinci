import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import monitoringRoutes from "./routes/monitoring.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/kebun-monitor";

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());

// ================================
// UPLOADS
// ================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ================================
// FRONTEND
// ================================

app.use(
  express.static(path.join(__dirname, "public"))
);

// ================================
// API
// ================================

app.use("/api/monitoring", monitoringRoutes);

// ================================
// HALAMAN UTAMA
// ================================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

// ================================
// MONGODB
// ================================

let mongoConnected = false;

async function connectMongoDB() {
  if (mongoConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);

    mongoConnected = true;

    console.log("✅ Terhubung ke MongoDB");
  } catch (error) {
    console.error(
      "❌ Gagal konek MongoDB:",
      error.message
    );

    throw error;
  }
}

// ================================
// DATABASE MIDDLEWARE
// ================================

app.use(async (req, res, next) => {
  try {
    await connectMongoDB();

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database tidak terhubung",
      error: error.message
    });
  }
});

// ================================
// VERCEL
// ================================

export default app;
