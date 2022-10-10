import { ModCallbackCustom } from "isaacscript-common";
import * as changeCharOrderPostGridEntityUpdate from "../features/changeCharOrder/callbacks/postGridEntityUpdate";
import * as racePostGridEntityUpdate from "../features/race/callbacks/postPressurePlateUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE, main);
}

function main(pressurePlate: GridEntityPressurePlate) {
  changeCharOrderPostGridEntityUpdate.changeCharOrderPostPressurePlateUpdate(
    pressurePlate,
  );
  racePostGridEntityUpdate.racePostPressurePlateUpdate(pressurePlate);
}
