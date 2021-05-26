import g from "../../../../globals";
import { log, openAllDoors } from "../../../../misc";
import * as seededDrops from "../../../mandatory/seededDrops";
import * as bagFamiliars from "./bagFamiliars";
import * as charge from "./charge";
import * as photos from "./photos";

const CREEP_VARIANTS_TO_KILL = [
  EffectVariant.CREEP_RED, // 22
  EffectVariant.CREEP_GREEN, // 23
  EffectVariant.CREEP_YELLOW, // 24
  EffectVariant.CREEP_WHITE, // 25
  EffectVariant.CREEP_BLACK, // 26
  EffectVariant.CREEP_BROWN, // 56
  EffectVariant.CREEP_SLIPPERY_BROWN, // 94
];

// This emulates what happens when you normally clear a room
export default function clearRoom(): void {
  log("Fast-clear initiated.");

  // Set the room clear status to true (so that it gets marked off on the minimap)
  g.r.SetClear(true);

  openAllDoors();
  playDoorOpenSoundEffect();
  killExtraEntities();
  postBossActions();
  spawnClearAward();

  // Manually spawn the The Polaroid and/or The Negative, as appropriate
  photos.spawn();

  // Give a charge to the player's active item
  charge.checkAdd();

  // Check to see if any bag familiars will drop anything
  bagFamiliars.clearedRoom();
}

function playDoorOpenSoundEffect() {
  const roomType = g.r.GetType();

  // Ignore crawlspaces because there are no doors in a crawlspace
  if (roomType !== RoomType.ROOM_DUNGEON) {
    g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN, 1, 0, false, 1);
  }
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
    0,
    -1,
    false,
    true,
  );
  for (const deathsHead of deathsHeads) {
    // Activate the death state
    const npc = deathsHead.ToNPC();
    if (npc !== null) {
      npc.State = 18; // There is no enum for this particular death state
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
    if (newHead !== null) {
      newHead.State = 18; // There is no enum for this particular death state
    }
  }
}

function killCreep() {
  const creepEntities = Isaac.FindByType(
    EntityType.ENTITY_FLESH_DEATHS_HEAD,
    -1,
    -1,
    false,
    true,
  );
  for (const entity of creepEntities) {
    if (CREEP_VARIANTS_TO_KILL.includes(entity.Variant)) {
      entity.Kill();
    }
  }
}

function postBossActions() {
  const roomType = g.r.GetType();
  const stage = g.l.GetStage();

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  // Try and spawn a Devil Room or Angel Room
  // (this takes into account their Devil/Angel percentage and so forth)
  g.r.TrySpawnDevilRoomDoor(true);

  if (stage === 6) {
    // If we just beat Mom, spawn the Boss Rush door
    const ignoreTime =
      g.race.status === "in progress" && g.race.goal === "Boss Rush";
    g.r.TrySpawnBossRushDoor(ignoreTime);
  } else if (stage === 8) {
    // If we just beat It Lives!, do not spawn the Blue Womb door by default
    // This is because speedrunners will almost never want to go to Hush or Delirium,
    // and seeing the door spawn is distracting
    // If the player really wants to go to the Blue Womb,
    // then they can still backtrack one room and re-enter
    // However, in certain races or speedruns, we want to explicitly spawn the Blue Womb door
    if (
      (g.race.status === "in progress" && g.race.goal === "Hush") ||
      (g.race.status === "in progress" && g.race.goal === "Delirium")
    ) {
      g.r.TrySpawnBlueWombDoor(true, true);
    }
  }
}

function spawnClearAward(): void {
  if (seededDrops.shouldSpawnSeededDrop()) {
    // If the player is playing on a set seed, we want the room drops to appear in order
    // (subverting the vanilla system for generating room drops)
    seededDrops.spawn();
  } else {
    // Use the vanilla function to spawn a room drop,
    // which takes into account the player's luck and so forth
    // Room drops are not supposed to spawn in crawlspaces,
    // but this function will internally exit if we are in a crawlspace,
    // so we do not need to explicitly check for that
    // Just in case we just killed Mom,
    // we also mark to delete the photos spawned by the game during this step
    // (in the PreEntitySpawn callback)
    g.run.fastClear.vanillaPhotosSpawning = true;
    g.r.SpawnClearAward();
    g.run.fastClear.vanillaPhotosSpawning = false;
  }
}

export function setDeferClearForGhost(value: boolean): void {
  g.run.fastClear.deferClearForGhost = value;
}
