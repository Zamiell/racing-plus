import {
  isReflectionRender,
  printConsole,
  saveDataManager,
} from "isaacscript-common";

const v = {
  run: {
    player: false, // 1
    familiar: false, // 3
    slot: false, // 6
    effect: false, // 1000
    npc: false,
  },
};

export function init(): void {
  saveDataManager("debugDisplay", v, () => false);
}

// EntityType.ENTITY_PLAYER (1)
export function togglePlayerDisplay(): void {
  v.run.player = !v.run.player;
  printEnabled(v.run.player, "player display");
}

// EntityType.ENTITY_FAMILIAR (3)
export function toggleFamiliarDisplay(): void {
  v.run.familiar = !v.run.familiar;
  printEnabled(v.run.familiar, "familiar display");
}

// EntityType.ENTITY_SLOT (6)
export function toggleSlotDisplay(): void {
  v.run.slot = !v.run.slot;
  printEnabled(v.run.slot, "slot display");
}

// EntityType.ENTITY_EFFECT (1000)
export function toggleEffectDisplay(): void {
  v.run.effect = !v.run.effect;
  printEnabled(v.run.effect, "effect display");
}

export function toggleNPCDisplay(): void {
  v.run.npc = !v.run.npc;
  printEnabled(v.run.npc, "NPC display");
}

// ModCallbacks.MC_POST_FAMILIAR_RENDER (25)
export function postFamiliarRender(familiar: EntityFamiliar): void {
  if (!v.run.familiar) {
    return;
  }

  const text = `State: ${familiar.State}`;
  // const text = `Position: ${familiar.Position.X}, ${familiar.Position.Y}`;
  // const text = `Animation: ${familiar.GetSprite().GetAnimation()}`;
  // const text = `Visible: ${familiar.IsVisible()}`;
  const position = Isaac.WorldToScreen(familiar.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}

// ModCallbacks.MC_POST_NPC_RENDER (28)
export function postNPCRender(npc: EntityNPC): void {
  if (!v.run.npc) {
    return;
  }

  const text = `State: ${npc.State}, StateFrame: ${npc.StateFrame}, I1: ${npc.I1}, I2: ${npc.I2}, V1: ${npc.V1}, V2: ${npc.V2}`;
  const position = Isaac.WorldToScreen(npc.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}

// ModCallbacks.MC_POST_PLAYER_RENDER (32)
export function postPlayerRender(
  player: EntityPlayer,
  renderOffset: Vector,
): void {
  if (!v.run.player) {
    return;
  }

  if (isReflectionRender(renderOffset)) {
    return;
  }

  // const positionX = round(player.Position.X, 1);
  // const positionY = round(player.Position.Y, 1);
  // const text = `Position: (${positionX}, ${positionY})`;
  // const velocityX = round(player.Velocity.X, 1);
  // const velocityY = round(player.Velocity.Y, 1);
  // const text = `Velocity: (${velocityX}, ${velocityY})`;
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  const overlayAnimation = sprite.GetOverlayAnimation();
  const text = `Anim: ${animation}, ${overlayAnimation}`;
  const position = Isaac.WorldToScreen(player.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}

// ModCallbacks.MC_POST_EFFECT_RENDER (56)
export function postEffectRender(effect: EntityEffect): void {
  if (!v.run.effect) {
    return;
  }

  const text = `State: ${effect.State}`;
  // const text = `Position: ${effect.Position.X}, ${effect.Position.Y}`;
  const position = Isaac.WorldToScreen(effect.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}

// ModCallbacksCustom.MC_POST_SLOT_RENDER
export function postSlotRender(slot: Entity): void {
  if (!v.run.slot) {
    return;
  }

  const sprite = slot.GetSprite();
  const animation = sprite.GetAnimation();
  const frame = sprite.GetFrame();
  const text = `Anim: ${animation}, Frame: ${frame}`;
  const position = Isaac.WorldToScreen(slot.Position);
  Isaac.RenderText(text, position.X, position.Y, 1, 1, 1, 1);
}

function printEnabled(enabled: boolean, description: string) {
  const enabledText = enabled ? "Enabled" : "Disabled";
  printConsole(`${enabledText} ${description}.`);
}
