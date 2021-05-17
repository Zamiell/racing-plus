import { ZERO_VECTOR } from "../constants";
import * as seededDeath from "../features/seededDeath";
import g from "../globals";
import * as misc from "../misc";
import * as sprites from "../sprites";
import { CollectibleTypeCustom } from "../types/enums";
import * as racePostNewRoom from "./postNewRoom";

export function main(): void {
  // We do not want to return if we are not in a race,
  // as there are also speedrun-related checks in the follow functions
  check3DollarBill();
  checkFireworks();
  checkKeeperHolyMantle();
  checkFinalRoom();
  seededDeath.postUpdate();
}

function check3DollarBill() {
  if (
    g.race.status === "in progress" &&
    g.race.rFormat === "seeded" &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_3_DOLLAR_BILL)
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_3_DOLLAR_BILL);
    misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_3_DOLLAR_BILL);
    g.p.AddCollectible(
      CollectibleTypeCustom.COLLECTIBLE_3_DOLLAR_BILL_SEEDED,
      0,
      false,
    );
    Isaac.DebugString("Activated the custom 3 Dollar Bill for seeded races.");

    // Activate a new effect for it (pretending that we just walked into a new room)
    racePostNewRoom.threeDollarBill();
  }
}

// Make race winners get sparkles and fireworks
function checkFireworks() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Make fireworks quieter
  if (
    Isaac.CountEntities(
      null,
      EntityType.ENTITY_EFFECT,
      EffectVariant.FIREWORKS,
      -1,
    ) > 0 &&
    g.sfx.IsPlaying(SoundEffect.SOUND_BOSS1_EXPLOSIONS)
  ) {
    g.sfx.AdjustVolume(SoundEffect.SOUND_BOSS1_EXPLOSIONS, 0.2);
  }

  // Do something special for a first place finish (or a speedrun completion)
  if (
    (g.raceVars.finished === true &&
      g.race.status === "none" &&
      g.race.place === 1 &&
      g.race.numEntrants >= 3) ||
    g.speedrun.finished
  ) {
    // Give Isaac sparkly feet (1000.103.0)
    const randomVector = RandomVector().__mul(10);
    const blingPosition = g.p.Position.__add(randomVector);
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.ULTRA_GREED_BLING,
      0,
      blingPosition,
      ZERO_VECTOR,
      null,
    );

    // Spawn 30 fireworks (1000.104.0)
    // (some can be duds randomly && ! spawn any fireworks after the 20 frame countdown)
    if (g.raceVars.fireworks < 40 && gameFrameCount % 20 === 0) {
      for (let i = 0; i < 5; i++) {
        g.raceVars.fireworks += 1;
        const fireworkPos = misc.gridToPos(
          math.random(1, 11),
          math.random(2, 8),
        );
        const firework = Isaac.Spawn(
          EntityType.ENTITY_EFFECT,
          EffectVariant.FIREWORKS,
          0,
          fireworkPos,
          ZERO_VECTOR,
          null,
        ).ToEffect();
        if (firework !== null) {
          firework.SetTimeout(20);
        }
      }
    }
  }
}

// Check to see if Keeper took damage with his temporary Holy Mantle
function checkKeeperHolyMantle() {
  // Local variables
  const effects = g.p.GetEffects();

  if (
    g.run.level.tempHolyMantle &&
    !effects.HasCollectibleEffect(CollectibleType.COLLECTIBLE_HOLY_MANTLE)
  ) {
    g.run.level.tempHolyMantle = false;
  }
}

function checkFinalRoom() {
  if (!g.raceVars.finished) {
    return;
  }

  // Local variables
  const roomIndex = misc.getRoomIndex();
  const roomFrameCount = g.r.GetFrameCount();

  if (roomFrameCount !== 1) {
    return;
  }

  for (const button of g.run.level.buttons) {
    if (button.roomIndex === roomIndex) {
      sprites.init(`${button.type}-button`, `${button.type}-button`);

      // The buttons will cause the door to close, so re-open the door
      // (thankfully, the door will stay open since the room is already cleared)
      misc.openAllDoors();
    }
  }
}

export function checkFinalButtons(gridEntity: GridEntity, i: int): void {
  if (!g.raceVars.finished) {
    return;
  }

  // Local variables
  const roomIndex = misc.getRoomIndex();

  for (const button of g.run.level.buttons) {
    if (button.type === "victory-lap" && button.roomIndex === roomIndex) {
      if (
        gridEntity.GetSaveState().State === 3 &&
        gridEntity.Position.X === button.pos.X &&
        gridEntity.Position.Y === button.pos.Y
      ) {
        sprites.init(`${button.type}-button`, "");
        g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work

        race.victoryLap();
      }
    }

    if (button.type === "dps" && button.roomIndex === roomIndex) {
      if (
        gridEntity.GetSaveState().State === 3 &&
        gridEntity.Position.X === button.pos.X &&
        gridEntity.Position.Y === button.pos.Y
      ) {
        sprites.init(`${button.type}-button`, "");
        g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work

        // Disable this button
        button.roomIndex = 999999;

        PotatoDummy.Spawn();
      }
    }
  }
}
