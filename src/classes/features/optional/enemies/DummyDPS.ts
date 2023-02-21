import { EntityType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  fonts,
  game,
  GAME_FRAMES_PER_SECOND,
  getScreenBottomRightPos,
  KColorDefault,
  round,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const DPS_TEXT_Y_OFFSET = -40;
const DPS_INTERVAL_SECONDS = 5;

const v = {
  room: {
    totalDamage: 0,
    firstFrameOfDamage: null as int | null,
    lastFrameOfDamage: null as int | null,
  },
};

export class DummyDPS extends ConfigurableModFeature {
  configKey: keyof Config = "dummyDPS";
  v = v;

  // 11, 964
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.DUMMY)
  entityTakeDmgDummy(_entity: Entity, amount: float): boolean | undefined {
    // This entity constantly takes damage for some reason.
    if (amount <= 0) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();

    v.room.totalDamage += amount;
    if (v.room.firstFrameOfDamage === null) {
      const player = Isaac.GetPlayer();
      const framePenaltyForCharging = player.MaxFireDelay;
      v.room.firstFrameOfDamage = gameFrameCount - framePenaltyForCharging;
    }
    v.room.lastFrameOfDamage = gameFrameCount;

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
      v.room.firstFrameOfDamage !== null &&
      v.room.lastFrameOfDamage !== null
    ) {
      const elapsedSeconds = this.getElapsedSeconds(
        v.room.lastFrameOfDamage,
        gameFrameCount,
      );
      if (elapsedSeconds >= DPS_INTERVAL_SECONDS) {
        // Reset the counter if it has been more than N seconds since the last damage.
        v.room.totalDamage = 0;
        v.room.firstFrameOfDamage = null;
        v.room.lastFrameOfDamage = null;
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
      v.room.firstFrameOfDamage === null ||
      v.room.lastFrameOfDamage === null
    ) {
      return 0;
    }

    const elapsedSeconds = this.getElapsedSeconds(
      v.room.firstFrameOfDamage,
      v.room.lastFrameOfDamage,
    );

    if (elapsedSeconds <= 0) {
      return 0;
    }

    return v.room.totalDamage / elapsedSeconds;
  }

  getElapsedSeconds(startFrame: int, endFrame: int): float {
    const framesElapsed = endFrame - startFrame;
    return framesElapsed / GAME_FRAMES_PER_SECOND;
  }
}
