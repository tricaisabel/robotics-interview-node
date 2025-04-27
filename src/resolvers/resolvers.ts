import { LabelModel } from "../models/labelModel";
import { SessionModel } from "../models/sessionModel";

// Define GraphQL Resolvers with TypeScript
export const resolvers = {
  Query: {
    sessions: async (): Promise<any[]> => {
      return await SessionModel.find().sort({ started: -1 });
    },
    session: async (_: any, args: { id: string }): Promise<any | null> => {
      return await SessionModel.findById(args.id);
    },
    current_session: async (): Promise<any | null> => {
      return await SessionModel.findOne({ ended: null });
    },
    labels: async (
      _: any,
      { sessionId }: { sessionId: string }
    ): Promise<any[]> => {
      const labels = await LabelModel.find({ "data.session": sessionId });

      return labels.map((label) => ({
        id: label.id,
        ...label.toObject(),
        image: label.image?.toString("base64") ?? null,
      }));
    },
  },
  Mutation: {
    set_session_stats: async (
      _: any,
      { detections, resolved }: { detections: number; resolved: number },
      context: any
    ): Promise<void> => {
      const sessionId = context.sessionId;

      if (!sessionId) {
        throw new Error("Session ID not provided");
      }
      // TOD: return updated document
      await SessionModel.findOneAndUpdate(
        { _id: sessionId, ended: null },
        {
          detections,
          resolved,
        },
        { new: true }
      );
    },
    start_session: async (): Promise<any> => {
      const session = await SessionModel.findOne({ ended: null });
      if (session) {
        throw new Error(
          "An active session is already running. End it before starting a new one."
        );
      }
      return await SessionModel.create({
        started: new Date(),
        ended: null,
        detections: null,
        resolved: null,
      });
    },
    end_session: async (_: any, __: any, context: any): Promise<any> => {
      const sessionId = context.sessionId;
      if (!sessionId) {
        throw new Error("Session ID not provided");
      }
      return await SessionModel.findOneAndUpdate(
        { _id: sessionId, ended: null },
        {
          ended: new Date(),
        },
        { new: true }
      );
    },
  },
};
