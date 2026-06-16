const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const dietRoutes = require("./routes/dietRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

dotenv.config();
connectDB();
const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Nutrition Assistant API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});