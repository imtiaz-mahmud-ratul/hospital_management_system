const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// Patient model
const Patient = mongoose.model("Patient", new mongoose.Schema({
  name: String,
  age: Number,
  status: { type: String, default: "admitted" }
}));

// Routes
app.get("/patients", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

app.post("/patients", async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.status(201).json(patient);
});

app.get("/patients/:id", async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
});

app.put("/patients/:id", async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(patient);
});

app.delete("/patients/:id", async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

app.listen(5000, "127.0.0.1", () => {
  console.log("🚀 Server running on http://127.0.0.1:5000");
});
