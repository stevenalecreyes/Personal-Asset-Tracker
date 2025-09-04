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

//PUT update asset
router.put("/:id", (req: Request, res: Response) => {
  const assetId = req.params.id;
  const { name, category, value } = req.body || {};

  const asset = assets.find((a) => a.id === assetId);
  if (!asset) {
    return res.status(404).json({ error: "Asset not found" });
  }

  if (name) asset.name = name;
  if (category) asset.category = category;
  if (typeof value === "number") asset.value = value;

  res.json(asset);
});

// DELETE asset
router.delete("/:id", (req: Request, res: Response) => {
  const assetId = req.params.id;

  const index = assets.findIndex((a) => a.id === assetId);
  if (index === -1) {
    return res.status(404).json({ error: "Asset not found" });
  }

  const deleted = assets.splice(index, 1);
  res.json({ message: "Asset deleted", deleted: deleted[0] });
});

export default router;
