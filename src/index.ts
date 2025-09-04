import express from "express";
import { connectDB } from "./config/db";
import assetsRouter from "./routes/assets";

const app = express();
const PORT = process.env.PORT

// Middleware
app.use(express.json());

// Routes
app.use("/assets", assetsRouter);

// Start server after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
