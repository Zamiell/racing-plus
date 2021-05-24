import * as fadeVasculitisTears from "../features/optional/quality/fadeVasculitisTears";

export function blood(tear: EntityTear): void {
  fadeVasculitisTears.postTearUpdateBloodParticle(tear);
}
