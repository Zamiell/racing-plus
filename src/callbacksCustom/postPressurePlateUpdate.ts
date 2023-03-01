import { ModCallbackCustom } from "isaacscript-common";
import * as racePostGridEntityUpdate from "../features/race/callbacks/postPressurePlateUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE, main);
}

function main(pressurePlate: GridEntityPressurePlate) {
  racePostGridEntityUpdate.racePostPressurePlateUpdate(pressurePlate);
}
