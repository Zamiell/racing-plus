/*

The Sawblade item is a custom item included in the Treasure Room pool. It is intended to solve two
specific problems:

1) Historically, orbitals have been a big part of speedrunning at the highest level. Since orbitals
got nerfed in Repentance, orbital play is infrequent. Sawblade is an attempt to restore historical
orbital play by providing a relatively-strong orbital as a possible starting item.
2) To decrease the amount of time player spend resetting for an item.

Sacrificial Dagger in Afterbirth+:
- Radius of the circle hitbox: 13
- Collision damage: 15
- Tick rate: every 2 frames
- Overall DPS: 225
- Rotation rate: 4.05 degrees per frame

Sacrificial Dagger in Repentance:
- Radius of the circle hitbox: 10 (23.1% decrease)
- Collision damage: 15 (unchanged)
- Tick rate: every 4 frames (100% decrease)
- Overall DPS: 112.5 (100% decrease)
- Rotation rate: 2.7 degrees per frame (33.3% decrease)

Cube of Meat / Ball of Bandage in Afterbirth+:
- Radius of the circle hitbox: 13
- Collision damage: 7
- Tick rate: every 2 frames
- Overall DPS: 105
- Rotation rate: 4.05 degrees per frame

Cube of Meat / Ball of Bandage in Afterbirth+:
- Radius of the circle hitbox: 8 (38.5% decrease)
    - Note that this is more nerfed than Sacrificial Dagger is.
- Collision damage is: 7 (unchanged)
- Tick rate: every 4 frames (100% decrease)
- Overall DPS: 52.5 (100% decrease)
- Rotation rate: 2.7 degrees per frame (33.3% decrease)

Takeaways:
- Damage of all 3 orbitals is nerfed by 100% in Rep.
- Sacrificial Dagger hitbox is nerfed by 23.1%.
- Cube of Meat & Ball of Bandages hitbox is nerfed by 38.5%.
- Rotation rate of all 3 orbitals is nerfed by 33.3% in Rep.

Sawblade stats:
- Radius of the circle hitbox: 13 (same as Sacrificial Dagger in Afterbirth+)
- Collision damage: 10
- Tick rate: once every 2 frames (same as Sacrificial Dagger in Afterbirth+)
- Overall DPS: 150
    - 33.3% nerf from Sacrificial Dagger in Afterbirth+ (112.5 DPS)
    - 33.3% buff from Sacrificial Dagger in Repentance (56.25 DPS)
- Rotation rate: 4.05 degrees per frame (same as all orbitals in Afterbirth+)

*/

import { getFamiliars } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { FamiliarVariantCustom } from "../../types/FamiliarVariantCustom";

interface SawbladeData {
  frameCountModifier: int | undefined;
}

const DISTANCE_AWAY_FROM_PLAYER = 35;
const ORBITAL_ROTATION_SPEED_AFTERBIRTH_PLUS = 2.7;
// const ORBITAL_ROTATION_SPEED_REPENTANCE = 4.05;
const SAWBLADE_ROTATION_SPEED = ORBITAL_ROTATION_SPEED_AFTERBIRTH_PLUS;

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  const numSawbladeCollectibles = player.GetCollectibleNum(
    CollectibleTypeCustom.COLLECTIBLE_SAWBLADE,
  );
  const sawbladeRNG = player.GetCollectibleRNG(
    CollectibleTypeCustom.COLLECTIBLE_SAWBLADE,
  );
  player.CheckFamiliar(
    FamiliarVariantCustom.SAWBLADE,
    numSawbladeCollectibles,
    sawbladeRNG,
  );
}

// ModCallbacks.MC_FAMILIAR_UPDATE (6)
// FamiliarVariantCustom.SAWBLADE
export function postFamiliarUpdateSawblade(familiar: EntityFamiliar): void {
  setPosition(familiar);
}

// It should rotate around the player like a Cube of Meat or Sacrificial Dagger does
function setPosition(familiar: EntityFamiliar) {
  const position = getPosition(familiar);
  if (position === undefined) {
    return;
  }

  familiar.Position = position;

  // Sometimes, when the familiar collides with things, it can pick up some velocity,
  // which will cause the sprite to glitch out
  // Zero out the velocity on every frame
  familiar.Velocity = Vector.Zero;
}

function getPosition(familiar: EntityFamiliar) {
  const player = familiar.SpawnerEntity;
  if (player === undefined) {
    return undefined;
  }

  let frameCount = familiar.FrameCount;
  const data = familiar.GetData() as unknown as SawbladeData;
  if (data.frameCountModifier !== undefined) {
    frameCount += data.frameCountModifier;
  }

  const baseVector = Vector(0, DISTANCE_AWAY_FROM_PLAYER);
  const rotatedVector = baseVector.Rotated(
    frameCount * SAWBLADE_ROTATION_SPEED * -1,
  );

  return player.Position.add(rotatedVector);
}

// ModCallbacks.MC_FAMILIAR_INIT (7)
// FamiliarVariantCustom.SAWBLADE
export function postFamiliarInitSawblade(familiar: EntityFamiliar): void {
  setSpriteOffset(familiar);
  offsetSecondSawblade(familiar);
}

function setSpriteOffset(familiar: EntityFamiliar) {
  const sprite = familiar.GetSprite();
  sprite.Offset = Vector(0, -16);
}

function offsetSecondSawblade(familiar: EntityFamiliar) {
  if (familiar.SpawnerEntity === undefined) {
    return;
  }

  const player = familiar.SpawnerEntity.ToPlayer();
  if (player === undefined) {
    return;
  }

  const playerHash = GetPtrHash(player);
  const sawblades = getFamiliars(FamiliarVariantCustom.SAWBLADE);

  const otherSawbladesAttachedToSamePlayer: EntityFamiliar[] = [];
  for (const sawblade of sawblades) {
    if (sawblade.SpawnerEntity === undefined) {
      continue;
    }

    const sawbladePlayer = sawblade.SpawnerEntity.ToPlayer();
    if (sawbladePlayer === undefined) {
      continue;
    }

    const sawbladePlayerHash = GetPtrHash(sawbladePlayer);
    if (sawbladePlayerHash === playerHash) {
      otherSawbladesAttachedToSamePlayer.push(sawblade);
    }
  }

  if (otherSawbladesAttachedToSamePlayer.length === 0) {
    return;
  }

  // This is the second Sawblade spawning;
  // initialize it such that it will rotate opposite to the first one
  const framesPerRotation = 360 / SAWBLADE_ROTATION_SPEED;
  const frameCountModifier = sawblades[0].FrameCount + framesPerRotation / 2;
  const data = familiar.GetData() as unknown as SawbladeData;
  data.frameCountModifier = frameCountModifier;
}

// ModCallbacks.MC_PRE_FAMILIAR_COLLISION (26)
// FamiliarVariantCustom.SAWBLADE
export function preFamiliarCollisionSawblade(collider: Entity): void {
  // Make the familiar block shots like a Cube of Meat or Sacrificial Dagger
  if (collider.Type === EntityType.ENTITY_PROJECTILE) {
    collider.Die();
  }
}
