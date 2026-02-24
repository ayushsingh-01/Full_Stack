import Asset from "../models/asset.js";
import cloudinary from "../config/cloudinary.js";

export const createAssetService = async (file, body, userId) => {

  if (!file) {
    throw new Error("File is required");
  }

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto" 
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file.buffer);
  });

  const asset = await Asset.create({
    title: body.title,
    description: body.description,
    type: uploadResult.resource_type, 
    url: uploadResult.secure_url,
    visibility: body.visibility || "public",
    owner: userId
  });

  return asset;
};


export const getPublicAssetsService = async (query) => {

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 6;
  const skip = (page - 1) * limit;

  const search = query.search || "";

  const filter = {
    visibility: "public",
    title: { $regex: search, $options: "i" }
  };

  const assets = await Asset.find(filter)
    .populate("owner", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Asset.countDocuments(filter);

  return {
    assets,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};


export const getMyAssetsService = async (userId, query) => {

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 6;
  const skip = (page - 1) * limit;

  const assets = await Asset.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Asset.countDocuments({ owner: userId });

  return {
    assets,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};