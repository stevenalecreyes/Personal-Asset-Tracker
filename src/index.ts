import express from "express";
import { Request, Response } from "express";
import assetRoutes from "./routes/assets";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

app.use("/assets", assetRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});