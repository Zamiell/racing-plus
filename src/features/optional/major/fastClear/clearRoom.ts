import g from "../../../../globals";
import { getItemMaxCharges, getPlayers, openAllDoors } from "../../../../misc";
import * as seededDrops from "../../../mandatory/seededDrops";
import * as bagFamiliars from "./bagFamiliars";
import * as photos from "./photos";

// This emulates what happens when you normally clear a room
export default function clearRoom(): void {
  Isaac.DebugString("Fast-clear initiated.");

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
  addCharge();

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

// Manually kill Death's Heads, Flesh Death's Heads, and any type of creep
// (by default, they will only die after the death animations are completed)
// Additionally, open any closed heaven doors
function killExtraEntities() {
  for (const entity of Isaac.GetRoomEntities()) {
    switch (entity.Type) {
      // 212
      case EntityType.ENTITY_DEATHS_HEAD: {
        // We don't want to target Dank Death's Heads (212.1)
        if (entity.Variant === 0) {
          // Activate the death state
          const npc = entity.ToNPC();
          if (npc !== null) {
            npc.State = 18; // There is no enum for this particular death state
          }
        }

        break;
      }

      // 286
      case EntityType.ENTITY_FLESH_DEATHS_HEAD: {
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

        break;
      }

      // 1000
      case EntityType.ENTITY_EFFECT: {
        if (
          entity.Variant === EffectVariant.CREEP_RED || // 22
          entity.Variant === EffectVariant.CREEP_GREEN || // 23
          entity.Variant === EffectVariant.CREEP_YELLOW || // 24
          entity.Variant === EffectVariant.CREEP_WHITE || // 25
          entity.Variant === EffectVariant.CREEP_BLACK || // 26
          entity.Variant === EffectVariant.CREEP_BROWN || // 56
          entity.Variant === EffectVariant.CREEP_SLIPPERY_BROWN // 94
        ) {
          entity.Kill();
        }

        break;
      }

      default: {
        break;
      }
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

// Give a charge to the player's active item
// (and handle co-op players, if present)
function addCharge() {
  const hud = g.g.GetHUD();

  for (const player of getPlayers()) {
    for (const slot of [
      ActiveSlot.SLOT_PRIMARY,
      ActiveSlot.SLOT_SECONDARY,
      ActiveSlot.SLOT_POCKET,
    ]) {
      if (player.NeedsCharge(slot)) {
        const currentCharge = player.GetActiveCharge(slot);
        const chargesToAdd = getChargesToAdd(player, slot);
        const newCharge = currentCharge + chargesToAdd;
        player.SetActiveCharge(newCharge, slot);
        hud.FlashChargeBar(player, slot);
        if (!g.sfx.IsPlaying(SoundEffect.SOUND_BEEP)) {
          g.sfx.Play(SoundEffect.SOUND_BEEP);
        }
      }
    }
  }
}

function getChargesToAdd(player: EntityPlayer, slot: ActiveSlot) {
  const roomShape = g.r.GetRoomShape();
  const activeItem = player.GetActiveItem(slot);
  const activeCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const maxCharges = getItemMaxCharges(activeItem);

  if (roomShape >= RoomShape.ROOMSHAPE_2x2) {
    // 2x2 rooms and L rooms should grant 2 charges
    return 2;
  }

  if (
    player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
    activeCharge === maxCharges - 2
  ) {
    // The AAA Battery grants an extra charge when the active item is one away from being fully
    // charged
    return 2;
  }

  if (
    player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY) &&
    activeCharge === maxCharges &&
    player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) &&
    batteryCharge === maxCharges - 2
  ) {
    // The AAA Battery should grant an extra charge when the active item is one away from being
    // fully charged with The Battery
    // (this is bugged in vanilla for The Battery)
    return 2;
  }

  // Clearing a room grants 1 charge by default
  return 1;
}
