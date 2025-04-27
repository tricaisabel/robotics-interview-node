import { Request, Response } from "express";
import { LabelModel } from "../models/labelModel";

export const getImageById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const label = await LabelModel.findById(id);

    if (!label?.image) {
      res.status(404).send("Image not found");
      return;
    }

    res.set("Content-Type", "image/jpeg");
    res.send(label.image);
  } catch (err) {
    res.status(500).send(`Error retrieving image ${err}`);
  }
};
