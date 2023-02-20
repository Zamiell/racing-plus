const STARTING_X = 115;
const STARTING_Y = 70;
const MAX_CHARACTERS_PER_LINE = 50;

export function drawErrorText(text: string): void {
  const x = STARTING_X;
  let y = STARTING_Y;

  text = `Error: ${text}`;

  for (const line of text.split("\n")) {
    const splitLines = getSplitLines(line);
    for (const splitLine of splitLines) {
      Isaac.RenderText(splitLine, x, y, 2, 2, 2, 2);
      y += 10;
    }
  }
}

function getSplitLines(line: string): string[] {
  let spaceLeft = MAX_CHARACTERS_PER_LINE;
  const words = line.split(" ");
  words.forEach((word, i) => {
    if (word.length + 1 > spaceLeft) {
      words[i] = `\n${word}`;
      spaceLeft = MAX_CHARACTERS_PER_LINE - word.length;
    } else {
      spaceLeft -= word.length + 1;
    }
  });

  return words.join(" ").split("\n");
}
