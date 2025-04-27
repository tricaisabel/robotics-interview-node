var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LabelModel } from "../models/labelModel";
export const getImageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const label = yield LabelModel.findById(id);
        if (!(label === null || label === void 0 ? void 0 : label.image)) {
            res.status(404).send("Image not found");
            return;
        }
        res.set("Content-Type", "image/jpeg");
        res.send(label.image);
    }
    catch (err) {
        res.status(500).send(`Error retrieving image ${err}`);
    }
});
