import * as fastTravelPostGridEntityInit from "../features/optional/major/fastTravel/callbacks/postGridEntityInit";

const functionMap = new Map<GridEntityType, (gridEntity: GridEntity) => void>();
export default functionMap;

// 17
functionMap.set(GridEntityType.GRID_TRAPDOOR, (gridEntity: GridEntity) => {
  fastTravelPostGridEntityInit.trapdoor(gridEntity);
});

// 18
functionMap.set(GridEntityType.GRID_STAIRS, (gridEntity: GridEntity) => {
  fastTravelPostGridEntityInit.crawlspace(gridEntity);
});
