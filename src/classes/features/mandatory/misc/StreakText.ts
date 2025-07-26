import type {
  ActiveSlot,
  PillEffect,
  PlayerForm,
} from "isaac-typescript-definitions";
import {
  ButtonAction,
  CardType,
  CollectibleType,
  FamiliarVariant,
  ItemType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import type { PickingUpItem } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  asCollectibleType,
  fonts,
  game,
  getCardName,
  getCollectibleName,
  getElapsedRenderFramesSince,
  getFamiliars,
  getLevelName,
  getPillEffectName,
  getRandomArrayElement,
  getScreenBottomRightPos,
  getTransformationName,
  getTrinketName,
  hasFlag,
  isActionPressedOnAnyInput,
  newRNG,
  onChallenge,
  onFirstFloor,
  setSeed,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { RaceStatus } from "../../../../enums/RaceStatus";
import { g } from "../../../../globals";
import { isRandomBaby } from "../../../../utilsBabiesMod";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const FONT = fonts.droid;
const FRAMES_BEFORE_FADE = 50;

/**
 * Listed in alphabetical order to match the wiki page (32 in total).
 * https://bindingofisaacrebirth.fandom.com/wiki/Dead_Sea_Scrolls?dlcfilter=3
 */
const DEAD_SEA_SCROLL_EFFECTS = [
  CollectibleType.ANARCHIST_COOKBOOK,
  CollectibleType.BEST_FRIEND,
  CollectibleType.BOBS_ROTTEN_HEAD,
  CollectibleType.BOOK_OF_BELIAL,
  CollectibleType.BOOK_OF_REVELATIONS,
  CollectibleType.BOOK_OF_SHADOWS,
  CollectibleType.BOOK_OF_SIN,
  CollectibleType.CRACK_THE_SKY,
  CollectibleType.CRYSTAL_BALL,
  CollectibleType.DECK_OF_CARDS,
  CollectibleType.DOCTORS_REMOTE,
  CollectibleType.GAMEKID,
  CollectibleType.HOURGLASS,
  CollectibleType.LEMON_MISHAP,
  CollectibleType.MOMS_BOTTLE_OF_PILLS,
  CollectibleType.MOMS_BRA,
  CollectibleType.MOMS_PAD,
  CollectibleType.MONSTER_MANUAL,
  CollectibleType.MONSTROS_TOOTH,
  CollectibleType.MR_BOOM,
  CollectibleType.MY_LITTLE_UNICORN,
  CollectibleType.NAIL,
  CollectibleType.NECRONOMICON,
  CollectibleType.PINKING_SHEARS,
  CollectibleType.PRAYER_CARD,
  CollectibleType.SHOOP_DA_WHOOP,
  CollectibleType.SPIDER_BUTT,
  CollectibleType.TAMMYS_HEAD,
  CollectibleType.TELEPATHY_BOOK,
  CollectibleType.TELEPORT,
  CollectibleType.WE_NEED_TO_GO_DEEPER,
  CollectibleType.YUM_HEART,
] as const;

const v = {
  run: {
    deadSeaScrollsRNG: newRNG(),
    text: null as string | null,

    /** Text of less importance that is only shown if there is no main text. */
    tabText: null as string | null,

    renderFrameSet: null as int | null,
  },
};

/**
 * This class includes many different features relating to streak text, including but not limited
 * to:
 *
 * - reimplementing the level text
 * - showing the card/pill name
 * - showing the chosen Dead Sea Scrolls collectible
 * - showing the chosen Lemegeton collectible
 */
export class StreakText extends MandatoryModFeature {
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    // Players who prefer the vanilla streak text will have a separate mod enabled.
    if (VanillaStreakText !== undefined) {
      return;
    }

    // Only show the floor name if the user is pressing tab.
    const streakTextValue = isActionPressedOnAnyInput(ButtonAction.MAP)
      ? getLevelName()
      : null;
    v.run.tabText = streakTextValue;
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.checkDraw();
  }

  checkDraw(): void {
    // Players who prefer the vanilla streak text will have a separate mod enabled.
    if (VanillaStreakText !== undefined) {
      return;
    }

    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    if (ModConfigMenu !== undefined && ModConfigMenu.IsVisible) {
      return;
    }

    // We don't check for the game being paused because it looks buggy if the text disappears when
    // changing rooms.

    if (v.run.renderFrameSet === null) {
      // Only draw the tab text if there is no normal streak text showing.
      if (v.run.tabText !== null) {
        this.draw(v.run.tabText, 1);
      }

      return;
    }

    // The streak text will slowly fade out.
    const fade = this.getFade(v.run.renderFrameSet);
    if (fade <= 0) {
      v.run.renderFrameSet = null;
      return;
    }

    if (v.run.text !== null) {
      this.draw(v.run.text, fade);
    }
  }

  getFade(renderFrame: int): float {
    const elapsedRenderFrames = getElapsedRenderFramesSince(renderFrame);

    if (elapsedRenderFrames <= FRAMES_BEFORE_FADE) {
      return 1;
    }

    const fadeFrames = elapsedRenderFrames - FRAMES_BEFORE_FADE;
    return 1 - 0.02 * fadeFrames;
  }

  draw(text: string, fade: float): void {
    const bottomRightPos = getScreenBottomRightPos();
    const x = bottomRightPos.X * 0.5;
    const y = bottomRightPos.Y * 0.25;

    const length = FONT.GetStringWidthUTF8(text);
    const color = KColor(1, 1, 1, fade);
    FONT.DrawString(text, x - length / 2, y, color);
  }

  // 3, 712
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.LEMEGETON)
  postUseItemLemegeton(): boolean | undefined {
    const wisp = this.getItemWispThatJustSpawned();
    if (wisp !== undefined) {
      const collectibleName = getCollectibleName(
        asCollectibleType(wisp.SubType),
      );
      setStreakText(collectibleName);
    }

    return undefined;
  }

  getItemWispThatJustSpawned(): EntityFamiliar | undefined {
    const wisps = getFamiliars(FamiliarVariant.ITEM_WISP);
    return wisps.find((wisp) => wisp.FrameCount === 0);
  }

  // 5
  @Callback(ModCallback.POST_USE_CARD)
  postUseCard(
    cardType: CardType,
    _player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
  ): void {
    if (hasFlag(useFlags, UseFlag.NO_ANIMATION)) {
      return;
    }

    // We ignore Blank Runes because we want to show the streak text of the actual random effect.
    if (cardType === CardType.RUNE_BLANK) {
      return;
    }

    const cardName = getCardName(cardType);
    setStreakText(cardName);
  }

  // 10
  @Callback(ModCallback.POST_USE_PILL)
  postUsePill(
    pillEffect: PillEffect,
    _player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
  ): void {
    if (hasFlag(useFlags, UseFlag.NO_ANIMATION)) {
      return;
    }

    const pillEffectName = getPillEffectName(pillEffect);
    setStreakText(pillEffectName);
  }

  /**
   * The Dead Sea Scrolls implementation is mandatory because otherwise players could have different
   * effects during seeded races.
   */
  // 23, 124
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.DEAD_SEA_SCROLLS)
  preUseItemDeadSeaScrolls(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    _useFlags: BitFlags<UseFlag>,
    activeSlot: ActiveSlot,
    _customVarData: int,
  ): boolean | undefined {
    const hud = game.GetHUD();

    const randomCollectible = getRandomArrayElement(
      DEAD_SEA_SCROLL_EFFECTS,
      v.run.deadSeaScrollsRNG,
    );
    player.UseActiveItem(randomCollectible, UseFlag.OWNED, activeSlot);

    const collectibleName = getCollectibleName(randomCollectible);
    if (VanillaStreakText === undefined) {
      setStreakText(collectibleName);
    } else {
      hud.ShowItemText(collectibleName);
    }

    return true;
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    setSeed(v.run.deadSeaScrollsRNG, startSeed);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    if (this.shouldShowLevelText()) {
      this.showLevelText();
    }
  }

  shouldShowLevelText(): boolean {
    const player = Isaac.GetPlayer();

    return (
      // There is no need to show the level text in the Change Char Order custom challenge.
      !onChallenge(ChallengeCustom.CHANGE_CHAR_ORDER)
      // If the race is finished, the "Victory Lap" text will overlap with the stage text, so don't
      // bother showing it.
      && !g.raceVars.finished
      // If we are playing as "Random Baby" from The Babies Mod, the baby descriptions will overlap
      // with the stage text, so don't bother showing it.
      && !isRandomBaby(player)
    );
  }

  showLevelText(): void {
    const level = game.GetLevel();

    // Going to or being in the race room is a special case; we don't want to display the level text
    // here.
    if (g.race.status === RaceStatus.OPEN && onFirstFloor()) {
      return;
    }

    // Show what the new floor is. (The game will not show this naturally after doing a "stage"
    // console command.)
    if (VanillaStreakText === undefined) {
      const text = getLevelName();
      setStreakText(text);
    } else if (!onFirstFloor()) {
      level.ShowName(false);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_TRANSFORMATION)
  postTransformation(
    _player: EntityPlayer,
    playerForm: PlayerForm,
    hasForm: boolean,
  ): void {
    if (!hasForm) {
      return;
    }

    const transformationName = getTransformationName(playerForm);
    setStreakText(transformationName);
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(
    _player: EntityPlayer,
    pickingUpItem: PickingUpItem,
  ): boolean | undefined {
    if (pickingUpItem.itemType === ItemType.NULL) {
      return undefined;
    }

    const isTrinket = pickingUpItem.itemType === ItemType.TRINKET;
    const name = isTrinket
      ? getTrinketName(pickingUpItem.subType)
      : getCollectibleName(pickingUpItem.subType);

    setStreakText(name);

    return undefined;
  }
}

export function setStreakText(text: string): void {
  v.run.text = text;
  v.run.renderFrameSet = Isaac.GetFrameCount();
}
