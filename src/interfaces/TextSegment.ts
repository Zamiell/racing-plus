import type { HexColors } from "../enums/HexColors";

export interface TextSegment {
  readonly text: string;
  readonly color?: HexColors;
}
