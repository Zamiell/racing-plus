const GRID_ENTITY_MAP = new Map<int, [GridEntityType, int]>([
  [1000, [GridEntityType.GRID_ROCK, 0]],
  [1001, [GridEntityType.GRID_ROCK_BOMB, 0]],
  [1002, [GridEntityType.GRID_ROCK_ALT, 0]],
  [1008, [GridEntityType.GRID_ROCK_ALT2, 0]],
  [1010, [GridEntityType.GRID_ROCK_SPIKED, 0]],
  [1011, [GridEntityType.GRID_ROCK_GOLD, 0]],
  [1300, [GridEntityType.GRID_TNT, 0]],
  [1490, [GridEntityType.GRID_POOP, PoopVariant.RED]],
  [1494, [GridEntityType.GRID_POOP, PoopVariant.RAINBOW]],
  [1495, [GridEntityType.GRID_POOP, PoopVariant.CORN]],
  [1496, [GridEntityType.GRID_POOP, PoopVariant.GOLDEN]],
  [1497, [GridEntityType.GRID_POOP, PoopVariant.BLACK]],
  [1498, [GridEntityType.GRID_POOP, PoopVariant.WHITE]],
  [1499, [GridEntityType.GRID_POOP, PoopVariant.GIGA_TOP_LEFT]], // Does not work
  [1500, [GridEntityType.GRID_POOP, PoopVariant.NORMAL]],
  [1501, [GridEntityType.GRID_POOP, PoopVariant.CHARMING]],
  [1900, [GridEntityType.GRID_ROCKB, 0]],
  [1901, [GridEntityType.GRID_PILLAR, 0]],
  [1930, [GridEntityType.GRID_SPIKES, 0]],
  [1931, [GridEntityType.GRID_SPIKES_ONOFF, 0]],
  [1940, [GridEntityType.GRID_SPIDERWEB, 0]],
  [1999, [GridEntityType.GRID_WALL, 0]],
  [3000, [GridEntityType.GRID_PIT, 0]],
  // Pit events are bugged; there is no way to tell this apart from a normal pit once it is spawned
  // by the game
  // In this case, we implement them as a normal pit
  [3009, [GridEntityType.GRID_PIT, 0]],
  [4000, [GridEntityType.GRID_LOCK, 0]],
  [4500, [GridEntityType.GRID_PRESSURE_PLATE, 0]],
  [5000, [GridEntityType.GRID_STATUE, StatueVariant.DEVIL]],
  [5001, [GridEntityType.GRID_STATUE, StatueVariant.ANGEL]],
  [6100, [GridEntityType.GRID_TELEPORTER, 0]],
  [9000, [GridEntityType.GRID_TRAPDOOR, 0]],
  [9100, [GridEntityType.GRID_STAIRS, 0]],
  [10000, [GridEntityType.GRID_GRAVITY, 0]],
]);

export default function convertXMLGridEntityType(
  xmlGridEntityType: int,
  xmlGridEntityVariant: int,
): [int, int] | null {
  // Triggers are bugged; spawning one will immediately crash the game
  // In this case, just skip this grid square
  if (xmlGridEntityType === EntityType.ENTITY_TRIGGER_OUTPUT) {
    return null;
  }

  // Grid entity types/variants are represented in XML files as different numbers than what they are
  // in the real game, so we have to look up the real type/variant using a map
  const gridEntityArray = GRID_ENTITY_MAP.get(xmlGridEntityType);
  if (gridEntityArray === undefined) {
    error(
      `Failed to find an entry in the grid entity map for XML entity type: ${xmlGridEntityType}`,
    );
  }
  const gridEntityType = gridEntityArray[0];
  let gridEntityVariant = gridEntityArray[1];

  // For some specific grid entities, the variant defined in the XML is what is used by the actual
  // game (which is not the case for e.g. poops)
  if (
    gridEntityType === GridEntityType.GRID_SPIKES_ONOFF || // 9
    // gridEntityType === GridEntityType.GRID_PRESSURE_PLATE || // 20
    gridEntityType === GridEntityType.GRID_TELEPORTER // 23
  ) {
    gridEntityVariant = xmlGridEntityVariant;
  }

  return [gridEntityType, gridEntityVariant];
}
