import { Bird } from "../models/bird.model";

export const ensureDefaultBird = async () => {
  // Check if any bird with type "rookie" exists
  let rookieBird = await Bird.findOne({ type: "rookie" });

  if (!rookieBird) {
    // If not, create a default rookie bird
    rookieBird = new Bird({
      name: "Default Rookie",
      type: "rookie",
      lvl: 1,
      multiplier: 1,
      points: 0,
      imageUrl:
        "/uploads/birds/Gemini_Generated_Image_4inxo14inxo14inx-removebg-preview-1760384581105.png", // optional
    });

    await rookieBird.save();
    console.log("Default rookie bird created:", rookieBird._id);
  } else {
    console.log("Rookie bird already exists:", rookieBird._id);
  }

  return rookieBird; // return the rookie bird for convenience
};
