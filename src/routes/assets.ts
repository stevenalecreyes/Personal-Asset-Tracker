import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

interface Asset {
  id: string;
  name: string;
  category: string;
  value: number;
  createdAt: Date;
}

const router = Router();

// In-memory asset list (temporary storage)
let assets: Asset[] = [];

// GET all assets
router.get("/", (req: Request, res: Response) => {
  res.json(assets);
});

// POST new asset
router.post("/", (req: Request, res: Response) => {
  const { name, category, value } = req.body;

  if (!name || !category || typeof value !== "number") {
    return res.status(400).json({ error: "Invalid asset data" });
  }

  const newAsset: Asset = {
    id: uuidv4(),
    name,
    category,
    value,
    createdAt: new Date(),
  };

  assets.push(newAsset);
  res.status(201).json(newAsset);
});

export default router;
