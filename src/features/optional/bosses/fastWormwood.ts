// Make Wormwood spend less time underground
// Wormwood is in the idle state when they are underground
// The state frame starts at a number around 50,
// depending on how far away they are from the player
// It will tick downwards towards 0

import { saveDataManager } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const v = {
  room: {
    wasIdleOnLastFrame: false,
    pokePhase: false,
  },
};

export function init(): void {
  saveDataManager("fastWormwood", v, featureEnabled);
}

function featureEnabled() {
  return config.fastWormwood;
}

export function postNPCUpdatePin(npc: EntityNPC): void {
  if (!config.fastWormwood) {
    return;
  }

  if (npc.Variant !== PinVariant.WORMWOOD || npc.Parent !== undefined) {
    return;
  }

  // When Wormwood is underground, we force it to be invisible to prevent buggy artifacts
  // As soon as it does another attack, make it visible again
  if (
    (npc.State === NpcState.STATE_JUMP ||
      npc.State === NpcState.STATE_ATTACK) &&
    !npc.Visible
  ) {
    v.room.pokePhase = false;
    makeVisible();
    return;
  }

  // We do not want to speed up the poke attack, so keep track of this
  if (v.room.pokePhase) {
    return;
  }

  if (npc.State === NpcState.STATE_ATTACK2) {
    v.room.pokePhase = true;
    npc.Visible = true;
    return;
  }

  if (npc.State === NpcState.STATE_IDLE) {
    checkSpeedUpWormwood(npc);
  }
}

function checkSpeedUpWormwood(npc: EntityNPC) {
  if (npc.StateFrame <= 1) {
    return;
  }

  // The beginning of the fight is a special case;
  // Wormwood already has a collision class of EntityCollisionClass.ENTCOLL_NONE
  if (npc.FrameCount === 0) {
    speedUpWormwood(npc);
    return;
  }

  // Before we speed up Wormwood, we must wait for the collision class to change
  // (or else teleporting it on top of the player would cause unavoidable damage)
  // This only takes 1 frame after changing to the idle state
  if (!v.room.wasIdleOnLastFrame) {
    v.room.wasIdleOnLastFrame = false;
    return;
  }

  speedUpWormwood(npc);
}

function speedUpWormwood(npc: EntityNPC) {
  const player = Isaac.GetPlayer();

  // Wormwood will first path towards the path, tag them,
  // and then move to the nearest water tile
  // Speed up this process by immediately teleporting Wormwood next to the player
  const wormwoods = Isaac.FindByType(
    EntityType.ENTITY_PIN,
    PinVariant.WORMWOOD,
  );
  for (const wormwood of wormwoods) {
    wormwood.Position = player.Position;
    wormwood.Visible = false;
  }

  // Setting the StateFrame to 0 will cause a softlock, so we set it to 1 instead,
  // which will tick to 0 on the next frame and cause Wormwood to path to the nearest water tile
  npc.StateFrame = 1;
  v.room.wasIdleOnLastFrame = false;
}

function makeVisible() {
  const wormwoods = Isaac.FindByType(
    EntityType.ENTITY_PIN,
    PinVariant.WORMWOOD,
  );
  for (const wormwood of wormwoods) {
    wormwood.Visible = true;
  }
}
