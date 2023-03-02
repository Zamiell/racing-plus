import {
  EffectVariant,
  GridEntityType,
  HeavenLightDoorSubType,
  LevelStage,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  getEffects,
  getRandom,
  inRoomType,
  ModCallbackCustom,
  onStage,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { CUSTOM_CHALLENGES_SET } from "../../../speedrun/constants";
import { ChallengeModFeature } from "../../ChallengeModFeature";

/**
 * Since we are in a challenge that has 'altpath="true"', the game will always spawn a beam of light
 * going to the Cathedral. In vanilla, there would be a 50% chance to spawn a trapdoor. Emulate the
 * vanilla functionality.
 */
export class EmulateVanillaWomb2IAmError extends ChallengeModFeature {
  challenge = CUSTOM_CHALLENGES_SET;

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.checkWomb2IAmError();
  }

  checkWomb2IAmError(): void {
    const level = game.GetLevel();
    const room = game.GetRoom();
    const levelSeed = level.GetDungeonPlacementSeed();

    if (!onStage(LevelStage.WOMB_2) || !inRoomType(RoomType.ERROR)) {
      return;
    }

    const trapdoorChance = getRandom(levelSeed);
    if (trapdoorChance < 0.5) {
      return;
    }

    const heavenDoors = getEffects(
      EffectVariant.HEAVEN_LIGHT_DOOR,
      HeavenLightDoorSubType.HEAVEN_DOOR,
    );
    for (const heavenDoor of heavenDoors) {
      heavenDoor.Remove();
      const gridIndex = room.GetGridIndex(heavenDoor.Position);
      spawnGridEntityWithVariant(
        GridEntityType.TRAPDOOR,
        TrapdoorVariant.NORMAL,
        gridIndex,
      );
    }
  }
}
