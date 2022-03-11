import {
  isChildPlayer,
  ModCallbacksCustom,
  ModUpgraded,
} from "isaacscript-common";
import * as flipCustom from "../features/items/flipCustom";
import * as keeperHeal from "../features/optional/bugfix/keeperHeal";
import { fastTravelPostPEffectUpdate } from "../features/optional/major/fastTravel/callbacks/postPEffectUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as roll from "../features/optional/other/roll";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_PEFFECT_UPDATE_REORDERED,
    main,
  );
}

function main(player: EntityPlayer) {
  if (isChildPlayer(player)) {
    return;
  }

  // Major
  startWithD6.postPEffectUpdate(player);
  fastTravelPostPEffectUpdate(player);

  // Gameplay
  combinedDualityDoors.postPEffectUpdate(player);

  // QoL
  chargePocketItemFirst.postPEffectUpdate(player);

  // Bug fixes
  keeperHeal.postPEffectUpdate(player);

  // Items
  flipCustom.postPEffectUpdate(player);

  // Other
  roll.postPEffectUpdate(player);
}
