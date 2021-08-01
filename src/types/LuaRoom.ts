export default interface LuaRoom {
  _attr: LuaRoomAttributes;
  door: LuaDoor[];
  spawn: LuaSpawn[];
}

interface LuaRoomAttributes {
  /** Needs to be converted to an int. */
  difficulty: string;
  /** Needs to be converted to an int. */
  height: string;
  name: string;
  /** Needs to be converted to an int. */
  shape: string;
  /** Needs to be converted to an int. */
  subtype: string;
  /** Needs to be converted to an int. */
  type: string;
  /** Needs to be converted to an int. */
  variant: string;
  /** Needs to be converted to a float. */
  weight: string;
  /** Needs to be converted to an int. */
  width: string;
}

interface LuaDoor {
  _attr: LuaDoorAttributes;
}

interface LuaDoorAttributes {
  /** "True" or "False" */
  exists: string;
  /** Needs to be converted to an int. */
  x: string;
  /** Needs to be converted to an int. */
  y: string;
}

export interface LuaSpawn {
  entity: LuaEntity;
  _attr: LuaSpawnAttributes;
}

interface LuaSpawnAttributes {
  /** Needs to be converted to an int. */
  x: string;
  /** Needs to be converted to an int. */
  y: string;
}

interface LuaEntity {
  _attr: LuaEntityAttributes;
}

interface LuaEntityAttributes {
  /** Needs to be converted to an int. */
  type: string;
  /** Needs to be converted to an int. */
  variant: string;
  /** Needs to be converted to an int. */
  subtype: string;
  /** Needs to be converted to a float. */
  weight: string;
}
