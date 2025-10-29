// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { axiosInstance } = require("../src/axios");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/adminDashboardDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ==================== Schemas ====================
const reportSchema = new mongoose.Schema({
  title: String,
  createdAt: { type: Date, default: Date.now },
  summary: String,
});

const uploadSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now },
  status: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
});

// ==================== Transaction Schema ====================
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  status: { type: String, enum: ["successful", "unsuccessful"], required: true },
  reference: String,
  productCode: String,
  accountNumber: String,
  createdAt: { type: Date, default: Date.now },
});

// Model
const Transaction = mongoose.model("Transaction", transactionSchema);

// // Models
const Report = mongoose.model("Report", reportSchema);
const Upload = mongoose.model("Upload", uploadSchema);
const User = mongoose.model("User", userSchema);

// ==================== Routes ====================

// Default Route
app.get("/", (req, res) => {
  res.send("Hello from Admin Dashboard backend 🚀");
});

// Reports
app.get("/api/reports", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

app.post("/api/reports", async (req, res) => {
  const newReport = new Report(req.body);
  await newReport.save();
  res.json(newReport);
});

// Uploads
app.get("/api/uploads", async (req, res) => {
  const uploads = await Upload.find();
  res.json(uploads);
});

app.post("/api/uploads", async (req, res) => {
  const newUpload = new Upload(req.body);
  await newUpload.save();
  res.json(newUpload);
});

// Home (Dashboard stats)
// app.get("/api/home", async (req, res) => {
//   try {
//     const usersCount = await User.countDocuments();
//     const reportsCount = await Report.countDocuments();
//     const uploadsCount = await Upload.countDocuments();

//     res.json({
//       totalUsers: usersCount,
//       totalReports: reportsCount,
//       totalUploads: uploadsCount,
//     });
//   } catch (err) {
//     console.error("Error fetching dashboard stats:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Home (Dashboard stats)
app.get("/api/home", async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const successfulTransactions = await Transaction.countDocuments({ status: "successful" });
    const unsuccessfulTransactions = await Transaction.countDocuments({ status: "unsuccessful" });

    res.json({
      totalTransactions,
      successfulTransactions,
      unsuccessfulTransactions,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all transactions
app.get("https://jsonplaceholder.typicode.com/users", async (req, res) => {
  const transactions = await Transaction.find().populate("userId", "name email");
  res.json(transactions);
});

// Create a new transaction
app.post("https://jsonplaceholder.typicode.com/users", async (req, res) => {
  const newTransaction = new Transaction(req.body);
  await newTransaction.save();
  res.json(newTransaction);
});



router.post("/", async (req, res) => {
  try {
    const { name, email, membershipId, transactionStatus, productCode, transactionReference, accountNumber, amount } = req.body;

    const newUser = new User({
      name,
      email,
      membershipId,
      transactionStatus,
      productCode,
      transactionReference,
      accountNumber,
      amount,
      createdAt: new Date()
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;

// LOGIN ROUTE
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If login is successful
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});


// ==================== WebSocket for Real-time Updates ====================
io.on("connection", (socket) => {
  console.log("⚡ New client connected");

  setInterval(() => {
    socket.emit("transactionUpdate", {
      totalTransactions: Math.floor(Math.random() * 100),
      successfulTransactions: Math.floor(Math.random() * 50),
      unsuccessfulTransactions: Math.floor(Math.random() * 50),
      chartData: [
        { time: "00:00", count: Math.floor(Math.random() * 10) },
        { time: "06:00", count: Math.floor(Math.random() * 10) },
        { time: "12:00", count: Math.floor(Math.random() * 10) },
        { time: "18:00", count: Math.floor(Math.random() * 10) },
      ]
    });
  }, 5000);
});

