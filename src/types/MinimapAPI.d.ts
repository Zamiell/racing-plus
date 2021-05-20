declare const MinimapAPI: {
  Config: {
    Disable: boolean;
  };
  GetRoomByIdx(roomIndex: int): MinimapAPIRoomDescriptor;
};

declare interface MinimapAPIRoomDescriptor {
  Remove(): void;
  DisplayFlags: int;
}
