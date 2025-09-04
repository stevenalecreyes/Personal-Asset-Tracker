
import { Router } from "express";
import { createAsset, getAssets, getAssetById, updateAsset, deleteAsset } from "../controllers/assetController";

const router = Router();

// Create
router.post("/", createAsset);

// Read all
router.get("/", getAssets);

// Read one
router.get("/:id", getAssetById);

// Update
router.put("/:id", updateAsset);

// Delete
router.delete("/:id", deleteAsset);

export default router;
