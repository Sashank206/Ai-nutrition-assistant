const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Nutrition Assistant API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});