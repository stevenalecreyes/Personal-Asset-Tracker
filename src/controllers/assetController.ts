import { Request, Response } from "express";
import { Asset } from "../models/Asset";

export const createAsset = async (req: Request, res: Response) => {
    try {
        const asset = new Asset(req.body);
        await asset.save();
        res.status(201).json(asset);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};

export const getAssets = async (req: Request, res: Response) => {
    try {
        const assets = await Asset.find();
        res.json(assets);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};

export const getAssetById = async (req: Request, res: Response) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: "Asset not found" });
        res.json(asset);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
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
};

export const deleteAsset = async (req: Request, res: Response) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) return res.status(404).json({ message: "Asset not found" });
        res.json({ message: "Asset deleted" });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};
