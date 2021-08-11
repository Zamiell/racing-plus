import g from "../../globals";
import { config } from "../../modConfigMenu";
import {
  CollectibleTypeCustom,
  FamiliarVariantCustom,
} from "../../types/enums";

const OFFSET = Vector(0, -16);
const DISTANCE_AWAY_FROM_PLAYER = 35;
// This exactly matches the speed of Sacrificial Dagger in Afterbirth+
// The value in Afterbirth+ is around 4.05
const SPEED_MULTIPLIER = 2.7;
const ROTATION_SPEED = 12;

// ModCallbacks.MC_FAMILIAR_UPDATE (6)
// FamiliarVariantCustom.SAWBLADE
export function postFamiliarUpdateSawblade(familiar: EntityFamiliar): void {
  setPosition(familiar);
}

// It should rotate around the player like a Cube of Meat or Sacrificial Dagger does
function setPosition(familiar: EntityFamiliar) {
  familiar.Position = getPosition(familiar);

  // Sometimes, when the familiar collides with things, it can pick up some velocity,
  // which will cause the sprite to glitch out
  // Zero out the velocity on every frame
  familiar.Velocity = Vector.Zero;
}

function getPosition(familiar: EntityFamiliar) {
  const player = familiar.Parent;
  if (player === null) {
    error("A sawblade was spawned without a parent.");
  }
  const baseVector = Vector(0, DISTANCE_AWAY_FROM_PLAYER);
  const rotatedVector = baseVector.Rotated(
    familiar.FrameCount * SPEED_MULTIPLIER * -1,
  );
  return player.Position.add(rotatedVector);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.sawblade) {
    g.itemPool.RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_SAWBLADE);
  }
}

// ModCallbacks.MC_POST_FAMILIAR_RENDER (25)
// FamiliarVariantCustom.SAWBLADE
export function postFamiliarRenderSawblade(familiar: EntityFamiliar): void {
  rotateSprite(familiar);
}

function rotateSprite(familiar: EntityFamiliar) {
  const sprite = familiar.GetSprite();
  sprite.Rotation += ROTATION_SPEED;
}

// ModCallbacks.MC_PRE_FAMILIAR_COLLISION (26)
// FamiliarVariantCustom.SAWBLADE
export function preFamiliarCollisionSawblade(collider: Entity): void {
  // Make the familiar block shots like a Cube of Meat or Sacrificial Dagger
  if (collider.Type === EntityType.ENTITY_PROJECTILE) {
    collider.Die();
  }
}

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
// CollectibleTypeCustom.COLLECTIBLE_SAWBLADE
export function postItemPickupSawblade(player: EntityPlayer): void {
  const sawblade = Isaac.Spawn(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariantCustom.SAWBLADE,
    0,
    Vector.Zero,
    Vector.Zero,
    player,
  );
  sawblade.Parent = player;

  // Initialize the sprite offset
  // (we must set the sprite offset via code since we are rotating the sprite on every frame)
  const sprite = sawblade.GetSprite();
  sprite.Offset = OFFSET;
}
