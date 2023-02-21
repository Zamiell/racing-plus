import { LevelStage, StageID, StageType } from "isaac-typescript-definitions";

/** We use the Cellar because it is the cleanest floor. */
export const RACE_ROOM_LEVEL = LevelStage.BASEMENT_1;
export const RACE_ROOM_STAGE_TYPE = StageType.WRATH_OF_THE_LAMB;
export const RACE_ROOM_STAGE_ID = StageID.CELLAR;
export const RACE_ROOM_STAGE_ARGUMENT = "1a";

/** This is a Cellar room with 1 Gaper in it and no grid entities. */
export const RACE_ROOM_VARIANT = 5;

/** Equal to the vanilla run start position. */
export const RACE_ROOM_POSITION = Vector(320, 380);
