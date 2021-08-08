import * as debugPowers from "../features/mandatory/debugPowers";

export function main(tear: EntityTear): void {
  debugPowers.postFireTear(tear);
}
