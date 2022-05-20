import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as changeCharOrderPostGridEntityUpdate from "../features/changeCharOrder/callbacks/postGridEntityUpdate";
import * as racePostGridEntityUpdate from "../features/race/callbacks/postPressurePlateUpdate";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE, main);
}

function main(pressurePlate: GridEntityPressurePlate) {
  changeCharOrderPostGridEntityUpdate.changeCharOrderPostPressurePlateUpdate(
    pressurePlate,
  );
  racePostGridEntityUpdate.racePostPressurePlateUpdate(pressurePlate);
}
