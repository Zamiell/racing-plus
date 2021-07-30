import * as fastTravelPostGridEntityUpdate from "../features/optional/major/fastTravel/callbacks/postGridEntityUpdate";
import * as deleteVoidPortals from "../features/optional/quality/deleteVoidPortals";

const functionMap = new Map<GridEntityType, (gridEntity: GridEntity) => void>();
export default functionMap;

// 17
functionMap.set(GridEntityType.GRID_TRAPDOOR, (gridEntity: GridEntity) => {
  deleteVoidPortals.postGridEntityUpdateTrapdoor(gridEntity);
  fastTravelPostGridEntityUpdate.trapdoor(gridEntity);
});

// 18
functionMap.set(GridEntityType.GRID_STAIRS, (gridEntity: GridEntity) => {
  fastTravelPostGridEntityUpdate.crawlspace(gridEntity);
});
