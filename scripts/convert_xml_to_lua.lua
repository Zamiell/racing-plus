-- This script uses the xml2lua library
-- Use LuaRocks to install it
-- https://github.com/manoelcampos/xml2lua
local xml2lua = require("xml2lua")
local handler = require("xmlhandler.tree")

-- Constants
local ROOMS_DIRECTORY = "../mod/resources/rooms/pre-flipping/"
local LUA_DIRECTORY = "../src/luaRooms/"
local XML_FILES_TO_CONVERT = {
  "angelRooms",
  "devilRooms",
}

-- From: https://stackoverflow.com/questions/6075262
-- Modified in two major ways:
-- 1) remove all whitespace
-- 2) bugfix for table keys that are numbers
local function serializeTable(val, name)
  local tmp = ""

  local nameIsNumber = tonumber(name) ~= nil
  if name then
    if nameIsNumber then
      tmp = tmp .. "[" .. name .. "]" .. "="
    else
      tmp = tmp .. name .. "="
    end
  end

  local valType = type(val)
  if valType == "table" then
    tmp = tmp .. "{"

    for k, v in pairs(val) do
      tmp =  tmp .. serializeTable(v, k) .. ","
    end

    tmp = tmp .. "}"
  elseif valType == "number" then
    tmp = tmp .. tostring(val)
  elseif valType == "string" then
    tmp = tmp .. string.format("%q", val)
  elseif valType == "boolean" then
    tmp = tmp .. (val and "true" or "false")
  else
    error("Value types of \"" .. valType .. "\" are unsupported.")
  end

  return tmp
end

local function writeStringToFile(string, filePath)
  local f = assert(io.open(filePath, "w"))
  f:write(string)
  f:close()
end

local function main()
  for _, fileName in ipairs(XML_FILES_TO_CONVERT) do
    -- Load the XML file from disk into a string
    local fileNameXML = fileName .. ".xml"
    local filePathXML = ROOMS_DIRECTORY .. fileNameXML
    local xml = xml2lua.loadFile(filePathXML)

    -- Convert the XML string into a Lua table
    local localHandler = handler:new()
    local localParser = xml2lua.parser(localHandler)
    localParser:parse(xml)
    local roomsArray = localHandler.root.rooms

    -- Convert the Lua table to a string
    local tableString = serializeTable(roomsArray)

    -- Write the Lua table string to disk
    local fileString = "return " .. tableString
    local fileNameLua = fileName .. ".lua"
    local filePathLua = LUA_DIRECTORY .. fileNameLua
    writeStringToFile(fileString, filePathLua)
  end

  print("Success!")
end

main()
