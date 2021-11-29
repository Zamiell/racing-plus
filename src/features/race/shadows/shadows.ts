// In seeded races, the silhouettes of other races are drawn onto the screen
// This is accomplished via UDP datagrams that are sent to the client, and then to the server

import {
  getRoomIndex,
  ISAAC_FRAMES_PER_SECOND,
  isActionPressedOnAnyInput,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { isSlideAnimationActive } from "../../util/detectSlideAnimation";
import * as socket from "../socket";
import { RaceFormat } from "../types/RaceFormat";
import { RacerStatus } from "../types/RacerStatus";
import { RaceStatus } from "../types/RaceStatus";
import { CHARACTER_PNG_MAP } from "./characterPNGMap";
import {
  BEACON_DATA_FORMAT,
  BEACON_FIELDS,
  BEACON_INTERVAL,
  BEACON_MESSAGE,
  CHARACTER_LAYER_ID,
  DEFAULT_CHARACTER_PNG,
  FADED_COLOR,
  SHADOW_DATA_FORMAT,
  SHADOW_FIELDS,
  SHADOW_INTERVAL,
} from "./constants";
import * as struct from "./struct";

interface ShadowData {
  userID: int;
  x: float;
  y: float;
  stage: int;
  stageType: int;
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
  stage: int;
  stageType: int;
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
const spriteMap = new Map<int, Sprite>();
const spriteCharacterMap = new Map<int, PlayerType>();

const v = {
  run: {
    /** Indexed by user ID. */
    shadows: new Map<int, ShadowData>(),
  },
};

export function init(): void {
  saveDataManager("shadows", v);
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!shadowsEnabled()) {
    return;
  }

  sendBeacon();
  sendShadow();
  getShadows();
  drawShadows();
}

function shadowsEnabled() {
  const startSeedString = g.seeds.GetStartSeedString();

  return (
    config.shadows &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED &&
    g.race.seed === startSeedString &&
    !g.race.solo
  );
}

function sendBeacon() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (
    lastBeaconFrame !== null &&
    isaacFrameCount < lastBeaconFrame + BEACON_INTERVAL
  ) {
    return;
  }
  lastBeaconFrame = isaacFrameCount;

  const structObject = {
    raceID: g.race.raceID,
    userID: g.race.userID,
    message: BEACON_MESSAGE,
  };

  const structData: unknown[] = [];
  for (const field of BEACON_FIELDS) {
    const key = field as keyof typeof structObject;
    const fieldData = structObject[key];
    structData.push(fieldData);
  }

  const packedData = struct.pack(BEACON_DATA_FORMAT, structData);
  socket.sendUDP(packedData);
}

function sendShadow() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (isaacFrameCount % SHADOW_INTERVAL === 0) {
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
  const roomIndex = getRoomIndex();

  const structObject: ShadowMessage = {
    raceID: g.race.raceID,
    userID: g.race.userID,
    x: player.Position.X,
    y: player.Position.Y,
    stage,
    stageType,
    roomIndex,
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
  // eslint-disable-next-line no-constant-condition
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
  for (let i = 0; i < SHADOW_FIELDS.length; i++) {
    const field = SHADOW_FIELDS[i];
    let fieldData = dataArray[i];
    if (type(fieldData) === "string") {
      fieldData = (fieldData as string).trim();
    }
    shadowMessage[field] = fieldData;
  }

  return shadowMessage as unknown as ShadowMessage;
}

function updateShadow(shadowMessage: ShadowMessage) {
  if (shadowMessage.raceID !== g.race.raceID) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();

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
    frameUpdated: isaacFrameCount,
  };
  v.run.shadows.set(shadowMessage.userID, shadowData);
}

function drawShadows() {
  if (isSlideAnimationActive()) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomIndex = getRoomIndex();

  for (const shadowData of v.run.shadows.values()) {
    const framesSinceLastUpdate = isaacFrameCount - shadowData.frameUpdated;
    if (framesSinceLastUpdate > 1 * ISAAC_FRAMES_PER_SECOND) {
      continue;
    }

    if (
      shadowData.stage !== stage ||
      shadowData.stageType !== stageType ||
      shadowData.roomIndex !== roomIndex
    ) {
      continue;
    }

    const sprite = getShadowSprite(shadowData);
    setSpriteCharacter(sprite, shadowData);
    setSpriteAnimation(sprite, shadowData);
    drawSprite(sprite, shadowData);
  }
}

function getShadowSprite(shadowData: ShadowData) {
  let sprite = spriteMap.get(shadowData.userID);
  if (sprite === undefined) {
    sprite = Sprite();
    sprite.Load("gfx/001.000_Player.anm2", true);
    sprite.Color = FADED_COLOR;
    spriteMap.set(shadowData.userID, sprite);
  }

  return sprite;
}

function setSpriteCharacter(sprite: Sprite, shadowData: ShadowData) {
  let spriteCharacter = spriteCharacterMap.get(shadowData.userID);
  if (spriteCharacter === undefined) {
    spriteCharacter = -1;
  }

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
  const positionGame = Vector(shadowData.x, shadowData.y);
  const position = Isaac.WorldToScreen(positionGame);
  sprite.Render(position, Vector.Zero, Vector.Zero);

  // Additionally, show the username of the player above the sprite if they are holding down the map
  // button
  if (isActionPressedOnAnyInput(ButtonAction.ACTION_MAP)) {
    const positionText = position.add(Vector(0, -40)); // Above the sprite
    const fadeAmount = 0.5;
    const color = KColor(1, 1, 1, fadeAmount);
    const scale = 1;
    const length = g.fonts.pf.GetStringWidthUTF8(shadowData.username) * scale;
    g.fonts.pf.DrawStringScaled(
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
