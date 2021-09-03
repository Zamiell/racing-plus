import g from "./globals";

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;

  /*
  const daddyLongLegs = Isaac.FindByType(EntityType.ENTITY_DADDYLONGLEGS);
  for (const daddy of daddyLongLegs) {
    const npc = daddy.ToNPC();
    if (npc !== null) {
      npc.State =
        DaddyLongLegsState.MULTI_STOMP_ATTACK_MAIN;
    }
  }
  */
}

export function debugFunction2(): void {}
