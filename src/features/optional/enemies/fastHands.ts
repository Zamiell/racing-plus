import { config } from "../../../modConfigMenu";

const SHADOW_APPEAR_FRAME = 40;
const START_FRAME = SHADOW_APPEAR_FRAME - 15;
const DELAY_FRAMES = 4;

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_MOMS_HAND (213)
// EntityType.ENTITY_MOMS_DEAD_HAND (287)
export function postNPCUpdateHands(npc: EntityNPC): void {
  if (!config.fastHands) {
    return;
  }

  // NpcState.STATE_MOVE is when they are following the player
  if (npc.State === NpcState.STATE_MOVE) {
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
  // Check to see if there are any other hands in the room with this state frame
  // If so, we have to do a small adjustment because if multiple hands fall at the exact same time,
  // they will stack on top of each other and appear as a single hand
  if (npc.StateFrame === SHADOW_APPEAR_FRAME) {
    if (isOtherHandOverlapping(npc)) {
      npc.StateFrame += DELAY_FRAMES;
    }
  }
}

function isOtherHandOverlapping(initialHand: EntityNPC) {
  const momsHands = Isaac.FindByType(EntityType.ENTITY_MOMS_HAND);
  const momsDeadHands = Isaac.FindByType(EntityType.ENTITY_MOMS_DEAD_HAND);
  const hands = momsHands.concat(momsDeadHands);

  for (const hand of hands) {
    const npc = hand.ToNPC();
    if (
      npc !== null &&
      GetPtrHash(npc) !== GetPtrHash(initialHand) &&
      npc.State === NpcState.STATE_MOVE &&
      npc.StateFrame === initialHand.StateFrame
    ) {
      return true;
    }
  }

  return false;
}
