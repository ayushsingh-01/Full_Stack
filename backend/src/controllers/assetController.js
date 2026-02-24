import {
  createAssetService,
  getMyAssetsService,
  getPublicAssetsService
} from "../services.js/assetService.js";

export const createAsset = async (req, res) => {
  try {
    const asset = await createAssetService(
      req.file,
      req.body,
      req.user.id
    );

    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPublicAssets = async (req, res) => {
  try {
    const data = await getPublicAssetsService(req.query);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getMyAssets = async (req, res) => {
  try {
    const data = await getMyAssetsService(req.user.id, req.query);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};