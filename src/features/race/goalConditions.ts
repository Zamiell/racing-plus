import { getRoomIndex } from "isaacscript-common";
import g from "../../globals";

export function isValidMotherGoalRoom(): boolean {
  const roomIndex = getRoomIndex();
  return (
    roomIndex === GridRooms.ROOM_SECRET_EXIT_IDX ||
    roomIndex === GridRooms.ROOM_ERROR_IDX ||
    roomIndex === GridRooms.ROOM_BLACK_MARKET_IDX
  );
}

export function isValidBeastGoalRoom(): boolean {
  const roomType = g.r.GetType();
  return roomType === RoomType.ROOM_BOSS;
}
