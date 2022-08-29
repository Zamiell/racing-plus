import {
  EntityCollisionClass,
  EntityType,
  ExorcistVariant,
  NpcState,
} from "isaac-typescript-definitions";
import { getNPCs } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function postNPCRenderHeretic(npc: EntityNPC): void {
  if (!config.fastHeretic) {
    return;
  }

  // The Heretic starts the encounter by spending a long time summoning, so we just immediately end
  // the animation.
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();
  if (animation !== "Summoning") {
    return;
  }
  sprite.SetLastFrame();

  // We also have to manually set the collision class, or else The Heretic will still be
  // `EntityCollisionClass.NONE` (0) when all of the Fanatics being killed.
  npc.EntityCollisionClass = EntityCollisionClass.ALL;

  // We also need to manually "enable" all of the Fanatics in the room, or they will permanently be
  // stuck in the state `NpcState.SPECIAL` (16).
  const fanatics = getNPCs(EntityType.EXORCIST, ExorcistVariant.FANATIC);
  for (const fanatic of fanatics) {
    // They start at `NpcState.SPECIAL` (16) when summoning and then go to state `NpcState.SUICIDE`
    // when the Heretic frees them.
    fanatic.State = NpcState.SUICIDE;
  }
}
