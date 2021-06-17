// The "json" module can only be imported from a file at the root of the project,
// so use this helper as a workaround

import * as json from "json";
import log from "./log";

export function encode(table: unknown): string {
  const [ok, jsonStringOrErrMsg] = pcall(tryEncode, table);
  if (!ok) {
    error(`Failed to convert the Lua table to JSON: ${jsonStringOrErrMsg}`);
  }

  return jsonStringOrErrMsg;
}

function tryEncode(this: void, table: unknown) {
  return json.encode(table);
}

export function decode(jsonString: string): LuaTable {
  const [ok, luaTableOrErrMsg] = pcall(tryDecode, jsonString);
  if (!ok) {
    log(`Failed to convert the JSON string to a Lua table: ${jsonString}`);
    return new LuaTable();
  }

  return luaTableOrErrMsg as LuaTable;
}

function tryDecode(this: void, jsonString: string) {
  return json.decode(jsonString) as LuaTable;
}
