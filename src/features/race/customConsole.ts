import { Keyboard } from "isaac-typescript-definitions";
import {
  DefaultMap,
  disableAllInputs,
  enableAllInputs,
  fonts,
  game,
  getEnumValues,
  getScreenBottomRightPos,
  hexToKColor,
  isEven,
  isKeyboardPressed,
  keyboardToString,
  log,
  RENDER_FRAMES_PER_SECOND,
  saveDataManager,
} from "isaacscript-common";
import { Colors } from "../../enums/Colors";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { hotkeys } from "../../modConfigMenu";
import { TextSegment } from "../../types/TextSegment";
import { consoleCommand } from "../../utils";
import * as socket from "./socket";

const FEATURE_NAME = "customConsole";
export const CONSOLE_POSITION = getScreenPosition(0, 0, 0.167, 0.6);
const MAX_HISTORY_LENGTH = 100;
const REPEAT_KEY_DELAY_IN_RENDER_FRAMES = RENDER_FRAMES_PER_SECOND * 0.5;
export const DEFAULT_CONSOLE_OPACITY = 0.75;
const DEFAULT_CONSOLE_OPEN_INPUT = Keyboard.ENTER;

let consoleOpen = false;
let inputText = "";
let inputTextIndex = 0;
/** Used to save a partially completed message when recalling history. */
let savedText = "";
let historyIndex = -1;

/** Values are the render frame that the key was pressed. */
const keysPressed = new DefaultMap<Keyboard, int, [isaacFrameCount: int]>(
  (isaacFrameCount: int) => isaacFrameCount,
);

const v = {
  persistent: {
    inputHistory: [] as string[],
  },
};

export function init(): void {
  saveDataManager(FEATURE_NAME, v);
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  const isPaused = game.IsPaused();
  const hud = game.GetHUD();
  const renderFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();

  // Don't check for inputs or draw the console when Mod Config Menu is open.
  if (!hud.IsVisible()) {
    return;
  }

  // Don't check for inputs or draw the console when the game is paused or the console is open.
  if (isPaused) {
    return;
  }

  if (player.IsDead()) {
    close(false);
    return;
  }

  const consoleOpenInput =
    hotkeys.console === -1 ? DEFAULT_CONSOLE_OPEN_INPUT : hotkeys.console;

  if (!consoleOpen) {
    checkKeyboardInput(consoleOpenInput, renderFrameCount, consoleOpenInput);
    return;
  }

  checkAllKeyboardInput(renderFrameCount, consoleOpenInput);
  drawConsole();
}

function checkAllKeyboardInput(
  isaacFrameCount: int,
  consoleOpenInput: Keyboard,
) {
  for (const keyboardValue of getEnumValues(Keyboard)) {
    checkKeyboardInput(keyboardValue, isaacFrameCount, consoleOpenInput);
  }
}

function checkKeyboardInput(
  keyboardValue: Keyboard,
  isaacFrameCount: int,
  consoleOpenInput: Keyboard,
) {
  const pressed = isKeyboardPressed(keyboardValue);
  if (!pressed) {
    keysPressed.delete(keyboardValue);
    return;
  }

  const framePressed = keysPressed.getAndSetDefault(
    keyboardValue,
    isaacFrameCount,
  );

  // We want the key to be repeated if they are holding down the key (after a short delay).
  const pressedOnThisFrame = framePressed === isaacFrameCount;
  const framesSinceKeyPressed = isaacFrameCount - framePressed;
  const shouldTriggerRepeatPress =
    framesSinceKeyPressed > REPEAT_KEY_DELAY_IN_RENDER_FRAMES &&
    isEven(framesSinceKeyPressed) && // Every other frame
    keyboardValue !== consoleOpenInput;
  const shouldPress = pressedOnThisFrame || shouldTriggerRepeatPress;

  if (shouldPress) {
    keyPressed(keyboardValue, consoleOpenInput);
  }
}

function keyPressed(keyboardValue: Keyboard, consoleOpenInput: Keyboard) {
  // Do nothing if modifiers other than shift are pressed.
  if (
    keysPressed.has(Keyboard.LEFT_CONTROL) ||
    keysPressed.has(Keyboard.RIGHT_CONTROL) ||
    keysPressed.has(Keyboard.LEFT_ALT) ||
    keysPressed.has(Keyboard.RIGHT_ALT) ||
    keysPressed.has(Keyboard.LEFT_SUPER) ||
    keysPressed.has(Keyboard.RIGHT_SUPER)
  ) {
    return;
  }

  const shiftPressed =
    keysPressed.has(Keyboard.LEFT_SHIFT) ||
    keysPressed.has(Keyboard.RIGHT_SHIFT);

  if (keyboardValue === consoleOpenInput && !shiftPressed) {
    if (consoleOpen) {
      close();
    } else if (g.race.status !== RaceStatus.NONE) {
      open();
    }

    return;
  }

  const keyFunction = keyFunctionMap.get(keyboardValue);
  if (keyFunction !== undefined && !shiftPressed) {
    keyFunction();
    return;
  }

  const keyStringArray = keyboardToString(keyboardValue, shiftPressed);
  if (keyStringArray !== undefined) {
    const [lowercaseCharacter, uppercaseCharacter] = keyStringArray;
    const character = shiftPressed ? uppercaseCharacter : lowercaseCharacter;
    const front = inputText.slice(0, inputTextIndex);
    const back = inputText.slice(inputTextIndex);
    inputText = `${front}${character}${back}`;
    inputTextIndex++;
  }
}

function open() {
  consoleOpen = true;
  disableAllInputs(FEATURE_NAME);
  AwaitingTextInput = true;

  log("Console opened.");
}

function close(execute = true) {
  if (!consoleOpen) {
    return;
  }

  consoleOpen = false;
  enableAllInputs(FEATURE_NAME);
  AwaitingTextInput = false;

  if (!execute || inputText === "") {
    savedText = "";
    historyIndex = -1;

    log("Console closed - command canceled.");
    return;
  }

  if (g.race.status === RaceStatus.NONE) {
    consoleCommand(inputText);
  } else {
    socket.send("chat", inputText);
  }

  appendHistory();
  inputText = "";
  inputTextIndex = 0;
  savedText = "";
  historyIndex = -1;

  log("Console closed - command executed.");
}

function appendHistory() {
  if (v.persistent.inputHistory.length > 0) {
    const lastHistory = v.persistent.inputHistory[0];
    if (inputText === lastHistory) {
      return;
    }
  }

  v.persistent.inputHistory.unshift(inputText);
  if (v.persistent.inputHistory.length >= MAX_HISTORY_LENGTH) {
    v.persistent.inputHistory.pop();
  }
}

function drawConsole() {
  // We check to see if the console is open again in case it was opened on this frame.
  if (!consoleOpen) {
    return;
  }

  const front = inputText.slice(0, inputTextIndex);
  const back = inputText.slice(inputTextIndex);
  const textSegments: TextSegment[] = [
    {
      text: ">",
      color: Colors.WHITE,
    },
    {
      text: front,
      color: Colors.WHITE,
    },
    {
      text: "|",
      color: Colors.YELLOW,
    },
    {
      text: back,
      color: Colors.WHITE,
    },
  ];

  drawText(textSegments, CONSOLE_POSITION);
}

export function drawText(
  textSegments: TextSegment[],
  position: Vector,
  alpha = DEFAULT_CONSOLE_OPACITY,
): void {
  const font = fonts.pfTempestaSevenCondensed;
  let x = position.X;
  const y = position.Y;

  for (const textSegment of textSegments) {
    const hexColor =
      textSegment.color === undefined ? Colors.WHITE : textSegment.color;
    const kColor = hexToKColor(hexColor, alpha);
    font.DrawString(textSegment.text, x, y, kColor, 0, true);

    x += font.GetStringWidth(textSegment.text);
  }
}

function getScreenPosition(
  x: float,
  y: float,
  anchorX: float,
  anchorY: float,
): Vector {
  const bottomRightPos = getScreenBottomRightPos();
  return Vector(
    anchorX * bottomRightPos.X + x * (1 - anchorX * 2),
    anchorY * bottomRightPos.Y + y * (1 - anchorY * 2),
  );
}

const keyFunctionMap = new Map<Keyboard, () => void>();

// 256
keyFunctionMap.set(Keyboard.ESCAPE, () => {
  close(false);
});

// 259
keyFunctionMap.set(Keyboard.BACKSPACE, () => {
  if (inputTextIndex === 0) {
    return;
  }

  const front = inputText.slice(0, inputTextIndex);
  const back = inputText.slice(inputTextIndex);
  const frontWithLastCharRemoved = front.slice(0, -1);
  inputText = frontWithLastCharRemoved + back;
  inputTextIndex--;
});

// 262
keyFunctionMap.set(Keyboard.RIGHT, () => {
  if (inputTextIndex === inputText.length) {
    return;
  }

  inputTextIndex++;
});

// 263
keyFunctionMap.set(Keyboard.LEFT, () => {
  if (inputTextIndex === 0) {
    return;
  }

  inputTextIndex--;
});

// 264
keyFunctionMap.set(Keyboard.DOWN, () => {
  if (historyIndex === -1) {
    return;
  }

  historyIndex--;

  if (historyIndex === -1) {
    inputText = savedText;
    inputTextIndex = savedText.length;
    return;
  }

  const inputHistoryText = v.persistent.inputHistory[historyIndex];
  if (inputHistoryText === undefined) {
    return;
  }

  inputText = inputHistoryText;
  inputTextIndex = inputHistoryText.length;
});

// 265
keyFunctionMap.set(Keyboard.UP, () => {
  if (historyIndex === -1) {
    savedText = inputText;
  }

  if (historyIndex >= MAX_HISTORY_LENGTH) {
    return;
  }

  const newHistoryIndex = historyIndex + 1;
  if (newHistoryIndex >= v.persistent.inputHistory.length) {
    return;
  }

  historyIndex = newHistoryIndex;
  const inputHistoryText = v.persistent.inputHistory[historyIndex];
  if (inputHistoryText === undefined) {
    return;
  }

  inputText = inputHistoryText;
  inputTextIndex = inputHistoryText.length;
});

// 268
keyFunctionMap.set(Keyboard.HOME, () => {
  inputTextIndex = 0;
});

// 269
keyFunctionMap.set(Keyboard.END, () => {
  inputTextIndex = inputText.length;
});

export function isConsoleOpen(): boolean {
  return consoleOpen;
}
