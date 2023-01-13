import { PlayerType } from "isaac-typescript-definitions";

export interface SeasonDescription {
  X: int;
  Y: int;
  numChars: int;
  charPositions: ReadonlyArray<
    readonly [character: PlayerType, x: int, y: int]
  >;
  buildPositions?: ReadonlyArray<readonly [buildIndex: int, x: int, y: int]>;
  numBuildVetos?: int;
  hidden?: boolean;
}
