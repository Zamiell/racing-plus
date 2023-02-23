// Speed up the attacks of Pin, Frail, and Scolex. Additionally, make Wormwood spend less time
// underground. (There does not seem to be a good way of speeding up Pin/Frail/Scolex while they are
// underground.)

import {
  EntityType,
  ModCallback,
  NpcState,
  PinVariant,
} from "isaac-typescript-definitions";
import { asNumber, Callback, getNPCs } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const PIN_ATTACK_STATE_FRAME_IN_GROUND = 90;
const PIN_ATTACK2_STATE_FRAME_IN_GROUND = 60;

/** This is the same for both NpcState.ATTACK and NpcState.ATTACK_2. */
const PIN_ATTACK_STATE_FRAME_FINAL = 105;

const v = {
  room: {
    wasIdleOnLastFrame: false,
    pokePhase: false,
  },
};

export class FastPin extends ConfigurableModFeature {
  configKey: keyof Config = "FastPin";
  v = v;

  // 0, 62
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.PIN)
  postNPCUpdatePin(npc: EntityNPC): void {
    if (npc.Parent !== undefined) {
      return;
    }

    if (npc.Variant === asNumber(PinVariant.WORMWOOD)) {
      this.checkSpeedUpWormwood(npc);
    } else {
      this.speedUpTearAttack(npc);
    }
  }

  checkSpeedUpWormwood(npc: EntityNPC): void {
    // Wormwood is in the idle state when they are underground. The state frame starts at a number
    // around 50, depending on how far away they are from the player. It will tick downwards towards
    // 0. When Wormwood is underground, we force it to be invisible to prevent buggy artifacts. As
    // soon as it does another attack, make it visible again.
    if (
      (npc.State === NpcState.JUMP || npc.State === NpcState.ATTACK) &&
      !npc.Visible
    ) {
      v.room.pokePhase = false;
      this.makeAllSegmentsVisible(npc);
      return;
    }

    // We do not want to speed up the poke attack, so keep track of this.
    if (v.room.pokePhase) {
      return;
    }

    if (npc.State === NpcState.ATTACK_2) {
      v.room.pokePhase = true;
      npc.Visible = true;
      return;
    }

    if (npc.State === NpcState.IDLE) {
      this.checkSpeedUpWormwoodWhileUnderground(npc);
    }
  }

  makeAllSegmentsVisible(npc: EntityNPC): void {
    const pins = getNPCs(npc.Type, npc.Variant);
    for (const pin of pins) {
      pin.Visible = true;
    }
  }

  checkSpeedUpWormwoodWhileUnderground(npc: EntityNPC): void {
    if (npc.StateFrame <= 1) {
      return;
    }

    // The beginning of the fight is a special case; Wormwood already has a collision class of
    // `EntityCollisionClass.NONE`.
    if (npc.FrameCount === 0) {
      this.speedUpWormwood(npc);
      return;
    }

    // Before we speed up Wormwood, we must wait for the collision class to change (or else
    // teleporting it on top of the player would cause unavoidable damage). This only takes 1 frame
    // after changing to the idle state.
    if (!v.room.wasIdleOnLastFrame) {
      v.room.wasIdleOnLastFrame = false;
      return;
    }

    this.speedUpWormwood(npc);
  }

  speedUpWormwood(npc: EntityNPC): void {
    const player = Isaac.GetPlayer();

    // Wormwood will first path towards the path, tag them, and then move to the nearest water tile.
    // Speed up this process by immediately teleporting Wormwood next to the player.
    const wormwoods = getNPCs(EntityType.PIN, PinVariant.WORMWOOD);
    for (const wormwood of wormwoods) {
      wormwood.Position = player.Position;
      wormwood.Visible = false;
    }

    // Setting the `StateFrame` to 0 will cause a softlock, so we set it to 1 instead, which will
    // tick to 0 on the next frame and cause Wormwood to path to the nearest water tile.
    npc.StateFrame = 1;
    v.room.wasIdleOnLastFrame = false;
  }

  speedUpTearAttack(npc: EntityNPC): void {
    // In vanilla, Pin will spend too long underground after performing the tear attack.
    if (
      npc.State === NpcState.ATTACK &&
      npc.StateFrame >= PIN_ATTACK_STATE_FRAME_IN_GROUND
    ) {
      npc.StateFrame = PIN_ATTACK_STATE_FRAME_FINAL;
    }

    if (
      npc.State === NpcState.ATTACK_2 &&
      npc.StateFrame >= PIN_ATTACK2_STATE_FRAME_IN_GROUND
    ) {
      npc.StateFrame = PIN_ATTACK_STATE_FRAME_FINAL;
    }
  }
}
