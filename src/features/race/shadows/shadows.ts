// In seeded races, the silhouettes of other races are drawn onto the screen
// This is accomplished via UDP datagrams that are sent to the client, and then to the server

import { getRoomIndex, saveDataManager } from "isaacscript-common";
import { ISAAC_FRAMES_PER_SECOND } from "../../../constants";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { isSlideAnimationActive } from "../../util/detectSlideAnimation";
import * as socket from "../socket";
import RaceFormat from "../types/RaceFormat";
import RacerStatus from "../types/RacerStatus";
import RaceStatus from "../types/RaceStatus";
import {
  BEACON_DATA_FORMAT,
  BEACON_FIELDS,
  BEACON_INTERVAL,
  BEACON_MESSAGE,
  CHARACTER_LAYER_ID,
  CHARACTER_PNG_MAP,
  DEFAULT_ANIMATION,
  DEFAULT_CHARACTER_PNG,
  DEFAULT_OVERLAY_ANIMATION,
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
  roomIndex: int;
  character: PlayerType;
  animation: string;
  animationFrame: int;
  overlayAnimation: string;
  overlayAnimationFrame: int;
  frameUpdated: int;
}

interface ShadowMessage {
  raceID: int;
  userID: int;
  x: float;
  y: float;
  stage: int;
  roomIndex: int;
  character: PlayerType;
  animation: string;
  animationFrame: int;
  overlayAnimation: string;
  overlayAnimationFrame: int;
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
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  const animationFrame = sprite.GetFrame();
  const overlayAnimation = sprite.GetOverlayAnimation();
  const overlayAnimationFrame = sprite.GetOverlayFrame();
  const roomIndex = getRoomIndex();

  const structObject: ShadowMessage = {
    raceID: g.race.raceID,
    userID: g.race.userID,
    x: player.Position.X,
    y: player.Position.Y,
    stage,
    roomIndex,
    character,
    animation,
    animationFrame,
    overlayAnimation,
    overlayAnimationFrame,
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
    roomIndex: shadowMessage.roomIndex,
    character: shadowMessage.character,
    animation: shadowMessage.animation,
    animationFrame: shadowMessage.animationFrame,
    overlayAnimation: shadowMessage.overlayAnimation,
    overlayAnimationFrame: shadowMessage.overlayAnimationFrame,
    frameUpdated: isaacFrameCount,
  };
  v.run.shadows.set(shadowMessage.userID, shadowData);
}

function drawShadows() {
  if (isSlideAnimationActive()) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const roomIndex = getRoomIndex();

  for (const shadowData of v.run.shadows.values()) {
    const framesSinceLastUpdate = isaacFrameCount - shadowData.frameUpdated;
    if (framesSinceLastUpdate > 1 * ISAAC_FRAMES_PER_SECOND) {
      continue;
    }

    if (shadowData.roomIndex !== roomIndex) {
      continue;
    }

    let sprite = spriteMap.get(shadowData.userID);
    if (sprite === undefined) {
      sprite = Sprite();
      sprite.Load("gfx/001.000_Player.anm2", true);
      sprite.Color = FADED_COLOR;
      spriteMap.set(shadowData.userID, sprite);
    }

    let spriteCharacter = spriteCharacterMap.get(shadowData.userID);
    if (spriteCharacter === undefined) {
      spriteCharacter = -1;
    }

    if (spriteCharacter !== shadowData.character) {
      let characterPNG = CHARACTER_PNG_MAP.get(shadowData.character);
      if (characterPNG === undefined) {
        characterPNG = DEFAULT_CHARACTER_PNG;
      }
      sprite.ReplaceSpritesheet(CHARACTER_LAYER_ID, characterPNG);
      spriteCharacterMap.set(shadowData.userID, shadowData.character);
    }

    sprite.SetAnimation(DEFAULT_ANIMATION);
    sprite.SetFrame(shadowData.animationFrame);
    sprite.SetOverlayAnimation(DEFAULT_OVERLAY_ANIMATION);
    sprite.SetOverlayFrame(
      shadowData.overlayAnimation,
      shadowData.overlayAnimationFrame,
    );
    const positionGame = Vector(shadowData.x, shadowData.y);
    const position = Isaac.WorldToRenderPosition(positionGame);
    sprite.Render(position, Vector.Zero, Vector.Zero);
  }
}
