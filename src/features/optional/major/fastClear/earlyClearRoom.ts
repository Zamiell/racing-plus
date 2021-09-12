import { openAllDoors } from "isaacscript-common";
import g from "../../../../globals";

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
  return;

  const roomType = g.r.GetType();

  if (EARLY_CLEAR_ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  openAllDoors();
  playDoorOpenSoundEffect();
  killExtraEntities();
}

function playDoorOpenSoundEffect() {
  g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN, 1, 0, false, 1);
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
