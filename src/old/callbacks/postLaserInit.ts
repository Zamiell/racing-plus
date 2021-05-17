// Note: Position, SpawnerType, SpawnerVariant, and MaxDistance are not initialized yet in this
// callback

import * as seededDeath from "../features/seededDeath";

export function giantRed(laser: EntityLaser): void {
  seededDeath.deleteMegaBlastLaser(laser);
}
