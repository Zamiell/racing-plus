import { EntityType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  GAME_FRAMES_PER_SECOND,
  KColorDefault,
  fonts,
  game,
  getScreenBottomRightPos,
  round,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const DPS_TEXT_Y_OFFSET = -40;
const DPS_INTERVAL_SECONDS = 5;

const v = {
  room: {
    totalDamage: 0,
    firstGameFrameOfDamage: null as int | null,
    lastGameFrameOfDamage: null as int | null,
  },
};

export class DummyDPS extends ConfigurableModFeature {
  configKey: keyof Config = "DummyDPS";
  v = v;

  // 11, 964
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.DUMMY)
  entityTakeDmgDummy(_entity: Entity, amount: float): boolean | undefined {
    // This entity constantly takes damage for some reason.
    if (amount <= 0) {
      return undefined;
    }

    const gameFrameCount = game.GetFrameCount();

    v.room.totalDamage += amount;
    if (v.room.firstGameFrameOfDamage === null) {
      const player = Isaac.GetPlayer();
      const framePenaltyForCharging = player.MaxFireDelay;
      v.room.firstGameFrameOfDamage = gameFrameCount - framePenaltyForCharging;
    }
    v.room.lastGameFrameOfDamage = gameFrameCount;

    return undefined;
  }

  // 28, 964
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.DUMMY)
  postNPCRenderDummy(npc: EntityNPC): void {
    this.resetDPSIfNSecondsPassed();
    this.drawDPSText(npc);
  }

  resetDPSIfNSecondsPassed(): void {
    const gameFrameCount = game.GetFrameCount();

    if (
      v.room.firstGameFrameOfDamage !== null
      && v.room.lastGameFrameOfDamage !== null
    ) {
      const elapsedSeconds = this.getElapsedSeconds(
        v.room.lastGameFrameOfDamage,
        gameFrameCount,
      );
      if (elapsedSeconds >= DPS_INTERVAL_SECONDS) {
        // Reset the counter if it has been more than N seconds since the last damage.
        v.room.totalDamage = 0;
        v.room.firstGameFrameOfDamage = null;
        v.room.lastGameFrameOfDamage = null;
      }
    }
  }

  drawDPSText(npc: EntityNPC): void {
    const dps = this.getDPS();
    const roundedDPS = round(dps, 2);
    let roundedDPSString = roundedDPS.toString();
    if (roundedDPSString === "0" || roundedDPSString === "0.0") {
      roundedDPSString = "0.00";
    }
    const text = `DPS: ${roundedDPSString}`;
    const renderPosition = Isaac.WorldToScreen(npc.Position);
    const y = renderPosition.Y + DPS_TEXT_Y_OFFSET;
    const bottomRightPos = getScreenBottomRightPos();
    fonts.pfTempestaSevenCondensed.DrawString(
      text,
      0,
      y,
      KColorDefault,
      bottomRightPos.X,
      true,
    );
  }

  getDPS(): float {
    if (
      v.room.firstGameFrameOfDamage === null
      || v.room.lastGameFrameOfDamage === null
    ) {
      return 0;
    }

    const elapsedSeconds = this.getElapsedSeconds(
      v.room.firstGameFrameOfDamage,
      v.room.lastGameFrameOfDamage,
    );

    if (elapsedSeconds <= 0) {
      return 0;
    }

    return v.room.totalDamage / elapsedSeconds;
  }

  getElapsedSeconds(startGameFrame: int, endGameFrame: int): float {
    const framesElapsed = endGameFrame - startGameFrame;
    return framesElapsed / GAME_FRAMES_PER_SECOND;
  }
}
