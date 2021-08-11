export default interface SeasonDescription {
  X: int;
  Y: int;
  charPositions: Array<[PlayerType, int, int]>;
  itemPositions?: Array<[CollectibleType, int, int]>;
  itemPositionsBig4?: Array<[CollectibleType, int, int]>;
  itemPositionsNormal?: Array<[CollectibleType, int, int]>;
  itemBans?: int;
  hidden?: boolean;
}
