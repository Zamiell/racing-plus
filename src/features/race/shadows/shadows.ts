// In seeded races, the silhouettes of other races are drawn onto the screen. This is accomplished
// via UDP datagrams that are sent to the client, and then to the server.

import {
  ButtonAction,
  LevelStage,
  PlayerType,
  StageType,
} from "isaac-typescript-definitions";
import {
  DefaultMap,
  fonts,
  game,
  getRoomListIndex,
  isActionPressedOnAnyInput,
  RENDER_FRAMES_PER_SECOND,
  VectorZero,
} from "isaacscript-common";
import { RaceFormat } from "../../../enums/RaceFormat";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";
import * as socket from "../socket";
import { CHARACTER_PNG_MAP } from "./characterPNGMap";
import {
  BEACON_DATA_FORMAT,
  BEACON_FIELDS,
  BEACON_INTERVAL,
  BEACON_MESSAGE,
  CHARACTER_LAYER_ID,
  DEFAULT_CHARACTER_PNG,
  SHADOW_DATA_FORMAT,
  SHADOW_FADED_COLOR,
  SHADOW_FIELDS,
  SHADOW_INTERVAL,
} from "./constants";
import * as struct from "./struct";

interface ShadowData {
  userID: int;
  x: float;
  y: float;
  stage: LevelStage;
  stageType: StageType;
  /** Equal to the list index specifically. */
  roomIndex: int;
  character: PlayerType;
  animation: string;
  animationFrame: int;
  overlayAnimation: string;
  overlayAnimationFrame: int;
  username: string;
  frameUpdated: int;
}

interface ShadowMessage {
  raceID: int;
  userID: int;
  x: float;
  y: float;
  stage: LevelStage;
  stageType: StageType;
  /** Equal to the list index specifically. */
  roomIndex: int;
  character: PlayerType;
  animation: string;
  animationFrame: int;
  overlayAnimation: string;
  overlayAnimationFrame: int;
  username: string;
}

let lastBeaconFrame: int | null = null;

/** Indexed by user ID. */
const spriteMap = new DefaultMap<int, Sprite>(() => newShadowSprite());
const spriteCharacterMap = new DefaultMap<int, PlayerType | -1>(-1);

function newShadowSprite() {
  const sprite = Sprite();
  sprite.Load("gfx/001.000_Player.anm2", true);
  sprite.Color = SHADOW_FADED_COLOR;

  return sprite;
}

const v = {
  run: {
    /** Indexed by user ID. */
    shadows: new Map<int, ShadowData>(),
  },
};

export function init(): void {
  mod.saveDataManager("shadows", v);
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!shadowsEnabled()) {
    return;
  }

  sendBeacon();
  sendShadow();
  getShadows();
  drawShadows();
}

/** We only check for the config option in the render function. */
function shadowsEnabled() {
  const startSeedString = g.seeds.GetStartSeedString();

  return (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED &&
    g.race.seed === startSeedString &&
    !g.race.solo
  );
}

function sendBeacon() {
  const renderFrameCount = Isaac.GetFrameCount();

  if (
    lastBeaconFrame !== null &&
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

function sendShadow() {
  const renderFrameCount = Isaac.GetFrameCount();

  if (renderFrameCount % SHADOW_INTERVAL === 0) {
    return;
  }

  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
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

  const packedData = struct.pack(SHADOW_DATA_FORMAT, table.unpack(structData));
  socket.sendUDP(packedData);
}

function getShadows() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,no-constant-condition
  while (true) {
    const rawData = socket.readUDP();
    if (rawData === null) {
      break;
    }

    const shadowMessage = unpackShadowMessage(rawData);
    updateShadow(shadowMessage);
  }
}

function unpackShadowMessage(rawData: string) {
  const dataArray = [...struct.unpack(SHADOW_DATA_FORMAT, rawData)];
  const shadowMessage: Record<string, unknown> = {};
  SHADOW_FIELDS.forEach((field, i) => {
    let fieldData = dataArray[i];
    if (typeof fieldData === "string") {
      fieldData = fieldData.trim();
    }
    shadowMessage[field] = fieldData;
  });

  return shadowMessage as unknown as ShadowMessage;
}

function updateShadow(shadowMessage: ShadowMessage) {
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

function drawShadows() {
  const isPaused = game.IsPaused();
  const hud = game.GetHUD();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const renderFrameCount = Isaac.GetFrameCount();
  const roomListIndex = getRoomListIndex();

  if (!config.shadows) {
    return;
  }

  if (!hud.IsVisible()) {
    return;
  }

  // We do not want shadows to be drawn during room slide animations.
  if (isPaused) {
    return;
  }

  for (const shadowData of v.run.shadows.values()) {
    const framesSinceLastUpdate = renderFrameCount - shadowData.frameUpdated;
    if (framesSinceLastUpdate > 1 * RENDER_FRAMES_PER_SECOND) {
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
    setSpriteCharacter(sprite, shadowData);
    setSpriteAnimation(sprite, shadowData);
    drawSprite(sprite, shadowData);
  }
}

function setSpriteCharacter(sprite: Sprite, shadowData: ShadowData) {
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

function setSpriteAnimation(sprite: Sprite, shadowData: ShadowData) {
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

function drawSprite(sprite: Sprite, shadowData: ShadowData) {
  const font = fonts.pfTempestaSevenCondensed;
  const positionGame = Vector(shadowData.x, shadowData.y);
  const position = Isaac.WorldToScreen(positionGame);
  sprite.Render(position, VectorZero, VectorZero);

  // Additionally, show the username of the player above the sprite if they are holding down the map
  // button.
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
