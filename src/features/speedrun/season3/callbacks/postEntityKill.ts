import { DogmaVariant, PickupVariant } from "isaac-typescript-definitions";
import { asNumber, spawnPickup } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { Season3Goal } from "../constants";
import v from "../v";

export function season3PostEntityKillDogma(entity: Entity): void {
  const challenge = Isaac.GetChallenge();

  if (challenge === ChallengeCustom.SEASON_3) {
    return;
  }

  if (entity.Variant !== asNumber(DogmaVariant.ANGEL_PHASE_2)) {
    return;
  }

  if (v.persistent.remainingGoals.includes(Season3Goal.DOGMA)) {
    // The Big Chest will be replaced by a Checkpoint or Trophy on the subsequent frame.
    const centerPos = g.r.GetCenterPos();
    spawnPickup(PickupVariant.BIG_CHEST, 0, centerPos);
  }
}
