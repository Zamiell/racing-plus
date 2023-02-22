import {
  CollectibleType,
  DarkEsauVariant,
  EntityType,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  anyPlayerIs,
  asNumber,
  countEntities,
  getPlayersOfType,
  log,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function racePostNPCUpdateDarkEsau(npc: EntityNPC): void {
  if (!config.ClientCommunication) {
    return;
  }

  if (npc.Variant === asNumber(DarkEsauVariant.DARK_ESAU)) {
    checkDuplicatedDarkEsau(npc);
  }
}

/**
 * If Tainted Jacob revives from seeded death, a second Esau can spawn. Prevent this from happening.
 *
 * We have to use `POST_NPC_UPDATE` instead of `POST_NPC_INIT` so that the `countEntities` function
 * will return the correct amount.
 */
function checkDuplicatedDarkEsau(npc: EntityNPC) {
  // If Glowing Hourglass is used, then a second Dark Esau will be spawned before the first one is
  // removed. Thus, we wait until frame 1 before counting the total number of Dark Esaus. (We don't
  // want the check to run on every frame, or else all of the Dark Esaus would get removed at the
  // same time.)
  if (npc.FrameCount !== 1) {
    return;
  }

  if (!anyPlayerIs(PlayerType.JACOB_B, PlayerType.JACOB_2_B)) {
    return;
  }

  const numDarkEsaus = countEntities(
    EntityType.DARK_ESAU,
    DarkEsauVariant.DARK_ESAU,
  );
  const normalAmountOfDarkEsaus = getNormalAmountOfDarkEsaus();
  if (numDarkEsaus > normalAmountOfDarkEsaus) {
    // Both normal Dark Esau's and Dark Esau pits should be removed in an identical manner. (The pit
    // spawns on the same frame after the Dark Esau does.)
    npc.Remove();
    log(
      `Removed a Dark Esau since an extra one was detected. (There are ${numDarkEsaus} Dark Esaus and there should be ${normalAmountOfDarkEsaus}.)`,
    );
  }
}

function getNormalAmountOfDarkEsaus() {
  return anyTaintedJacobHasBirthright() ? 2 : 1;
}

function anyTaintedJacobHasBirthright() {
  const taintedJacobs = getPlayersOfType(
    PlayerType.JACOB_B,
    PlayerType.JACOB_2_B,
  );
  return taintedJacobs.some((taintedJacob) =>
    taintedJacob.HasCollectible(CollectibleType.BIRTHRIGHT),
  );
}
