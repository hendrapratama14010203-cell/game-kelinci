import mongoose from "mongoose";

const monitoringSchema = new mongoose.Schema({
  fotoPath: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  keterangan: {
    type: String,
    default: "",
  },
  waktu: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Monitoring", monitoringSchema);
