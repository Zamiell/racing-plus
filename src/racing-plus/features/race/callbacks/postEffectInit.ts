import * as seededDeath from "../seededDeath";

export function bloodDrop(effect: EntityEffect): void {
  seededDeath.postEffectInitBloodDrop(effect);
}
