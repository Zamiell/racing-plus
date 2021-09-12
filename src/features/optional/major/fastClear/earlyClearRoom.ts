// The main part of fast-clear messes with the CanShutDoors property of NPCs
// Separately, we also keep track of the current enemies in the room, and open the doors early
// Thankfully, even if the player exits the room on the frame that the doors are manually opened,
// the game will still charge the active item and spawn the drop as per normal

import { log, openAllDoors } from "isaacscript-common";
import g from "../../../../globals";
import v from "./v";

const CREEP_VARIANTS_TO_KILL = new Set([
  EffectVariant.CREEP_RED, // 22
  EffectVariant.CREEP_GREEN, // 23
  EffectVariant.CREEP_YELLOW, // 24
  EffectVariant.CREEP_WHITE, // 25
  EffectVariant.CREEP_BLACK, // 26
  EffectVariant.CREEP_BROWN, // 56
  EffectVariant.CREEP_SLIPPERY_BROWN, // 94
]);

const EARLY_CLEAR_ROOM_TYPE_BLACKLIST = new Set([
  RoomType.ROOM_BOSS, // 5
  RoomType.ROOM_CHALLENGE, // 11
  RoomType.ROOM_BOSSRUSH, // 17
]);

export default function earlyClearRoom(): void {
  const roomType = g.r.GetType();

  if (EARLY_CLEAR_ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  v.run.earlyClearedRoom = true;
  log("Early clearing the room (fast-clear).");

  openAllDoors();
  killExtraEntities();
}

function killExtraEntities() {
  killDeathsHeads();
  killFleshDeathsHeads();
  killCreep();
}

function killDeathsHeads() {
  // We need to specify variant 0 because we do not want to target Dank Death's Heads
  const deathsHeads = Isaac.FindByType(
    EntityType.ENTITY_DEATHS_HEAD,
    -1,
    -1,
    false,
    true,
  );
  for (const deathsHead of deathsHeads) {
    // Death's Dank Head is a "normal" enemy in that it does not rely on other enemies in the room
    // to be alive
    if (deathsHead.Variant === DeathsHeadVariant.DANK_DEATHS_HEAD) {
      continue;
    }

    // Activate the death state
    const npc = deathsHead.ToNPC();
    if (npc !== undefined) {
      npc.State = 18; // There is no enum for the Death's Head death state
    }
  }
}

function killFleshDeathsHeads() {
  const fleshDeathsHeads = Isaac.FindByType(
    EntityType.ENTITY_FLESH_DEATHS_HEAD,
    -1,
    -1,
    false,
    true,
  );
  for (const entity of fleshDeathsHeads) {
    // Activating the death state won't make the tears explode out of it,
    // so just kill it and spawn another one, which will immediately die
    entity.Visible = false;
    entity.Kill();
    const newHead = g.g
      .Spawn(
        entity.Type,
        entity.Variant,
        entity.Position,
        entity.Velocity,
        entity.Parent,
        entity.SubType,
        entity.InitSeed,
      )
      .ToNPC();
    if (newHead !== undefined) {
      newHead.State = 18; // There is no enum for the Flesh Death's Head death state
    }
  }
}

function killCreep() {
  const creepEntities = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    -1,
    -1,
    false,
    true,
  );
  for (const entity of creepEntities) {
    if (CREEP_VARIANTS_TO_KILL.has(entity.Variant)) {
      entity.Kill();
    }
  }
}
