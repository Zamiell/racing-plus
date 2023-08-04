// There is an annoying delay before The Fallen and the leeches spawn. To fix this, we manually
// spawn it as soon as the room is entered.

import {
  BossID,
  EntityType,
  FallenVariant,
  LeechVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getNPCs,
  inBossRoomOf,
  newRNG,
  spawnWithSeed,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  room: {
    isContinuingRun: false,
  },
};

export class FastSatan extends ConfigurableModFeature {
  configKey: keyof Config = "FastSatan";
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, true)
  postGameStartedReorderedTrue(): void {
    v.room.isContinuingRun = true;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Prevent the bug where saving and continuing will cause a second Fallen to spawn.
    if (v.room.isContinuingRun) {
      return;
    }

    if (this.inUnclearedSatanRoom()) {
      this.spawnEnemies();
      this.primeStatue();
    }
  }

  inUnclearedSatanRoom(): boolean {
    const room = game.GetRoom();
    const roomClear = room.IsClear();
    return !roomClear && inBossRoomOf(BossID.SATAN);
  }

  spawnEnemies(): void {
    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();
    const roomSeed = room.GetSpawnSeed();
    const rng = newRNG(roomSeed);

    // Spawn 2x Kamikaze Leech.
    for (const gridIndex of [66, 68]) {
      const position = room.GetGridPosition(gridIndex);
      const leechSeed = rng.Next();
      spawnWithSeed(
        EntityType.LEECH,
        LeechVariant.KAMIKAZE_LEECH,
        0,
        position,
        leechSeed,
      );
    }

    // Spawn 1x Fallen.
    const fallenSeed = rng.Next();
    spawnWithSeed(
      EntityType.FALLEN,
      FallenVariant.FALLEN,
      0,
      centerPos,
      fallenSeed,
    );
  }

  /** Prime the statue to wake up quicker. */
  primeStatue(): void {
    const satans = getNPCs(EntityType.SATAN);
    for (const satan of satans) {
      satan.I1 = 1;
    }
  }
}
