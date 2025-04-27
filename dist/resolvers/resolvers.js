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
import { SessionModel } from "../models/sessionModel";
// Define GraphQL Resolvers with TypeScript
export const resolvers = {
    Query: {
        sessions: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield SessionModel.find().sort({ started: -1 });
        }),
        session: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield SessionModel.findById(args.id);
        }),
        current_session: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield SessionModel.findOne({ ended: null });
        }),
        labels: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { sessionId }) {
            const labels = yield LabelModel.find({ "data.session": sessionId });
            return labels.map((label) => {
                var _a, _b;
                return (Object.assign(Object.assign({ id: label.id }, label.toObject()), { image: (_b = (_a = label.image) === null || _a === void 0 ? void 0 : _a.toString("base64")) !== null && _b !== void 0 ? _b : null }));
            });
        }),
    },
    Mutation: {
        set_session_stats: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { detections, resolved }, context) {
            const sessionId = context.sessionId;
            if (!sessionId) {
                throw new Error("Session ID not provided");
            }
            // TOD: return updated document
            yield SessionModel.findOneAndUpdate({ _id: sessionId, ended: null }, {
                detections,
                resolved,
            }, { new: true });
        }),
        start_session: () => __awaiter(void 0, void 0, void 0, function* () {
            const session = yield SessionModel.findOne({ ended: null });
            if (session) {
                throw new Error("An active session is already running. End it before starting a new one.");
            }
            return yield SessionModel.create({
                started: new Date(),
                ended: null,
                detections: null,
                resolved: null,
            });
        }),
        end_session: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const sessionId = context.sessionId;
            if (!sessionId) {
                throw new Error("Session ID not provided");
            }
            return yield SessionModel.findOneAndUpdate({ _id: sessionId, ended: null }, {
                ended: new Date(),
            }, { new: true });
        }),
    },
};
