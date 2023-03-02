import { ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { HexColors } from "../../../../enums/HexColors";
import {
  CONSOLE_POSITION,
  DEFAULT_CONSOLE_OPACITY,
  drawText,
  isConsoleOpen,
} from "../../../../features/race/customConsole";
import { inRace } from "../../../../features/race/v";
import { g } from "../../../../globals";
import { TextSegment } from "../../../../interfaces/TextSegment";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const CHAT_POSITION = CONSOLE_POSITION.add(Vector(0, -15));
const LINE_LENGTH = 13;
const MAX_CHAT_MESSAGES = 10;
const FADED_CHAT_OPACITY = 0.15;
const FRAMES_FOR_CHAT_TO_SHOW = 120;

/**
 * TODO:
 *  - Don't display race chat from the previous race.
 *  - Send all race chat history upon joining race.
 */
export class Chat extends ConfigurableModFeature {
  configKey: keyof Config = "Chat";

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.drawChat();
  }

  drawChat(): void {
    if (!inRace()) {
      return;
    }

    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // If the console is open, display the last N messages with default opacity. Otherwise, only
    // display recent messages, and fade them so that they do not interfere with gameplay as much.
    const renderFrameCount = Isaac.GetFrameCount();
    const consoleOpen = isConsoleOpen();
    const alpha = consoleOpen ? DEFAULT_CONSOLE_OPACITY : FADED_CHAT_OPACITY;

    const x = CHAT_POSITION.X;
    let y = CHAT_POSITION.Y;

    let numMessagesDrawn = 0;
    for (const chatMessage of g.chatMessages) {
      // Make chat messages slowly fade away (if the console is closed).
      let modifiedAlpha = alpha;
      const framesElapsed = renderFrameCount - chatMessage.renderFrameReceived;
      if (!consoleOpen && framesElapsed > FRAMES_FOR_CHAT_TO_SHOW) {
        const framesOverThreshold = framesElapsed - FRAMES_FOR_CHAT_TO_SHOW;
        modifiedAlpha -= framesOverThreshold / (FRAMES_FOR_CHAT_TO_SHOW * 2);
      }
      if (modifiedAlpha <= 0) {
        return;
      }

      const textSegments: TextSegment[] = [
        {
          text: `[${chatMessage.time}] <`,
        },
        {
          text: chatMessage.username,
          color: HexColors.GREEN,
        },
        {
          text: `> ${chatMessage.msg}`,
        },
      ];
      drawText(textSegments, Vector(x, y), modifiedAlpha);

      y -= LINE_LENGTH;

      numMessagesDrawn++;
      if (numMessagesDrawn > MAX_CHAT_MESSAGES) {
        return;
      }
    }
  }
}
