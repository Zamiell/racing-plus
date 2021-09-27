import { config } from "../../modConfigMenu";
import TextSegment from "../../types/TextSegment";
import { CONSOLE_POSITION, drawText } from "../optional/other/customConsole";

const CHAT_POSITION = CONSOLE_POSITION.add(Vector(0, -15));
const LINE_LENGTH = 13;

export function postRender(): void {
  if (!config.chat) {
    return;
  }

  const chatMessages: string[] = [];

  const x = CHAT_POSITION.X;
  let y = CHAT_POSITION.Y;

  for (const msg of chatMessages) {
    const text = `[00:36] <Zamiel> ${msg}`;

    const textSegments: TextSegment[] = [
      {
        text,
      },
    ];
    drawText(textSegments, Vector(x, y));

    y -= LINE_LENGTH;
  }
}
