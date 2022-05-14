import { PlayerType } from "isaac-typescript-definitions";

export interface SeasonDescription {
  X: int;
  Y: int;
  numChars: int;
  charPositions: Array<[character: PlayerType, x: int, y: int]>;
  buildPositions?: Array<[buildIndex: int, x: int, y: int]>;
  numBuildVetos?: int;
  hidden?: boolean;
}
