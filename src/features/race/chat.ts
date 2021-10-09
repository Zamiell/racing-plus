// TODO don't display race chat from previous race
// TODO send all race chat history upon joining race

import g from "../../globals";
import { config } from "../../modConfigMenu";
import Colors from "../../types/Colors";
import TextSegment from "../../types/TextSegment";
import {
  CONSOLE_POSITION,
  DEFAULT_CONSOLE_OPACITY,
  drawText,
  isConsoleOpen,
} from "../optional/other/customConsole";

const CHAT_POSITION = CONSOLE_POSITION.add(Vector(0, -15));
const LINE_LENGTH = 13;
const MAX_CHAT_MESSAGES = 10;
const FADED_CHAT_OPACITY = 0.15;
const FRAMES_FOR_CHAT_TO_SHOW = 120;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.chat) {
    return;
  }

  drawChat();
}

function drawChat() {
  // If the console is open, display the last N messages with default opacity
  // Otherwise, only display recent messages,
  // and fade them so that they do not interfere with gameplay as much
  const isaacFrameCount = Isaac.GetFrameCount();
  const consoleOpen = isConsoleOpen();
  const alpha = consoleOpen ? DEFAULT_CONSOLE_OPACITY : FADED_CHAT_OPACITY;

  const x = CHAT_POSITION.X;
  let y = CHAT_POSITION.Y;

  let numMessagesDrawn = 0;
  for (const chatMessage of g.chatMessages) {
    // Make chat messages slowly fade away (if the console is closed)
    let modifiedAlpha = alpha;
    const framesElapsed = isaacFrameCount - chatMessage.frameReceived;
    if (!consoleOpen && framesElapsed > FRAMES_FOR_CHAT_TO_SHOW) {
      const framesOverThreshold = framesElapsed - FRAMES_FOR_CHAT_TO_SHOW;
      modifiedAlpha -= framesOverThreshold / (FRAMES_FOR_CHAT_TO_SHOW * 2);
    }
    if (modifiedAlpha <= 0) {
      break;
    }

    const textSegments: TextSegment[] = [
      {
        text: `[${chatMessage.time}] <`,
      },
      {
        text: chatMessage.username,
        color: Colors.GREEN,
      },
      {
        text: `> ${chatMessage.msg}`,
      },
    ];
    drawText(textSegments, Vector(x, y), modifiedAlpha);

    y -= LINE_LENGTH;

    numMessagesDrawn += 1;
    if (numMessagesDrawn > MAX_CHAT_MESSAGES) {
      break;
    }
  }
}
