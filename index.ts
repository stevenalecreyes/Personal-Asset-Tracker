import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());


// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Personal Asset Tracker API is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});