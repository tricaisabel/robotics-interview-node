import { LabelModel } from "../models/labelModel";
import { SessionModel } from "../models/sessionModel";
import { DetectionStats } from "../types/detectionStats";
import { HasSessionId } from "../types/hasSessionId";
import { Label } from "../types/Label";
import Session from "../types/Session";

export const resolvers = {
  Query: {
    /**
     * List all sessions
     */
    sessions: async (): Promise<Session[]> => {
      return await SessionModel.find().sort({ started: -1 });
    },
    /**
     * Find session by id
     */
    session: async (
      _: unknown,
      args: { id: string }
    ): Promise<Session | null> => {
      return await SessionModel.findById(args.id);
    },
    /**
     * Find current session (not ended yet)
     */
    current_session: async (): Promise<Session | null> => {
      return await SessionModel.findOne({ ended: null });
    },
    /**
     * Get session labels
     */
    labels: async (_: unknown, context: HasSessionId): Promise<Label[]> => {
      const labels = await LabelModel.find({
        "data.session": context.sessionId,
      });

      return labels.map((label) => ({
        id: label.id,
        ...label,
        session: label.session.toHexString(),
        image: label.image?.toString("base64") ?? null,
      }));
    },
  },
  Mutation: {
    /**
     * Set session detection stats (detections, resolved counts)
     */
    set_session_stats: async (
      _: unknown,
      detectionStats: DetectionStats,
      context: HasSessionId
    ): Promise<Session> => {
      const sessionId = context.sessionId;

      if (!sessionId) {
        throw new Error("Session ID not provided");
      }

      return await SessionModel.findOneAndUpdate(
        { _id: sessionId, ended: null },
        {
          detections: detectionStats.detections,
          resolved: detectionStats.resolved,
        },
        { new: true }
      );
    },
    /**
     * Create new session if one is not already running
     */
    start_session: async (): Promise<Session> => {
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
    /**
     * End session by id
     */
    end_session: async (
      _: unknown,
      __: unknown,
      context: HasSessionId
    ): Promise<Session> => {
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
