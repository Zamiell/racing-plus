import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_BONE_SWING, main);
}

function main(boneClub: EntityKnife) {
  leadPencilChargeBar.postBoneSwing(boneClub);
}
