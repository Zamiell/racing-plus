import { hasFlag, saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const v = {
  level: {
    numSacrifices: 0,
  },
};

export function init(): void {
  saveDataManager("showNumSacrifices", v, featureEnabled);
}

function featureEnabled() {
  return config.showNumSacrifices;
}

export function entityTakeDmgPlayer(damageFlags: int): void {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_SACRIFICE) {
    return;
  }

  if (hasFlag(damageFlags, DamageFlag.DAMAGE_SPIKES)) {
    v.level.numSacrifices += 1;
  }
}

export function shouldShowNumSacrifices(): boolean {
  if (!config.showNumSacrifices) {
    return false;
  }

  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();

  return roomType === RoomType.ROOM_SACRIFICE && roomFrameCount > 0;
}

export function getNumSacrifices(): int {
  return v.level.numSacrifices;
}
