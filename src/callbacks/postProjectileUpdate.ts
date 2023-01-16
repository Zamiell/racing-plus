import { ModCallback } from "isaac-typescript-definitions";
import * as fadeFriendlyEnemies from "../features/optional/enemies/fadeFriendlyEnemies";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_PROJECTILE_UPDATE, main);
}

function main(projectile: EntityProjectile) {
  fadeFriendlyEnemies.postProjectileUpdate(projectile);
}
