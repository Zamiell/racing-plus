import type {
  PlayerType} from "isaac-typescript-definitions";
import {
  ButtonAction,
  ModCallback
} from "isaac-typescript-definitions";
import {
  Callback,
  DefaultMap,
  RENDER_FRAMES_PER_SECOND,
  fonts,
  game,
  getRoomListIndex,
  isActionPressedOnAnyInput,
  setSpriteOpacity,
} from "isaacscript-common";
import * as socket from "../../../../features/race/socket";
import { inSeededRace } from "../../../../features/race/v";
import { g } from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import type { Config } from "../../../Config";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { CHARACTER_PNG_MAP } from "./shadows/characterPNGMap";
import type {
  ShadowData,
  ShadowMessage} from "./shadows/constants";
import {
  BEACON_DATA_FORMAT,
  BEACON_FIELDS,
  BEACON_INTERVAL,
  BEACON_MESSAGE,
  CHARACTER_LAYER_ID,
  DEFAULT_CHARACTER_PNG,
  SHADOW_DATA_FORMAT,
  SHADOW_FADE_AMOUNT,
  SHADOW_FIELDS,
  SHADOW_INTERVAL_RENDER_FRAMES
} from "./shadows/constants";
import * as struct from "./shadows/struct";

let lastBeaconFrame: int | undefined;

/** Indexed by user ID. */
const spriteMap = new DefaultMap<int, Sprite>(() => newShadowSprite());
const spriteCharacterMap = new DefaultMap<int, PlayerType | -1>(-1);

function newShadowSprite() {
  const sprite = Sprite();
  sprite.Load("gfx/001.000_Player.anm2", true);
  setSpriteOpacity(sprite, SHADOW_FADE_AMOUNT);

  return sprite;
}

const v = {
  run: {
    /** Indexed by user ID. */
    shadows: new Map<int, ShadowData>(),
  },
};

/**
 * In seeded races, the silhouettes of other races are drawn onto the screen. This is accomplished
 * via UDP datagrams that are sent to the client, and then to the server.
 *
 * This does not extend from `ConfigurableModFeature` because we want to only check for the config
 * option in the draw function (so that the shadows are properly sent to the server).
 */
export class Shadows extends MandatoryModFeature {
  configKey: keyof Config = "Shadows";
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (!this.shouldSendShadows()) {
      return;
    }

    this.sendBeacon();
    this.sendShadow();
    this.getShadows();
    this.drawShadows(); // We check for the config option here.
  }

  /** We intentionally do not check for the "Shadows" config option here. */
  shouldSendShadows(): boolean {
    const seeds = game.GetSeeds();
    const startSeedString = seeds.GetStartSeedString();

    return inSeededRace() && g.race.seed === startSeedString && !g.race.solo;
  }

  sendBeacon(): void {
    const renderFrameCount = Isaac.GetFrameCount();

    if (
      lastBeaconFrame !== undefined &&
      renderFrameCount < lastBeaconFrame + BEACON_INTERVAL
    ) {
      return;
    }
    lastBeaconFrame = renderFrameCount;

    const structObject = {
      raceID: g.race.raceID,
      userID: g.race.userID,
      message: BEACON_MESSAGE,
    };

    const structData: unknown[] = [];
    for (const field of BEACON_FIELDS) {
      const fieldData = structObject[field];
      structData.push(fieldData);
    }

    const packedData = struct.pack(BEACON_DATA_FORMAT, structData);
    socket.sendUDP(packedData);
  }

  sendShadow(): void {
    const renderFrameCount = Isaac.GetFrameCount();

    if (renderFrameCount % SHADOW_INTERVAL_RENDER_FRAMES === 0) {
      return;
    }

    const level = game.GetLevel();
    const stage = level.GetStage();
    const stageType = level.GetStageType();
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();
    const sprite = player.GetSprite();
    const animation = sprite.GetAnimation();
    const animationFrame = sprite.GetFrame();
    let overlayAnimation = sprite.GetOverlayAnimation();
    if (sprite.IsOverlayPlaying(overlayAnimation)) {
      overlayAnimation = "";
    }
    const overlayAnimationFrame = sprite.GetOverlayFrame();
    const roomListIndex = getRoomListIndex();

    const structObject: ShadowMessage = {
      raceID: g.race.raceID,
      userID: g.race.userID,
      x: player.Position.X,
      y: player.Position.Y,
      stage,
      stageType,
      roomIndex: roomListIndex,
      character,
      animation,
      animationFrame,
      overlayAnimation,
      overlayAnimationFrame,
      username: g.race.username,
    };

    const structData: unknown[] = [];
    for (const field of SHADOW_FIELDS) {
      const key = field as keyof typeof structObject;
      const fieldData = structObject[key];
      structData.push(fieldData);
    }

    const packedData = struct.pack(
      SHADOW_DATA_FORMAT,
      table.unpack(structData),
    );
    socket.sendUDP(packedData);
  }

  getShadows(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,no-constant-condition
    while (true) {
      const rawData = socket.readUDP();
      if (rawData === undefined) {
        break;
      }

      const shadowMessage = this.unpackShadowMessage(rawData);
      this.updateShadow(shadowMessage);
    }
  }

  unpackShadowMessage(rawData: string): ShadowMessage {
    const dataArray = [...struct.unpack(SHADOW_DATA_FORMAT, rawData)];
    const shadowMessage: Record<string, unknown> = {};
    for (const [i, field] of SHADOW_FIELDS.entries()) {
      let fieldData = dataArray[i];
      if (typeof fieldData === "string") {
        fieldData = fieldData.trim();
      }
      shadowMessage[field] = fieldData;
    }

    return shadowMessage as unknown as ShadowMessage;
  }

  updateShadow(shadowMessage: ShadowMessage): void {
    if (shadowMessage.raceID !== g.race.raceID) {
      return;
    }

    const renderFrameCount = Isaac.GetFrameCount();

    const shadowData: ShadowData = {
      userID: shadowMessage.userID,
      x: shadowMessage.x,
      y: shadowMessage.y,
      stage: shadowMessage.stage,
      stageType: shadowMessage.stageType,
      roomIndex: shadowMessage.roomIndex,
      character: shadowMessage.character,
      animation: shadowMessage.animation,
      animationFrame: shadowMessage.animationFrame,
      overlayAnimation: shadowMessage.overlayAnimation,
      overlayAnimationFrame: shadowMessage.overlayAnimationFrame,
      username: shadowMessage.username,
      frameUpdated: renderFrameCount,
    };
    v.run.shadows.set(shadowMessage.userID, shadowData);
  }

  drawShadows(): void {
    if (!config.Shadows) {
      return;
    }

    const isPaused = game.IsPaused();
    const hud = game.GetHUD();
    const level = game.GetLevel();
    const stage = level.GetStage();
    const stageType = level.GetStageType();
    const renderFrameCount = Isaac.GetFrameCount();
    const roomListIndex = getRoomListIndex();

    if (!hud.IsVisible()) {
      return;
    }

    // We do not want shadows to be drawn during room slide animations.
    if (isPaused) {
      return;
    }

    for (const shadowData of v.run.shadows.values()) {
      const framesSinceLastUpdate = renderFrameCount - shadowData.frameUpdated;
      if (framesSinceLastUpdate > Number(RENDER_FRAMES_PER_SECOND)) {
        continue;
      }

      if (
        shadowData.stage !== stage ||
        shadowData.stageType !== stageType ||
        shadowData.roomIndex !== roomListIndex
      ) {
        continue;
      }

      const sprite = spriteMap.getAndSetDefault(shadowData.userID);
      this.setSpriteCharacter(sprite, shadowData);
      this.setSpriteAnimation(sprite, shadowData);
      this.drawSprite(sprite, shadowData);
    }
  }

  setSpriteCharacter(sprite: Sprite, shadowData: ShadowData): void {
    const spriteCharacter = spriteCharacterMap.getAndSetDefault(
      shadowData.userID,
    );
    if (spriteCharacter !== shadowData.character) {
      spriteCharacterMap.set(shadowData.userID, shadowData.character);

      let characterPNG = CHARACTER_PNG_MAP.get(shadowData.character);
      if (characterPNG === undefined) {
        characterPNG = DEFAULT_CHARACTER_PNG;
      }
      sprite.ReplaceSpritesheet(CHARACTER_LAYER_ID, characterPNG);
    }
  }

  setSpriteAnimation(sprite: Sprite, shadowData: ShadowData): void {
    sprite.SetAnimation(shadowData.animation);
    sprite.SetFrame(shadowData.animationFrame);

    if (shadowData.overlayAnimation === "") {
      sprite.RemoveOverlay();
    } else {
      sprite.SetOverlayFrame(
        shadowData.overlayAnimation,
        shadowData.overlayAnimationFrame,
      );
    }
  }

  drawSprite(sprite: Sprite, shadowData: ShadowData): void {
    const font = fonts.pfTempestaSevenCondensed;
    const positionGame = Vector(shadowData.x, shadowData.y);
    const position = Isaac.WorldToScreen(positionGame);
    sprite.Render(position);

    // Additionally, show the username of the player above the sprite if they are holding down the
    // map button.
    if (isActionPressedOnAnyInput(ButtonAction.MAP)) {
      const positionText = position.add(Vector(0, -40)); // Above the sprite
      const fadeAmount = 0.5;
      const color = KColor(1, 1, 1, fadeAmount);
      const scale = 1;
      const length = font.GetStringWidthUTF8(shadowData.username) * scale;
      font.DrawStringScaled(
        shadowData.username,
        positionText.X - length / 2,
        positionText.Y,
        scale,
        scale,
        color,
        0,
        true,
      );
    }
  }
}
