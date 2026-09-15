import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Monitoring from "../models/Monitoring.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `kebun-${timestamp}${ext}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

// POST /api/monitoring - kirim foto + lokasi baru
router.post("/", upload.single("foto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Foto tidak ditemukan" });
    }

    const { latitude, longitude, keterangan } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Lokasi (latitude/longitude) wajib diisi" });
    }

    const data = new Monitoring({
      fotoPath: `/uploads/${req.file.filename}`,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      keterangan: keterangan || "",
    });

    await data.save();
    res.status(201).json({ message: "Data berhasil disimpan", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menyimpan data" });
  }
});

// GET /api/monitoring - ambil semua data (untuk dashboard)
router.get("/", async (req, res) => {
  try {
    const data = await Monitoring.find().sort({ waktu: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// DELETE /api/monitoring/:id - hapus data (opsional, untuk maintenance)
router.delete("/:id", async (req, res) => {
  try {
    const item = await Monitoring.findByIdAndDelete(req.params.id);
    if (item) {
      const filePath = path.join(uploadDir, path.basename(item.fotoPath));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: "Data dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghapus data" });
  }
});

export default router;
