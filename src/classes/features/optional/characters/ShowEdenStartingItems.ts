import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import { CallbackPriority } from "isaac-typescript-definitions/dist/src/enums/CallbackPriority";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  PriorityCallbackCustom,
  game,
  inStartingRoom,
  isEden,
  onFirstFloor,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { newGlowingCollectibleSprite } from "../../../../sprite";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** Near the top-left. */
const ACTIVE_COLLECTIBLE_SPRITE_POSITION = Vector(123, 17);
const PASSIVE_COLLECTIBLE_SPRITE_OFFSET = Vector(30, 0);
const PASSIVE_COLLECTIBLE_SPRITE_POSITION =
  ACTIVE_COLLECTIBLE_SPRITE_POSITION.add(PASSIVE_COLLECTIBLE_SPRITE_OFFSET);

let activeSprite: Sprite | undefined;
let passiveSprite: Sprite | undefined;

const v = {
  run: {
    active: CollectibleType.NULL,
    passive: CollectibleType.NULL,
  },
};

export class ShowEdenStartingItems extends ConfigurableModFeature {
  configKey: keyof Config = "ShowEdenStartingItems";
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.drawItemSprites();
  }

  drawItemSprites(): void {
    const isPaused = game.IsPaused();
    const hud = game.GetHUD();

    if (!hud.IsVisible()) {
      return;
    }

    // We don't care if the sprites show when the game is paused, but we do not want the sprites to
    // show during room slide animations.
    if (isPaused) {
      return;
    }

    if (activeSprite !== undefined) {
      activeSprite.Render(ACTIVE_COLLECTIBLE_SPRITE_POSITION);
    }
    if (passiveSprite !== undefined) {
      passiveSprite.Render(PASSIVE_COLLECTIBLE_SPRITE_POSITION);
    }
  }

  /**
   * This callback needs to be early because we need to identify what the starting collectibles are
   * before any other collectibles are granted (like e.g. at the beginning of a race).
   */
  @PriorityCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    CallbackPriority.EARLY,
    false,
  )
  postGameStartedReorderedFalseEarly(): void {
    this.storeItemIdentities();
  }

  storeItemIdentities(): void {
    const player = Isaac.GetPlayer();

    if (!isEden(player)) {
      return;
    }

    v.run.active = player.GetActiveItem(ActiveSlot.PRIMARY);
    const passive = this.getEdenPassiveItemStarted(player);
    if (passive === undefined) {
      error("Failed to find Eden / Tainted Eden passive item.");
    }
    v.run.passive = passive;
  }

  getEdenPassiveItemStarted(player: EntityPlayer): CollectibleType | undefined {
    const activeItem = player.GetActiveItem(ActiveSlot.PRIMARY);

    for (const collectibleType of mod.getCollectibleArray()) {
      if (
        player.HasCollectible(collectibleType) &&
        collectibleType !== activeItem &&
        collectibleType !== CollectibleType.D6
      ) {
        return collectibleType;
      }
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoom(): void {
    this.resetItemSprites();
    setItemSprites();
  }

  resetItemSprites(): void {
    activeSprite = undefined;
    passiveSprite = undefined;
  }
}

export function changeStartingPassiveItem(
  collectibleType: CollectibleType,
): void {
  v.run.passive = collectibleType;
  setItemSprites();
}

function setItemSprites() {
  if (shouldShowSprites()) {
    activeSprite = newGlowingCollectibleSprite(v.run.active);
    passiveSprite = newGlowingCollectibleSprite(v.run.passive);
  }
}

/** Only show the sprites in the starting room of the first floor. */
function shouldShowSprites(): boolean {
  const player = Isaac.GetPlayer();
  return isEden(player) && onFirstFloor() && inStartingRoom();
}
