export default interface SeasonDescription {
  X: int;
  Y: int;
  numChars: int;
  charPositions: Array<[PlayerType, int, int]>;
  hidden?: boolean;
}
