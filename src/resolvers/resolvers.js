import { Label } from "../models/label.js";
import { Session } from "../models/session.js";

export const resolvers = {
  Query: {
    sessions: async () => {
      return await Session.find().sort({ started: -1 });
    },
    session: async (_, args) => {
      return await Session.findById(args.id);
    },
    current_session: async () => {
      return await Session.findOne({ ended: null });
    },
    labels: async (_, { sessionId }) => {
      const labels = await Label.find({ "data.session": sessionId });

      return labels.map((label) => ({
        id: label.id,
        ...label.toObject(),
        image: label.image?.toString("base64") ?? null,
      }));
    },
  },
  Mutation: {
    set_session_stats: async (_, { detections, resolved }, context) => {
      const sessionId = context.sessionId;

      if (!sessionId) {
        throw new Error("Session ID not provided");
      }
      return await Session.findOneAndUpdate(
        { _id: sessionId, ended: null },
        {
          detections,
          resolved,
        },
        { new: true }
      );
    },
    start_session: async () => {
      const session = await Session.findOne({ ended: null });
      if (session) {
        throw new Error(
          "An active session is already running. End it before starting a new one."
        );
      }
      return await Session.create({
        started: new Date(),
        ended: null,
        detections: null,
        resolved: null,
      });
    },
    end_session: async (_, __, context) => {
      const sessionId = context.sessionId;
      if (!sessionId) {
        throw new Error("Session ID not provided");
      }
      return await Session.findOneAndUpdate(
        { _id: sessionId, ended: null },
        {
          ended: new Date(),
        },
        { new: true }
      );
    },
  },
};
