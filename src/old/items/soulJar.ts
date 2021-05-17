import { ZERO_VECTOR } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";

// Variables
const sprites = {
  barBack: null as Sprite | null,
  barMeter: null as Sprite | null,
  barLines: null as Sprite | null,
};

export function resetSprites(): void {
  sprites.barBack = null;
  sprites.barMeter = null;
  sprites.barLines = null;
}

export function postNewLevel(): void {
  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR)) {
    return;
  }

  // This ensures a 100% deal to start with
  g.g.SetLastDevilRoomStage(0);
}

export function entityTakeDmgPlayer(damageFlag: DamageFlag): void {
  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR)) {
    return;
  }

  // Soul Jar damage tracking
  let selfDamage = false;
  const bit1 = (damageFlag & (1 << 5)) >>> 5; // DamageFlag.DAMAGE_RED_HEARTS
  const bit2 = (damageFlag & (1 << 18)) >>> 18; // DamageFlag.DAMAGE_IV_BAG
  if (bit1 === 1 || bit2 === 1) {
    selfDamage = true;
  }
  if (!selfDamage) {
    g.g.SetLastDevilRoomStage(g.run.lastDDLevel);
  }
}

// Check the player's health for the Soul Jar mechanic
export function postUpdate(): void {
  // Local variables
  const soulHearts = g.p.GetSoulHearts();

  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR)) {
    return;
  }

  if (soulHearts <= 0) {
    return;
  }

  g.run.soulJarSouls += soulHearts;
  g.p.AddSoulHearts(-1 * soulHearts);
  Isaac.DebugString(`Soul heart collection is now at: ${g.run.soulJarSouls}`);
  while (g.run.soulJarSouls >= 8) {
    // This has to be in a while loop because of items like Abaddon
    g.run.soulJarSouls -= 8; // 4 soul hearts
    g.p.AddMaxHearts(2, true);
    g.p.AddHearts(2); // The container starts empty
    Isaac.DebugString("Converted 4 soul hearts to a heart container.");
  }
}

export function spriteDisplay(): void {
  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR)) {
    return;
  }

  // Load the sprites
  if (sprites.barBack === null) {
    sprites.barBack = Sprite();
    sprites.barBack.Load("gfx/ui/ui_chargebar2.anm2", true);
    sprites.barBack.Play("BarEmpty", true);
  }

  if (sprites.barMeter === null) {
    sprites.barMeter = Sprite();
    sprites.barMeter.Load("gfx/ui/ui_chargebar2.anm2", true);
    sprites.barMeter.Play("BarFull", true);
  }

  if (sprites.barLines === null) {
    sprites.barLines = Sprite();
    sprites.barLines.Load("gfx/ui/ui_chargebar2.anm2", true);
    // This is custom graphic using an 8 charge bar
    sprites.barLines.Play("BarOverlay12", true);
  }

  // Place the bar to the right of the heart containers
  // (which will depend on how many heart containers we have)
  const barX = 49 + misc.getHeartXOffset();
  const barY = 17;
  const barVector = Vector(barX, barY);

  // Draw the charge bar 1/3 (the background)
  sprites.barBack.Render(barVector, ZERO_VECTOR, ZERO_VECTOR);
  sprites.barBack.Update();

  // Draw the charge bar 2/3 (the bar itself, clipped appropriately)
  const meterMultiplier = 3; // 3 for a 8 charge item
  const meterClip = 26 - g.run.soulJarSouls * meterMultiplier;
  sprites.barMeter.Render(barVector, Vector(0, meterClip), ZERO_VECTOR);
  sprites.barMeter.Update();

  // Draw the charge bar 3/3 (the segment lines on top)
  sprites.barLines.Render(barVector, ZERO_VECTOR, ZERO_VECTOR);
  sprites.barLines.Update();
}
