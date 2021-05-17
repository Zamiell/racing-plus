import { ZERO_VECTOR } from "../constants";
import * as fastTravel from "../features/fastTravel";
import g from "../globals";
import * as useItem from "./useItem";

// EffectVariant.DEVIL (6)
export function devil(effect: EntityEffect): void {
  // Fade the statue if there are any collectibles in range
  // Squares (5, 2), (6, 2), (7, 2), (5, 3), (6, 3), and (7, 3) are not allowed
  let collectibleIsClose = false;
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    -1,
    false,
    false,
  );
  for (const collectible of collectibles) {
    if (
      collectible.Position.X >= 260 &&
      collectible.Position.X <= 380 &&
      collectible.Position.Y >= 180 &&
      collectible.Position.Y <= 260
    ) {
      collectibleIsClose = true;
      break;
    }
  }

  if (collectibleIsClose) {
    const faded = Color(1, 1, 1, 0.3, 0, 0, 0);
    effect.SetColor(faded, 1000, 0, true, true);
  }
}

// EffectVariant.HEAVEN_LIGHT_DOOR (39)
export function heavenLightDoor(effect: EntityEffect): void {
  // We cannot put this in the PostEffectInit callback because the position of the effect is not
  // initialized yet
  fastTravel.heavenDoor.replace(effect);
}

// EffectVariant.DICE_FLOOR (76)
export function diceFloor(effect: EntityEffect): void {
  // We need to keep track of when the player uses a 5-pip Dice Room so that we can seed the floor
  // appropriately
  if (
    !g.run.room.diceRoomActivated &&
    effect.SubType === 4 && // 5-pip Dice Room
    g.p.Position.Distance(effect.Position) <= 75 // Determined through trial && error
  ) {
    g.run.room.diceRoomActivated = true;
    useItem.forgetMeNow();
  }
}

export function trapdoor(effect: EntityEffect): void {
  fastTravel.entity.checkOpen(effect);
  fastTravel.entity.checkClose(effect);
  fastTravel.entity.checkPlayerTouching(effect, false);
}

export function crawlspace(effect: EntityEffect): void {
  fastTravel.entity.checkOpen(effect);
  fastTravel.entity.checkClose(effect);
  fastTravel.crawlspace.checkPlayerTouching(effect);
}

export function heavenDoor(effect: EntityEffect): void {
  fastTravel.entity.checkPlayerTouching(effect, true);
}

export function voidPortal(effect: EntityEffect): void {
  fastTravel.entity.checkPlayerTouching(effect, false);
}

export function megaSatanTrapdoor(effect: EntityEffect): void {
  fastTravel.entity.checkPlayerTouching(effect, false);
}

export function tearPoof(effect: EntityEffect): void {
  // Change the green splash of Mysterious Liquid tears to blue
  // (changing the color does not work in the PostEffectInit callback)
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID)) {
    const blue = Color(1, 1, 20, 1, 0, 0, 0);
    effect.SetColor(blue, 0, 0, false, false);
  }
}

export function crackTheSkyBase(effect: EntityEffect): void {
  // Local variables
  const centerPos = g.r.GetCenterPos();
  const data = effect.GetData();
  const sprite = effect.GetSprite();

  // Spawn an actual Crack the Sky effect when the "Appear" animation is finished
  let spawnRealLight = false;
  if (sprite.IsFinished("DelayedAppear")) {
    sprite.Play("Delayed", true);
    spawnRealLight = true;
  }
  if (spawnRealLight) {
    let position = data.CrackSkySpawnPosition as Vector | undefined;
    if (position === undefined) {
      position = centerPos;
    }

    let spawner = data.CrackSkySpawnSpawner as Entity | undefined | null;
    if (spawner === undefined) {
      spawner = null;
    }

    g.run.room.spawningLight = true;
    const light = g.g.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.CRACK_THE_SKY,
      position,
      ZERO_VECTOR,
      spawner,
      0,
      effect.InitSeed,
    );
    g.run.room.spawningLight = false;
    data.CrackSkyLinkedEffect = light;

    // Reduce the collision radius, which makes the hitbox in-line with the sprite
    light.Size -= 16;
  }

  // While the light exists, constantly set the base's position to the light
  const linkedEffect = data.CrackSkyLinkedEffect as EntityEffect | undefined;
  if (
    linkedEffect !== undefined &&
    linkedEffect.Exists() &&
    (sprite.IsPlaying("Spotlight") || sprite.IsPlaying("Delayed"))
  ) {
    effect.Position = linkedEffect.Position;
    effect.Velocity = linkedEffect.Velocity;
  }

  // Remove this once the animations are finished
  if (sprite.IsFinished("Spotlight") || sprite.IsFinished("Delayed")) {
    effect.Remove();
  }
}

export function stickyNickel(effect: EntityEffect): void {
  // Local variables
  const sprite = effect.GetSprite();
  const data = effect.GetData();

  let removeEffect = true;
  if (data.StickyNickel) {
    const coin = data.StickyNickel as EntityEffect | undefined;
    if (
      coin !== undefined &&
      coin.Exists() &&
      coin.SubType === CoinSubType.COIN_STICKYNICKEL
    ) {
      // Update our position to the nickel's position (in case it moved)
      effect.Position = coin.Position;

      // We do not want to remove the effect yet, since the nickel is still sticky
      removeEffect = false;
    }
  }

  if (removeEffect) {
    if (sprite.IsPlaying("Disappear")) {
      if (sprite.GetFrame() >= 44) {
        effect.Remove();
      }
    } else {
      sprite.Play("Disappear", true);
    }
  }
}
