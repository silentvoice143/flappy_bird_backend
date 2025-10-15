import { Request, Response } from "express";
import { StoreItem } from "../models/store.model";
import { Bird } from "../models/bird.model";

/**
 * @desc Create a new store item
 * @route POST /api/store-items
 */
const ITEM_MODELS: Record<string, any> = {
  Bird,
};

export const createStoreItem = async (req: Request, res: Response) => {
  const { name, price, itemType, itemId, isAvailable } = req.body;

  if (!name || !price || !itemType || !itemId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Check if the itemType is valid
  const ItemModel = ITEM_MODELS[itemType];
  if (!ItemModel) {
    return res.status(400).json({ message: `Invalid itemType: ${itemType}` });
  }

  // Check if the referenced item exists
  const itemExists = await ItemModel.findById(itemId);
  if (!itemExists) {
    return res
      .status(404)
      .json({ message: `No ${itemType} found with id ${itemId}` });
  }

  // Create the store item
  const newItem = new StoreItem({
    name,
    price,
    itemType,
    itemId,
    isAvailable,
  });

  await newItem.save();
  return res
    .status(201)
    .json({ message: "Store item created successfully.", data: newItem });
};

/**
 * @desc Get all store items with optional filters
 * @route GET /api/store-items
 */
export const getAllStoreItems = async (req: Request, res: Response) => {
  try {
    const filters: any = {};

    // Filter by itemType
    if (req.query.itemType) filters.itemType = req.query.itemType;

    // Filter by availability
    if (req.query.isAvailable !== undefined)
      filters.isAvailable = req.query.isAvailable === "true";

    // Filter by minPrice and maxPrice
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }

    // Text search by name
    if (req.query.search) {
      filters.$text = { $search: req.query.search as string };
    }

    // Fetch items with filters, populate itemId, sort by creation date descending
    const items = await StoreItem.find(filters)
      .populate("itemId")
      .sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (error: any) {
    console.error("Error fetching store items:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * @desc Get a single store item by ID
 * @route GET /api/store-items/:id
 */
export const getStoreItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await StoreItem.findById(id).populate("itemId");

  if (!item) return res.status(404).json({ message: "Store item not found." });

  return res.status(200).json(item);
};

/**
 * @desc Update a store item
 * @route PUT /api/store-items/:id
 */
export const updateStoreItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedItem = await StoreItem.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedItem)
    return res.status(404).json({ message: "Store item not found." });

  return res.status(200).json({
    message: "Store item updated successfully.",
    data: updatedItem,
  });
};

/**
 * @desc Delete a store item
 * @route DELETE /api/store-items/:id
 */
export const deleteStoreItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedItem = await StoreItem.findByIdAndDelete(id);

  if (!deletedItem)
    return res.status(404).json({ message: "Store item not found." });

  return res.status(200).json({ message: "Store item deleted successfully." });
};
