import g from "../../../../globals";
import {
  getItemMaxCharges,
  getPlayers,
  log,
  openAllDoors,
} from "../../../../misc";
import * as seededDrops from "../../../mandatory/seededDrops";
import * as bagFamiliars from "./bagFamiliars";
import * as photos from "./photos";

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
  checkAddCharge();

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
function checkAddCharge() {
  for (const player of getPlayers()) {
    for (const slot of [
      ActiveSlot.SLOT_PRIMARY,
      ActiveSlot.SLOT_SECONDARY,
      ActiveSlot.SLOT_POCKET,
    ]) {
      if (player.NeedsCharge(slot)) {
        addCharge(player, slot);
      }
    }
  }
}

function addCharge(player: EntityPlayer, slot: ActiveSlot) {
  const hud = g.g.GetHUD();

  // Find out the new charge to set on the item
  const currentCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const chargesToAdd = getChargesToAdd(player, slot);
  const modifiedChargesToAdd = getChargesWithAAAModifier(
    player,
    slot,
    chargesToAdd,
  );
  const newCharge = currentCharge + batteryCharge + modifiedChargesToAdd;

  player.SetActiveCharge(newCharge, slot);
  hud.FlashChargeBar(player, slot);

  Isaac.DebugString(`XXX ${shouldPlayFullRechargeSound(player, slot)}`);
  const chargeSoundEffect = shouldPlayFullRechargeSound(player, slot)
    ? SoundEffect.SOUND_BATTERYCHARGE
    : SoundEffect.SOUND_BEEP;
  if (!g.sfx.IsPlaying(chargeSoundEffect)) {
    g.sfx.Play(chargeSoundEffect);
  }
}

function getChargesToAdd(player: EntityPlayer, slot: ActiveSlot) {
  const roomShape = g.r.GetRoomShape();
  const activeItem = player.GetActiveItem(slot);
  const activeCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const maxCharges = getItemMaxCharges(activeItem);

  if (!hasBattery && activeCharge === maxCharges) {
    return 0;
  }

  if (hasBattery && batteryCharge === maxCharges) {
    return 0;
  }

  if (!hasBattery && activeCharge + 1 === maxCharges) {
    // We are only 1 charge away from a full charge,
    // so only add one charge to avoid an overcharge
    // (it is possible to set orange charges without the player actually having The Battery)
    return 1;
  }

  if (hasBattery && batteryCharge + 1 === maxCharges) {
    // We are only 1 charge away from a full double-charge
    // so only add one charge to avoid an overcharge
    return 1;
  }

  if (roomShape >= RoomShape.ROOMSHAPE_2x2) {
    // 2x2 rooms and L rooms should grant 2 charges
    return 2;
  }

  // Clearing a room grants 1 charge by default
  return 1;
}

// The AAA Battery should grant an extra charge when the active item is one away from being fully
// charged
function getChargesWithAAAModifier(
  player: EntityPlayer,
  slot: ActiveSlot,
  chargesToAdd: int,
) {
  const activeItem = player.GetActiveItem(slot);
  const activeCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const hasAAABattery = player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY);
  const maxCharges = getItemMaxCharges(activeItem);

  if (!hasAAABattery) {
    return chargesToAdd;
  }

  if (!hasBattery && activeCharge + chargesToAdd === maxCharges - 1) {
    return maxCharges + 1;
  }

  if (hasBattery && batteryCharge + chargesToAdd === maxCharges - 1) {
    return maxCharges + 1;
  }

  return chargesToAdd;
}

function shouldPlayFullRechargeSound(player: EntityPlayer, slot: ActiveSlot) {
  const activeItem = player.GetActiveItem(slot);
  const activeCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const maxCharges = getItemMaxCharges(activeItem);

  if (!hasBattery) {
    // Play the full recharge sound if we are now fully charged
    return !player.NeedsCharge(slot);
  }

  // Play the full recharge sound if we are now fully charged or we are exactly half-way charged
  return (
    !player.NeedsCharge(slot) ||
    (activeCharge === maxCharges && batteryCharge === 0)
  );
}

export function setDeferClearForGhost(value: boolean): void {
  g.run.fastClear.deferClearForGhost = value;
}
