import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import assetsRouter from "./routes/assets";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/assets", assetsRouter);

// Start server after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
