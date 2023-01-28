import { PlayerType } from "isaac-typescript-definitions";

export interface SeasonDescription {
  readonly X: int;
  readonly Y: int;
  readonly numChars: int;
  readonly charPositions: ReadonlyArray<
    readonly [character: PlayerType, x: int, y: int]
  >;
  readonly buildPositions?: ReadonlyArray<
    readonly [buildIndex: int, x: int, y: int]
  >;
  readonly numBuildVetos?: int;
  readonly hidden?: boolean;
}
