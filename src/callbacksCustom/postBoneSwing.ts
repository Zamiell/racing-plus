import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_BONE_SWING, main);
}

function main(boneClub: EntityKnife) {
  leadPencilChargeBar.postBoneSwing(boneClub);
}
