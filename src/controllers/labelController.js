import { Label } from "../models/label.js";

export const getImageById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('hello')
    const label = await Label.findById(id);

    if (label?.image == null) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", "image/jpeg");
    res.send(label.image);
  } catch (err) {
    res.status(500).send(`Error retrieving image ${err}`);
  }
};
