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
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function racePostNPCInitDarkEsau(npc: EntityNPC): void {
  if (!config.clientCommunication) {
    return;
  }

  if (npc.Variant === asNumber(DarkEsauVariant.DARK_ESAU)) {
    checkDuplicatedDarkEsau(npc);
  }
}

/**
 * If Tainted Jacob revives from seeded death, a second Esau can spawn. Prevent this from happening.
 */
function checkDuplicatedDarkEsau(npc: EntityNPC) {
  if (!anyPlayerIs(PlayerType.JACOB_B, PlayerType.JACOB_2_B)) {
    return;
  }

  // The NPC that is in the PostNPCInit callback will not be included in the "countEntities" call,
  // so we need to add one.
  const numDarkEsaus =
    countEntities(EntityType.DARK_ESAU, DarkEsauVariant.DARK_ESAU) + 1;
  const normalAmountOfDarkEsaus = getNormalAmountOfDarkEsaus();
  if (numDarkEsaus > normalAmountOfDarkEsaus) {
    // Both normal Dark Esau's and Dark Esau pits should be removed in an identical manner. (The pit
    // spawns on the same frame after the Dark Esau does.)
    npc.Remove();
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
