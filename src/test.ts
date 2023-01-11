import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "./mod";

export function postUpdateInit(): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  Isaac.DebugString("ModCallback.POST_UPDATE");
}
