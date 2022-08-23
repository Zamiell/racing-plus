import {
  DogmaVariant,
  FadeoutTarget,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  asNumber,
  game,
  runInNGameFrames,
  spawnPickup,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { Season3Goal } from "../constants";
import v from "../v";

const GAME_FRAMES_UNTIL_SCREEN_FADES_TO_BLACK = 120;

// EntityType.DOGMA (950)
export function season3PostEntityKillDogma(entity: Entity): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  if (entity.Variant !== asNumber(DogmaVariant.ANGEL_PHASE_2)) {
    return;
  }

  if (!v.persistent.remainingGoals.includes(Season3Goal.DOGMA)) {
    return;
  }

  v.run.killedDogma = true;

  // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
  const centerPos = g.r.GetCenterPos();
  spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);

  // If the player does not take the Checkpoint by the time the screen fades to black, the game will
  // try to warp them to the Beast room, but this will not work from stage 6, so the game will
  // crash. To work around this, return the player to the menu to emulate what would happen if they
  // saved and quit.
  runInNGameFrames(() => {
    game.Fadeout(1, FadeoutTarget.MAIN_MENU);
  }, GAME_FRAMES_UNTIL_SCREEN_FADES_TO_BLACK);
}
