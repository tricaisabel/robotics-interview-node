import { LabelModel } from "../models/labelModel";
import { SessionModel } from "../models/sessionModel";
import { SessionDocument } from "../types/sessionDocument";
import { LabelDocument } from "../types/labelDocument";
import { DetectionStats, HasSessionId, Label, Session } from "@shared-types/index";

export const resolvers = {
  Query: {
    /**
     * List all sessions
     */
    sessions: async (): Promise<Session[]> => {
      const sessions = await SessionModel.find().sort({ started: -1 });
      return sessions.map(SessionDocument.toPublic);
    },
    /**
     * Find session by id
     */
    session: async (
      _: unknown,
      args: { id: string }
    ): Promise<Session | null> => {
      const session = await SessionModel.findById(args.id);
      return SessionDocument.toPublic(session);
    },
    /**
     * Find current session (not ended yet)
     */
    current_session: async (): Promise<Session | null> => {
      const session = await SessionModel.findOne({ ended: null });

      return session ? SessionDocument.toPublic(session) : null;
    },
    /**
     * Get session labels
     */
    labels: async (_: unknown, context: HasSessionId): Promise<Label[]> => {
      const labels = await LabelModel.find({
        "data.session": context.sessionId,
      });

      return labels.map(LabelDocument.toPublic);
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

      const session = await SessionModel.findOneAndUpdate(
        { _id: sessionId, ended: null },
        {
          detections: detectionStats.detections,
          resolved: detectionStats.resolved,
        },
        { new: true }
      );

      return SessionDocument.toPublic(session);
    },
    /**
     * Create new session if one is not already running
     */
    start_session: async (): Promise<Session> => {
      const activeSession = await SessionModel.findOne({ ended: null });

      if (activeSession) {
        throw new Error(
          "An active session is already running. End it before starting a new one."
        );
      }

      const session = await SessionModel.create({
        started: new Date(),
        ended: null,
        detections: null,
        resolved: null,
      });

      return SessionDocument.toPublic(session);
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

      const session = await SessionModel.findOneAndUpdate(
        { _id: sessionId, ended: null },
        {
          ended: new Date(),
        },
        { new: true }
      );

      return SessionDocument.toPublic(session);
    },
  },
};
