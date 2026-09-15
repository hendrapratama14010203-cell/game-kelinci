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
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kebun-monitor";

app.use(cors());
app.use(express.json());

// Serve folder foto agar bisa diakses langsung dari browser/dashboard
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sajikan frontend (halaman monitoring & dashboard) dari server yang sama
app.use(express.static(path.join(__dirname, "public")));

// Routes API
app.use("/api/monitoring", monitoringRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Terhubung ke MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server jalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal konek MongoDB:", err.message);
    process.exit(1);
  });
