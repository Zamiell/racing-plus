import g from "../globals";

export function main(tear: EntityTear): void {
  chaosCardTears(tear);
}

function chaosCardTears(tear: EntityTear) {
  if (g.run.debugChaosCard) {
    tear.ChangeVariant(TearVariant.CHAOS_CARD);
  }
}
