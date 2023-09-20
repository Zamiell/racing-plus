/* eslint-disable max-classes-per-file */

import type { PlayerType } from "isaac-typescript-definitions";
import type { Decrement, Range } from "isaacscript-common";
import type { RANDOM_STARTING_BUILDS } from "../classes/features/speedrun/randomStartingBuild/constants";

export interface SeasonDescription {
  readonly X: int;
  readonly Y: int;
  readonly numChars: int;
  readonly charPositions: readonly CharPosition[];
  readonly buildPositions?: readonly BuildPosition[];
  readonly numBuildVetos?: int;
  readonly hidden?: boolean;
}

export class CharPosition {
  readonly character: PlayerType;
  readonly x: int;
  readonly y: int;

  constructor(character: PlayerType, x: int, y: int) {
    this.character = character;
    this.x = x;
    this.y = y;
  }
}

export class BuildPosition {
  readonly buildIndex: int;
  readonly x: int;
  readonly y: int;

  constructor(
    buildIndex: Range<0, Decrement<typeof RANDOM_STARTING_BUILDS.length>>,
    x: int,
    y: int,
  ) {
    this.buildIndex = buildIndex;
    this.x = x;
    this.y = y;
  }
}
