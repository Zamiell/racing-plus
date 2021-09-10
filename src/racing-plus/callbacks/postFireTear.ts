import * as debugPowers from "../features/mandatory/debugPowers";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";

export function main(tear: EntityTear): void {
  // Mandatory
  debugPowers.postFireTear(tear);

  // QoL
  leadPencilChargeBar.postFireTear();
}
