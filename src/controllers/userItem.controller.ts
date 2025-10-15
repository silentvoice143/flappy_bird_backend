import { Request, Response } from "express";
import { UserItem } from "../models/user-item.model";
import { StoreItem } from "../models/store.model";

/**
 * @desc Create a new UserItem (purchase an item)
 * @route POST /api/user-items
 */
export const createUserItem = async (req: Request, res: Response) => {
  const { userId, storeItemId } = req.body;

  if (!userId || !storeItemId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Check if the item exists
  const storeItem = await StoreItem.findById(storeItemId);
  if (!storeItem) {
    return res.status(404).json({ message: "Store item not found." });
  }

  // Prevent duplicate ownership
  const existing = await UserItem.findOne({
    user: userId,
    storeItem: storeItemId,
  });
  if (existing) {
    return res.status(409).json({ message: "User already owns this item." });
  }

  const newUserItem = new UserItem({
    user: userId,
    storeItem: storeItemId,
  });

  await newUserItem.save();
  return res
    .status(201)
    .json({ message: "Item purchased successfully.", data: newUserItem });
};

/**
 * @desc Get all items for a user
 * @route GET /api/user-items?userId=<userId>
 */
export const getUserItems = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId query parameter." });
  }

  const items = await UserItem.find({ user: userId })
    .populate("storeItem")
    .sort({ purchased_at: -1 });

  return res.status(200).json({ success: true, data: items });
};

/**
 * @desc Get a single UserItem by ID
 * @route GET /api/user-items/:id
 */
export const getUserItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await UserItem.findById(id).populate("storeItem");

  if (!item) return res.status(404).json({ message: "User item not found." });

  return res.status(200).json({ success: true, data: item });
};

/**
 * @desc Update a UserItem (e.g., equip/unequip)
 * @route PUT /api/user-items/:id
 */
export const updateUserItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedItem = await UserItem.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("storeItem");

  if (!updatedItem)
    return res.status(404).json({ message: "User item not found." });

  return res
    .status(200)
    .json({ message: "User item updated successfully.", data: updatedItem });
};

/**
 * @desc Delete a UserItem
 * @route DELETE /api/user-items/:id
 */
export const deleteUserItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedItem = await UserItem.findByIdAndDelete(id);

  if (!deletedItem)
    return res.status(404).json({ message: "User item not found." });

  return res.status(200).json({ message: "User item deleted successfully." });
};
