import upload from "../middleware/uploadMiddleware.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createAsset, getMyAssets, getPublicAssets } from "../controllers/assetController.js";
const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), createAsset);
router.get("/", getPublicAssets);        
router.get("/my", authMiddleware, getMyAssets);
export default router;