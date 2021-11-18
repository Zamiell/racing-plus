import {
  GAME_FRAMES_PER_SECOND,
  getDefaultKColor,
  getScreenBottomRightPos,
  round,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";

const DPS_TEXT_Y_OFFSET = -40;
const DPS_INTERVAL_SECONDS = 5;

const v = {
  room: {
    totalDamage: 0,
    firstFrameOfDamage: null as int | null,
    lastFrameOfDamage: null as int | null,
  },
};

export function init(): void {
  saveDataManager("dummyDPS", v);
}

// ModCallbacks.MC_POST_NPC_RENDER (28)
// EntityType.ENTITY_DUMMY (964)
export function postNPCRenderDummy(npc: EntityNPC): void {
  resetDPSIfNSecondsPassed();
  drawDPSText(npc);
}

function resetDPSIfNSecondsPassed() {
  const gameFrameCount = g.g.GetFrameCount();

  if (v.room.firstFrameOfDamage !== null && v.room.lastFrameOfDamage !== null) {
    const elapsedSeconds = getElapsedSeconds(
      v.room.lastFrameOfDamage,
      gameFrameCount,
    );
    if (elapsedSeconds >= DPS_INTERVAL_SECONDS) {
      // Reset the counter if it has been more than N seconds since the last damage
      v.room.totalDamage = 0;
      v.room.firstFrameOfDamage = null;
      v.room.lastFrameOfDamage = null;
    }
  }
}

function drawDPSText(npc: EntityNPC) {
  const dps = getDPS();
  const roundedDPS = round(dps, 2);
  let roundedDPSString = roundedDPS.toString();
  if (roundedDPSString === "0" || roundedDPSString === "0.0") {
    roundedDPSString = "0.00";
  }
  const text = `DPS: ${roundedDPSString}`;
  const renderPosition = Isaac.WorldToScreen(npc.Position);
  const y = renderPosition.Y + DPS_TEXT_Y_OFFSET;
  const bottomRightPos = getScreenBottomRightPos();
  g.fonts.pf.DrawString(text, 0, y, getDefaultKColor(), bottomRightPos.X, true);
}

function getDPS() {
  if (v.room.firstFrameOfDamage === null || v.room.lastFrameOfDamage === null) {
    return 0;
  }

  const elapsedSeconds = getElapsedSeconds(
    v.room.firstFrameOfDamage,
    v.room.lastFrameOfDamage,
  );

  if (elapsedSeconds <= 0) {
    return 0;
  }

  return v.room.totalDamage / elapsedSeconds;
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_DUMMY (964)
export function entityTakeDmgDummy(damageAmount: float): void {
  // This entity constantly takes damage for some reason
  if (damageAmount <= 0) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();

  v.room.totalDamage += damageAmount;
  if (v.room.firstFrameOfDamage === null) {
    const player = Isaac.GetPlayer();
    const framePenaltyForCharging = player.MaxFireDelay;
    v.room.firstFrameOfDamage = gameFrameCount - framePenaltyForCharging;
  }
  v.room.lastFrameOfDamage = gameFrameCount;
}

function getElapsedSeconds(startFrame: int, endFrame: int) {
  const framesElapsed = endFrame - startFrame;
  return framesElapsed / GAME_FRAMES_PER_SECOND;
}
