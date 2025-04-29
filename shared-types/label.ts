import { LabelData } from "./labelData";

export type LabelBase = {
  readonly uuid: string;
  readonly source_uuid: string | null;
  readonly data: LabelData;
};

export type Label = LabelBase & {
  readonly id: string;
  readonly image: string | null;
  readonly session: string;
  readonly timestamp: string;
};
