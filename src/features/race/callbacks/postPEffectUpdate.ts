import * as seeded3DollarBill from "../seeded3DollarBill";
import * as seededMagic8Ball from "../seededMagic8Ball";

export function racePostPEffectUpdate(player: EntityPlayer): void {
  seeded3DollarBill.postPEffectUpdate(player);
  seededMagic8Ball.postPEffectUpdate(player);
}
