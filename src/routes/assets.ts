import { Router, Request, Response } from "express";
import { Asset } from "../models/Asset";

const router = Router();

// Create
router.post("/", async (req: Request, res: Response) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Read all
router.get("/", async (_req: Request, res: Response) => {
  const assets = await Asset.find();
  res.json(assets);
});

// Read one
router.get("/:id", async (req: Request, res: Response) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json(asset);
});

// Update
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Delete
router.delete("/:id", async (req: Request, res: Response) => {
  const asset = await Asset.findByIdAndDelete(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json({ message: "Asset deleted" });
});

export default router;
