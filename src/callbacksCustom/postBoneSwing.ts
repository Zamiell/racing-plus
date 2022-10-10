import { ModCallbackCustom } from "isaacscript-common";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_BONE_SWING, main);
}

function main(boneClub: EntityKnife) {
  leadPencilChargeBar.postBoneSwing(boneClub);
}
