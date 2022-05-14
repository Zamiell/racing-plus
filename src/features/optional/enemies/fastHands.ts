import { EntityType, NpcState } from "isaac-typescript-definitions";
import { getNPCs } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const SHADOW_APPEAR_FRAME = 40;
const START_FRAME = SHADOW_APPEAR_FRAME - 15;
const DELAY_FRAMES = 4;

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.MOMS_HAND (213)
export function postNPCUpdateMomsHand(npc: EntityNPC): void {
  if (!config.fastHands) {
    return;
  }

  checkSpeedUpHand(npc);
}

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.MOMS_DEAD_HAND (287)
export function postNPCUpdateMomsDeadHand(npc: EntityNPC): void {
  if (!config.fastHands) {
    return;
  }

  checkSpeedUpHand(npc);
}

function checkSpeedUpHand(npc: EntityNPC) {
  // `NpcState.MOVE` is when they are following the player.
  if (npc.State === NpcState.MOVE) {
    speedUpInitialDelay(npc);
    checkOtherHandOverlap(npc);
  }
}

function speedUpInitialDelay(npc: EntityNPC) {
  // StateFrame starts between 0 and a random negative value and ticks upwards
  if (npc.StateFrame < START_FRAME) {
    npc.StateFrame = START_FRAME;
  }
}

function checkOtherHandOverlap(npc: EntityNPC) {
  // Check to see if there are any other hands in the room with this state frame.
  // If so, we have to do a small adjustment because if multiple hands fall at the exact same time,
  // they will stack on top of each other and appear as a single hand.
  if (npc.StateFrame === SHADOW_APPEAR_FRAME) {
    if (isOtherHandOverlapping(npc)) {
      npc.StateFrame += DELAY_FRAMES;
    }
  }
}

function isOtherHandOverlapping(initialHand: EntityNPC) {
  const momsHands = getNPCs(EntityType.MOMS_HAND);
  const momsDeadHands = getNPCs(EntityType.MOMS_DEAD_HAND);
  const hands = momsHands.concat(momsDeadHands);

  for (const hand of hands) {
    if (
      GetPtrHash(hand) !== GetPtrHash(initialHand) &&
      hand.State === NpcState.MOVE &&
      hand.StateFrame === initialHand.StateFrame
    ) {
      return true;
    }
  }

  return false;
}
