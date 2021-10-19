import { GRID_ENTITY_XML_MAP } from "isaacscript-common";

export default function convertXMLGridEntityType(
  xmlGridEntityType: int,
  xmlGridEntityVariant: int,
): [int, int] | undefined {
  // Triggers are bugged; spawning one will immediately crash the game
  // In this case, just skip this grid tile
  if (xmlGridEntityType === EntityType.ENTITY_TRIGGER_OUTPUT) {
    return undefined;
  }

  // Grid entity types/variants are represented in XML files as different numbers than what they are
  // in the real game, so we have to look up the real type/variant using a map
  const gridEntityArray = GRID_ENTITY_XML_MAP.get(xmlGridEntityType);
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
