--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]

local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file)
    if ____moduleCache[file] then
        return ____moduleCache[file]
    end
    if ____modules[file] then
        ____moduleCache[file] = ____modules[file]()
        return ____moduleCache[file]
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lualib_bundle"] = function() function __TS__ArrayIsArray(value)
    return (type(value) == "table") and ((value[1] ~= nil) or (next(value, nil) == nil))
end

function __TS__ArrayConcat(arr1, ...)
    local args = {...}
    local out = {}
    for ____, val in ipairs(arr1) do
        out[#out + 1] = val
    end
    for ____, arg in ipairs(args) do
        if __TS__ArrayIsArray(arg) then
            local argAsArray = arg
            for ____, val in ipairs(argAsArray) do
                out[#out + 1] = val
            end
        else
            out[#out + 1] = arg
        end
    end
    return out
end

function __TS__ArrayEntries(array)
    local key = 0
    return {
        [Symbol.iterator] = function(self)
            return self
        end,
        next = function(self)
            local result = {done = array[key + 1] == nil, value = {key, array[key + 1]}}
            key = key + 1
            return result
        end
    }
end

function __TS__ArrayEvery(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if not callbackfn(_G, arr[i + 1], i, arr) then
                return false
            end
            i = i + 1
        end
    end
    return true
end

function __TS__ArrayFilter(arr, callbackfn)
    local result = {}
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                result[#result + 1] = arr[i + 1]
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArrayForEach(arr, callbackFn)
    do
        local i = 0
        while i < #arr do
            callbackFn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
end

function __TS__ArrayFind(arr, predicate)
    local len = #arr
    local k = 0
    while k < len do
        local elem = arr[k + 1]
        if predicate(_G, elem, k, arr) then
            return elem
        end
        k = k + 1
    end
    return nil
end

function __TS__ArrayFindIndex(arr, callbackFn)
    do
        local i = 0
        local len = #arr
        while i < len do
            if callbackFn(_G, arr[i + 1], i, arr) then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayIncludes(self, searchElement, fromIndex)
    if fromIndex == nil then
        fromIndex = 0
    end
    local len = #self
    local k = fromIndex
    if fromIndex < 0 then
        k = len + fromIndex
    end
    if k < 0 then
        k = 0
    end
    for i = k, len do
        if self[i + 1] == searchElement then
            return true
        end
    end
    return false
end

function __TS__ArrayIndexOf(arr, searchElement, fromIndex)
    local len = #arr
    if len == 0 then
        return -1
    end
    local n = 0
    if fromIndex then
        n = fromIndex
    end
    if n >= len then
        return -1
    end
    local k
    if n >= 0 then
        k = n
    else
        k = len + n
        if k < 0 then
            k = 0
        end
    end
    do
        local i = k
        while i < len do
            if arr[i + 1] == searchElement then
                return i
            end
            i = i + 1
        end
    end
    return -1
end

function __TS__ArrayJoin(self, separator)
    if separator == nil then
        separator = ","
    end
    local result = ""
    for index, value in ipairs(self) do
        if index > 1 then
            result = tostring(result) .. tostring(separator)
        end
        result = tostring(result) .. tostring(
            tostring(value)
        )
    end
    return result
end

function __TS__ArrayMap(arr, callbackfn)
    local newArray = {}
    do
        local i = 0
        while i < #arr do
            newArray[i + 1] = callbackfn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
    return newArray
end

function __TS__ArrayPush(arr, ...)
    local items = {...}
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

function __TS__ArrayReduce(arr, callbackFn, ...)
    local len = #arr
    local k = 0
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[1]
        k = 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, len - 1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReduceRight(arr, callbackFn, ...)
    local len = #arr
    local k = len - 1
    local accumulator = nil
    if select("#", ...) ~= 0 then
        accumulator = select(1, ...)
    elseif len > 0 then
        accumulator = arr[k + 1]
        k = k - 1
    else
        error("Reduce of empty array with no initial value", 0)
    end
    for i = k, 0, -1 do
        accumulator = callbackFn(_G, accumulator, arr[i + 1], i, arr)
    end
    return accumulator
end

function __TS__ArrayReverse(arr)
    local i = 0
    local j = #arr - 1
    while i < j do
        local temp = arr[j + 1]
        arr[j + 1] = arr[i + 1]
        arr[i + 1] = temp
        i = i + 1
        j = j - 1
    end
    return arr
end

function __TS__ArrayShift(arr)
    return table.remove(arr, 1)
end

function __TS__ArrayUnshift(arr, ...)
    local items = {...}
    do
        local i = #items - 1
        while i >= 0 do
            table.insert(arr, 1, items[i + 1])
            i = i - 1
        end
    end
    return #arr
end

function __TS__ArraySort(arr, compareFn)
    if compareFn ~= nil then
        table.sort(
            arr,
            function(a, b) return compareFn(_G, a, b) < 0 end
        )
    else
        table.sort(arr)
    end
    return arr
end

function __TS__ArraySlice(list, first, last)
    local len = #list
    local relativeStart = first or 0
    local k
    if relativeStart < 0 then
        k = math.max(len + relativeStart, 0)
    else
        k = math.min(relativeStart, len)
    end
    local relativeEnd = last
    if last == nil then
        relativeEnd = len
    end
    local final
    if relativeEnd < 0 then
        final = math.max(len + relativeEnd, 0)
    else
        final = math.min(relativeEnd, len)
    end
    local out = {}
    local n = 0
    while k < final do
        out[n + 1] = list[k + 1]
        k = k + 1
        n = n + 1
    end
    return out
end

function __TS__ArraySome(arr, callbackfn)
    do
        local i = 0
        while i < #arr do
            if callbackfn(_G, arr[i + 1], i, arr) then
                return true
            end
            i = i + 1
        end
    end
    return false
end

function __TS__ArraySplice(list, ...)
    local len = #list
    local actualArgumentCount = select("#", ...)
    local start = select(1, ...)
    local deleteCount = select(2, ...)
    local actualStart
    if start < 0 then
        actualStart = math.max(len + start, 0)
    else
        actualStart = math.min(start, len)
    end
    local itemCount = math.max(actualArgumentCount - 2, 0)
    local actualDeleteCount
    if actualArgumentCount == 0 then
        actualDeleteCount = 0
    elseif actualArgumentCount == 1 then
        actualDeleteCount = len - actualStart
    else
        actualDeleteCount = math.min(
            math.max(deleteCount or 0, 0),
            len - actualStart
        )
    end
    local out = {}
    do
        local k = 0
        while k < actualDeleteCount do
            local from = actualStart + k
            if list[from + 1] then
                out[k + 1] = list[from + 1]
            end
            k = k + 1
        end
    end
    if itemCount < actualDeleteCount then
        do
            local k = actualStart
            while k < (len - actualDeleteCount) do
                local from = k + actualDeleteCount
                local to = k + itemCount
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k + 1
            end
        end
        do
            local k = len
            while k > ((len - actualDeleteCount) + itemCount) do
                list[k] = nil
                k = k - 1
            end
        end
    elseif itemCount > actualDeleteCount then
        do
            local k = len - actualDeleteCount
            while k > actualStart do
                local from = (k + actualDeleteCount) - 1
                local to = (k + itemCount) - 1
                if list[from + 1] then
                    list[to + 1] = list[from + 1]
                else
                    list[to + 1] = nil
                end
                k = k - 1
            end
        end
    end
    local j = actualStart
    for i = 3, actualArgumentCount do
        list[j + 1] = select(i, ...)
        j = j + 1
    end
    do
        local k = #list - 1
        while k >= ((len - actualDeleteCount) + itemCount) do
            list[k + 1] = nil
            k = k - 1
        end
    end
    return out
end

function __TS__ArrayToObject(array)
    local object = {}
    do
        local i = 0
        while i < #array do
            object[i] = array[i + 1]
            i = i + 1
        end
    end
    return object
end

function __TS__ArrayFlat(array, depth)
    if depth == nil then
        depth = 1
    end
    local result = {}
    for ____, value in ipairs(array) do
        if (depth > 0) and __TS__ArrayIsArray(value) then
            result = __TS__ArrayConcat(
                result,
                __TS__ArrayFlat(value, depth - 1)
            )
        else
            result[#result + 1] = value
        end
    end
    return result
end

function __TS__ArrayFlatMap(array, callback)
    local result = {}
    do
        local i = 0
        while i < #array do
            local value = callback(_G, array[i + 1], i, array)
            if (type(value) == "table") and __TS__ArrayIsArray(value) then
                result = __TS__ArrayConcat(result, value)
            else
                result[#result + 1] = value
            end
            i = i + 1
        end
    end
    return result
end

function __TS__ArraySetLength(arr, length)
    if (((length < 0) or (length ~= length)) or (length == math.huge)) or (math.floor(length) ~= length) then
        error(
            "invalid array length: " .. tostring(length),
            0
        )
    end
    do
        local i = #arr - 1
        while i >= length do
            arr[i + 1] = nil
            i = i - 1
        end
    end
    return length
end

function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

function __TS__CloneDescriptor(____bindingPattern0)
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    local configurable
    configurable = ____bindingPattern0.configurable
    local get
    get = ____bindingPattern0.get
    local set
    set = ____bindingPattern0.set
    local writable
    writable = ____bindingPattern0.writable
    local value
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = (get ~= nil) or (set ~= nil)
    local hasValueOrWritableAttribute = (writable ~= nil) or (value ~= nil)
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

function __TS__Decorate(decorators, target, key, desc)
    local result = target
    do
        local i = #decorators
        while i >= 0 do
            local decorator = decorators[i + 1]
            if decorator then
                local oldResult = result
                if key == nil then
                    result = decorator(_G, result)
                elseif desc == true then
                    local value = rawget(target, key)
                    local descriptor = __TS__ObjectGetOwnPropertyDescriptor(target, key) or ({configurable = true, writable = true, value = value})
                    local desc = decorator(_G, target, key, descriptor) or descriptor
                    local isSimpleValue = (((desc.configurable == true) and (desc.writable == true)) and (not desc.get)) and (not desc.set)
                    if isSimpleValue then
                        rawset(target, key, desc.value)
                    else
                        __TS__SetDescriptor(
                            target,
                            key,
                            __TS__ObjectAssign({}, descriptor, desc)
                        )
                    end
                elseif desc == false then
                    result = decorator(_G, target, key, desc)
                else
                    result = decorator(_G, target, key)
                end
                result = result or oldResult
            end
            i = i - 1
        end
    end
    return result
end

function __TS__DecorateParam(paramIndex, decorator)
    return function(____, target, key) return decorator(_G, target, key, paramIndex) end
end

function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. ".",
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    if target[key] ~= nil then
        target[key] = nil
        return true
    end
    return false
end

function __TS__DelegatedYield(iterable)
    if type(iterable) == "string" then
        for index = 0, #iterable - 1 do
            coroutine.yield(
                __TS__StringAccess(iterable, index)
            )
        end
    elseif iterable.____coroutine ~= nil then
        local co = iterable.____coroutine
        while true do
            local status, value = coroutine.resume(co)
            if not status then
                error(value, 0)
            end
            if coroutine.status(co) == "dead" then
                return value
            else
                coroutine.yield(value)
            end
        end
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                return result.value
            else
                coroutine.yield(result.value)
            end
        end
    else
        for ____, value in ipairs(iterable) do
            coroutine.yield(value)
        end
    end
end

function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

function __TS__GetErrorStack(self, constructor)
    local level = 1
    while true do
        local info = debug.getinfo(level, "f")
        level = level + 1
        if not info then
            level = 1
            break
        elseif info.func == constructor then
            break
        end
    end
    return debug.traceback(nil, level)
end
function __TS__WrapErrorToString(self, getDescription)
    return function(self)
        local description = getDescription(self)
        local caller = debug.getinfo(3, "f")
        if (_VERSION == "Lua 5.1") or (caller and (caller.func ~= error)) then
            return description
        else
            return (tostring(description) .. "\n") .. self.stack
        end
    end
end
function __TS__InitErrorClass(self, Type, name)
    Type.name = name
    return setmetatable(
        Type,
        {
            __call = function(____, _self, message) return __TS__New(Type, message) end
        }
    )
end
Error = __TS__InitErrorClass(
    _G,
    (function()
        local ____ = __TS__Class()
        ____.name = ""
        function ____.prototype.____constructor(self, message)
            if message == nil then
                message = ""
            end
            self.message = message
            self.name = "Error"
            self.stack = __TS__GetErrorStack(_G, self.constructor.new)
            local metatable = getmetatable(self)
            if not metatable.__errorToStringPatched then
                metatable.__errorToStringPatched = true
                metatable.__tostring = __TS__WrapErrorToString(_G, metatable.__tostring)
            end
        end
        function ____.prototype.__tostring(self)
            return (((self.message ~= "") and (function() return (self.name .. ": ") .. self.message end)) or (function() return self.name end))()
        end
        return ____
    end)(),
    "Error"
)
for ____, errorName in ipairs({"RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"}) do
    _G[errorName] = __TS__InitErrorClass(
        _G,
        (function()
            local ____ = __TS__Class()
            ____.name = ____.name
            __TS__ClassExtends(____, Error)
            function ____.prototype.____constructor(self, ...)
                Error.prototype.____constructor(self, ...)
                self.name = errorName
            end
            return ____
        end)(),
        errorName
    )
end

__TS__Unpack = table.unpack or unpack

function __TS__FunctionBind(fn, thisArg, ...)
    local boundArgs = {...}
    return function(____, ...)
        local args = {...}
        do
            local i = 0
            while i < #boundArgs do
                table.insert(args, i + 1, boundArgs[i + 1])
                i = i + 1
            end
        end
        return fn(
            thisArg,
            __TS__Unpack(args)
        )
    end
end

____symbolMetatable = {
    __tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end
}
function __TS__Symbol(description)
    return setmetatable({description = description}, ____symbolMetatable)
end
Symbol = {
    iterator = __TS__Symbol("Symbol.iterator"),
    hasInstance = __TS__Symbol("Symbol.hasInstance"),
    species = __TS__Symbol("Symbol.species"),
    toStringTag = __TS__Symbol("Symbol.toStringTag")
}

function __TS__GeneratorIterator(self)
    return self
end
function __TS__GeneratorNext(self, ...)
    local co = self.____coroutine
    if coroutine.status(co) == "dead" then
        return {done = true}
    end
    local status, value = coroutine.resume(co, ...)
    if not status then
        error(value, 0)
    end
    return {
        value = value,
        done = coroutine.status(co) == "dead"
    }
end
function __TS__Generator(fn)
    return function(...)
        local args = {...}
        local argsLength = select("#", ...)
        return {
            ____coroutine = coroutine.create(
                function() return fn(
                    (unpack or table.unpack)(args, 1, argsLength)
                ) end
            ),
            [Symbol.iterator] = __TS__GeneratorIterator,
            next = __TS__GeneratorNext
        }
    end
end

function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not (not classTbl[Symbol.hasInstance](classTbl, obj))
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

function __TS__InstanceOfObject(value)
    local valueType = type(value)
    return (valueType == "table") or (valueType == "function")
end

function __TS__IteratorGeneratorStep(self)
    local co = self.____coroutine
    local status, value = coroutine.resume(co)
    if not status then
        error(value, 0)
    end
    if coroutine.status(co) == "dead" then
        return
    end
    return true, value
end
function __TS__IteratorIteratorStep(self)
    local result = self:next()
    if result.done then
        return
    end
    return true, result.value
end
function __TS__IteratorStringStep(self, index)
    index = index + 1
    if index > #self then
        return
    end
    return index, string.sub(self, index, index)
end
function __TS__Iterator(iterable)
    if type(iterable) == "string" then
        return __TS__IteratorStringStep, iterable, 0
    elseif iterable.____coroutine ~= nil then
        return __TS__IteratorGeneratorStep, iterable
    elseif iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        return __TS__IteratorIteratorStep, iterator
    else
        return __TS__Unpack(
            {
                ipairs(iterable)
            }
        )
    end
end

Map = (function()
    local Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return (self.nextKey[key] ~= nil) or (self.lastKey == key)
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local ____ = self
        local items = ____.items
        local nextKey = ____.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local ____ = self
        local items = ____.items
        local nextKey = ____.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
    return Map
end)()

__TS__MathAtan2 = math.atan2 or math.atan

function __TS__Number(value)
    local valueType = type(value)
    if valueType == "number" then
        return value
    elseif valueType == "string" then
        local numberValue = tonumber(value)
        if numberValue then
            return numberValue
        end
        if value == "Infinity" then
            return math.huge
        end
        if value == "-Infinity" then
            return -math.huge
        end
        local stringWithoutSpaces = string.gsub(value, "%s", "")
        if stringWithoutSpaces == "" then
            return 0
        end
        return 0 / 0
    elseif valueType == "boolean" then
        return (value and 1) or 0
    else
        return 0 / 0
    end
end

function __TS__NumberIsFinite(value)
    return (((type(value) == "number") and (value == value)) and (value ~= math.huge)) and (value ~= -math.huge)
end

function __TS__NumberIsNaN(value)
    return value ~= value
end

____radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
function __TS__NumberToString(self, radix)
    if ((((radix == nil) or (radix == 10)) or (self == math.huge)) or (self == -math.huge)) or (self ~= self) then
        return tostring(self)
    end
    radix = math.floor(radix)
    if (radix < 2) or (radix > 36) then
        error("toString() radix argument must be between 2 and 36", 0)
    end
    local integer, fraction = math.modf(
        math.abs(self)
    )
    local result = ""
    if radix == 8 then
        result = string.format("%o", integer)
    elseif radix == 16 then
        result = string.format("%x", integer)
    else
        repeat
            do
                result = tostring(
                    __TS__StringAccess(____radixChars, integer % radix)
                ) .. tostring(result)
                integer = math.floor(integer / radix)
            end
        until not (integer ~= 0)
    end
    if fraction ~= 0 then
        result = tostring(result) .. "."
        local delta = 1e-16
        repeat
            do
                fraction = fraction * radix
                delta = delta * radix
                local digit = math.floor(fraction)
                result = tostring(result) .. tostring(
                    __TS__StringAccess(____radixChars, digit)
                )
                fraction = fraction - digit
            end
        until not (fraction >= delta)
    end
    if self < 0 then
        result = "-" .. tostring(result)
    end
    return result
end

function __TS__ObjectAssign(to, ...)
    local sources = {...}
    if to == nil then
        return to
    end
    for ____, source in ipairs(sources) do
        for key in pairs(source) do
            to[key] = source[key]
        end
    end
    return to
end

function ____descriptorIndex(self, key)
    local value = rawget(self, key)
    if value ~= nil then
        return value
    end
    local metatable = getmetatable(self)
    while metatable do
        local rawResult = rawget(metatable, key)
        if rawResult ~= nil then
            return rawResult
        end
        local descriptors = rawget(metatable, "_descriptors")
        if descriptors then
            local descriptor = descriptors[key]
            if descriptor then
                if descriptor.get then
                    return descriptor.get(self)
                end
                return descriptor.value
            end
        end
        metatable = getmetatable(metatable)
    end
end
function ____descriptorNewindex(self, key, value)
    local metatable = getmetatable(self)
    while metatable do
        local descriptors = rawget(metatable, "_descriptors")
        if descriptors then
            local descriptor = descriptors[key]
            if descriptor then
                if descriptor.set then
                    descriptor.set(self, value)
                else
                    if descriptor.writable == false then
                        error(
                            ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                            0
                        )
                    end
                    descriptor.value = value
                end
                return
            end
        end
        metatable = getmetatable(metatable)
    end
    rawset(self, key, value)
end
function __TS__SetDescriptor(target, key, desc, isPrototype)
    if isPrototype == nil then
        isPrototype = false
    end
    local metatable = ((isPrototype and (function() return target end)) or (function() return getmetatable(target) end))()
    if not metatable then
        metatable = {}
        setmetatable(target, metatable)
    end
    local value = rawget(target, key)
    if value ~= nil then
        rawset(target, key, nil)
    end
    if not rawget(metatable, "_descriptors") then
        metatable._descriptors = {}
    end
    local descriptor = __TS__CloneDescriptor(desc)
    metatable._descriptors[key] = descriptor
    metatable.__index = ____descriptorIndex
    metatable.__newindex = ____descriptorNewindex
end

function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = (((type(key) == "number") and (function() return key + 1 end)) or (function() return key end))()
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = (desc.get ~= nil) or (desc.set ~= nil)
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        descriptor = {
            set = desc.set,
            get = desc.get,
            configurable = (((desc.configurable ~= nil) and (function() return desc.configurable end)) or (function() return valueExists end))(),
            enumerable = (((desc.enumerable ~= nil) and (function() return desc.enumerable end)) or (function() return valueExists end))(),
            writable = (((desc.writable ~= nil) and (function() return desc.writable end)) or (function() return valueExists end))(),
            value = (((desc.value ~= nil) and (function() return desc.value end)) or (function() return value end))()
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

function __TS__ObjectEntries(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = {key, obj[key]}
    end
    return result
end

function __TS__ObjectFromEntries(entries)
    local obj = {}
    local iterable = entries
    if iterable[Symbol.iterator] then
        local iterator = iterable[Symbol.iterator](iterable)
        while true do
            local result = iterator:next()
            if result.done then
                break
            end
            local value = result.value
            obj[value[1]] = value[2]
        end
    else
        for ____, entry in ipairs(entries) do
            obj[entry[1]] = entry[2]
        end
    end
    return obj
end

function __TS__ObjectGetOwnPropertyDescriptor(object, key)
    local metatable = getmetatable(object)
    if not metatable then
        return
    end
    if not rawget(metatable, "_descriptors") then
        return
    end
    return rawget(metatable, "_descriptors")[key]
end

function __TS__ObjectKeys(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = key
    end
    return result
end

function __TS__ObjectRest(target, usedProperties)
    local result = {}
    for property in pairs(target) do
        if not usedProperties[property] then
            result[property] = target[property]
        end
    end
    return result
end

function __TS__ObjectValues(obj)
    local result = {}
    for key in pairs(obj) do
        result[#result + 1] = obj[key]
    end
    return result
end

function __TS__OptionalChainAccess(____table, key)
    if ____table then
        return ____table[key]
    end
    return nil
end

function __TS__OptionalFunctionCall(f, ...)
    if f then
        return f(...)
    end
    return nil
end

function __TS__OptionalMethodCall(____table, methodName, ...)
    local args = {...}
    if ____table then
        local method = ____table[methodName]
        if method then
            return method(
                ____table,
                __TS__Unpack(args)
            )
        end
    end
    return nil
end

function __TS__ParseFloat(numberString)
    local infinityMatch = string.match(numberString, "^%s*(-?Infinity)")
    if infinityMatch then
        return (((__TS__StringAccess(infinityMatch, 0) == "-") and (function() return -math.huge end)) or (function() return math.huge end))()
    end
    local number = tonumber(
        string.match(numberString, "^%s*(-?%d+%.?%d*)")
    )
    return number or (0 / 0)
end

__TS__parseInt_base_pattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
function __TS__ParseInt(numberString, base)
    if base == nil then
        base = 10
        local hexMatch = string.match(numberString, "^%s*-?0[xX]")
        if hexMatch then
            base = 16
            numberString = ((string.match(hexMatch, "-") and (function() return "-" .. tostring(
                __TS__StringSubstr(numberString, #hexMatch)
            ) end)) or (function() return __TS__StringSubstr(numberString, #hexMatch) end))()
        end
    end
    if (base < 2) or (base > 36) then
        return 0 / 0
    end
    local allowedDigits = (((base <= 10) and (function() return __TS__StringSubstring(__TS__parseInt_base_pattern, 0, base) end)) or (function() return __TS__StringSubstr(__TS__parseInt_base_pattern, 0, 10 + (2 * (base - 10))) end))()
    local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
    local number = tonumber(
        string.match(numberString, pattern),
        base
    )
    if number == nil then
        return 0 / 0
    end
    if number >= 0 then
        return math.floor(number)
    else
        return math.ceil(number)
    end
end

Set = (function()
    local Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next and previous then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(
            self:keys()
        ) do
            callback(_G, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return (self.nextKey[value] ~= nil) or (self.lastKey == value)
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    Set[Symbol.species] = Set
    return Set
end)()

WeakMap = (function()
    local WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
    return WeakMap
end)()

WeakSet = (function()
    local WeakSet = __TS__Class()
    WeakSet.name = "WeakSet"
    function WeakSet.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "WeakSet"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self.items[result.value] = true
            end
        else
            for ____, value in ipairs(values) do
                self.items[value] = true
            end
        end
    end
    function WeakSet.prototype.add(self, value)
        self.items[value] = true
        return self
    end
    function WeakSet.prototype.delete(self, value)
        local contains = self:has(value)
        self.items[value] = nil
        return contains
    end
    function WeakSet.prototype.has(self, value)
        return self.items[value] == true
    end
    WeakSet[Symbol.species] = WeakSet
    return WeakSet
end)()

function __TS__SourceMapTraceBack(fileName, sourceMap)
    _G.__TS__sourcemap = _G.__TS__sourcemap or ({})
    _G.__TS__sourcemap[fileName] = sourceMap
    if _G.__TS__originalTraceback == nil then
        _G.__TS__originalTraceback = debug.traceback
        debug.traceback = function(thread, message, level)
            local trace
            if ((thread == nil) and (message == nil)) and (level == nil) then
                trace = _G.__TS__originalTraceback()
            else
                trace = _G.__TS__originalTraceback(thread, message, level)
            end
            if type(trace) ~= "string" then
                return trace
            end
            local result = string.gsub(
                trace,
                "(%S+).lua:(%d+)",
                function(file, line)
                    local fileSourceMap = _G.__TS__sourcemap[tostring(file) .. ".lua"]
                    if fileSourceMap and fileSourceMap[line] then
                        return (file .. ".ts:") .. tostring(fileSourceMap[line])
                    end
                    return (file .. ".lua:") .. line
                end
            )
            return result
        end
    end
end

function __TS__Spread(iterable)
    local arr = {}
    if type(iterable) == "string" then
        do
            local i = 0
            while i < #iterable do
                arr[#arr + 1] = __TS__StringAccess(iterable, i)
                i = i + 1
            end
        end
    else
        for ____, item in __TS__Iterator(iterable) do
            arr[#arr + 1] = item
        end
    end
    return __TS__Unpack(arr)
end

function __TS__StringAccess(self, index)
    if (index >= 0) and (index < #self) then
        return string.sub(self, index + 1, index + 1)
    end
end

function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or (0 / 0)
end

function __TS__StringConcat(str1, ...)
    local args = {...}
    local out = str1
    for ____, arg in ipairs(args) do
        out = tostring(out) .. tostring(arg)
    end
    return out
end

function __TS__StringEndsWith(self, searchString, endPosition)
    if (endPosition == nil) or (endPosition > #self) then
        endPosition = #self
    end
    return string.sub(self, (endPosition - #searchString) + 1, endPosition) == searchString
end

function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

function __TS__StringPadEnd(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(self) .. tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    )
end

function __TS__StringPadStart(self, maxLength, fillString)
    if fillString == nil then
        fillString = " "
    end
    if maxLength ~= maxLength then
        maxLength = 0
    end
    if (maxLength == -math.huge) or (maxLength == math.huge) then
        error("Invalid string length", 0)
    end
    if (#self >= maxLength) or (#fillString == 0) then
        return self
    end
    maxLength = maxLength - #self
    if maxLength > #fillString then
        fillString = tostring(fillString) .. tostring(
            string.rep(
                fillString,
                math.floor(maxLength / #fillString)
            )
        )
    end
    return tostring(
        string.sub(
            fillString,
            1,
            math.floor(maxLength)
        )
    ) .. tostring(self)
end

function __TS__StringReplace(source, searchValue, replaceValue)
    searchValue = string.gsub(searchValue, "[%%%(%)%.%+%-%*%?%[%^%$]", "%%%1")
    if type(replaceValue) == "string" then
        replaceValue = string.gsub(replaceValue, "%%", "%%%%")
        local result = string.gsub(source, searchValue, replaceValue, 1)
        return result
    else
        local result = string.gsub(
            source,
            searchValue,
            function(match) return replaceValue(_G, match) end,
            1
        )
        return result
    end
end

function __TS__StringSlice(self, start, ____end)
    if (start == nil) or (start ~= start) then
        start = 0
    end
    if ____end ~= ____end then
        ____end = 0
    end
    if start >= 0 then
        start = start + 1
    end
    if (____end ~= nil) and (____end < 0) then
        ____end = ____end - 1
    end
    return string.sub(self, start, ____end)
end

function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if (____end ~= nil) and (start > ____end) then
        start, ____end = __TS__Unpack({____end, start})
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if (____end ~= nil) and (____end < 0) then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

function __TS__StringSplit(source, separator, limit)
    if limit == nil then
        limit = 4294967295
    end
    if limit == 0 then
        return {}
    end
    local out = {}
    local index = 0
    local count = 0
    if (separator == nil) or (separator == "") then
        while (index < (#source - 1)) and (count < limit) do
            out[count + 1] = __TS__StringAccess(source, index)
            count = count + 1
            index = index + 1
        end
    else
        local separatorLength = #separator
        local nextIndex = (string.find(source, separator, nil, true) or 0) - 1
        while (nextIndex >= 0) and (count < limit) do
            out[count + 1] = __TS__StringSubstring(source, index, nextIndex)
            count = count + 1
            index = nextIndex + separatorLength
            nextIndex = (string.find(
                source,
                separator,
                math.max(index + 1, 1),
                true
            ) or 0) - 1
        end
    end
    if count < limit then
        out[count + 1] = __TS__StringSubstring(source, index)
    end
    return out
end

function __TS__StringStartsWith(self, searchString, position)
    if (position == nil) or (position < 0) then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if (length ~= length) or (length <= 0) then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

function __TS__StringTrimEnd(self)
    local result = string.gsub(self, "[%s ﻿]*$", "")
    return result
end

function __TS__StringTrimStart(self)
    local result = string.gsub(self, "^[%s ﻿]*", "")
    return result
end

____symbolRegistry = {}
function __TS__SymbolRegistryFor(key)
    if not ____symbolRegistry[key] then
        ____symbolRegistry[key] = __TS__Symbol(key)
    end
    return ____symbolRegistry[key]
end
function __TS__SymbolRegistryKeyFor(sym)
    for key in pairs(____symbolRegistry) do
        if ____symbolRegistry[key] == sym then
            return key
        end
    end
end

function __TS__TypeOf(value)
    local luaType = type(value)
    if luaType == "table" then
        return "object"
    elseif luaType == "nil" then
        return "undefined"
    else
        return luaType
    end
end

 end,
["features.race.types.RaceData"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local RaceData = ____exports.default
    RaceData.name = "RaceData"
    function RaceData.prototype.____constructor(self)
        self.raceID = -1
        self.status = "none"
        self.myStatus = "not ready"
        self.ranked = false
        self.solo = false
        self.format = "unseeded"
        self.difficulty = "normal"
        self.character = PlayerType.PLAYER_JUDAS
        self.goal = "Blue Baby"
        self.seed = "-"
        self.startingItems = {}
        self.countdown = -1
        self.placeMid = 0
        self.place = -1
        self.numReady = 0
        self.numEntrants = 1
    end
    return RaceData
end)()
function ____exports.cloneRaceData(self, raceData)
    local copiedRaceData = __TS__ObjectAssign({}, raceData)
    copiedRaceData.startingItems = {
        table.unpack(raceData.startingItems)
    }
    return copiedRaceData
end
return ____exports
 end,
["features.race.types.RaceVars"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local RaceVars = ____exports.default
    RaceVars.name = "RaceVars"
    function RaceVars.prototype.____constructor(self)
        self.started = false
        self.startedTime = -1
        self.startedFrame = -1
        self.finished = false
        self.finishedTime = -1
        self.finishedFrames = -1
    end
    return RaceVars
end)()
return ____exports
 end,
["features.speedrun.enums"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local SEASON_1_NAME = "R+7 (Season 1)"
local CHANGE_CHAR_ORDER_NAME = "Change Char Order"
____exports.ChallengeCustom = ChallengeCustom or ({})
____exports.ChallengeCustom.SEASON_1 = Isaac.GetChallengeIdByName(SEASON_1_NAME)
____exports.ChallengeCustom[____exports.ChallengeCustom.SEASON_1] = "SEASON_1"
____exports.ChallengeCustom.CHANGE_CHAR_ORDER = Isaac.GetChallengeIdByName(CHANGE_CHAR_ORDER_NAME)
____exports.ChallengeCustom[____exports.ChallengeCustom.CHANGE_CHAR_ORDER] = "CHANGE_CHAR_ORDER"
return ____exports
 end,
["features.speedrun.types.SpeedrunData"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local SpeedrunData = ____exports.default
    SpeedrunData.name = "SpeedrunData"
    function SpeedrunData.prototype.____constructor(self)
        self.characterNum = 1
        self.characterOrder = {}
        self.fastReset = false
        self.startedTime = -1
        self.startedFrame = -1
        self.finished = false
        self.finishedTime = -1
        self.finishedFrames = -1
        self.startedCharTime = -1
        self.characterRunTimes = {}
    end
    return SpeedrunData
end)()
return ____exports
 end,
["log"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
function ____exports.default(self, msg)
    Isaac.DebugString(msg)
end
return ____exports
 end,
["types.Config"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local Config = ____exports.default
    Config.name = "Config"
    function Config.prototype.____constructor(self)
        self.clientCommunication = true
        self.startWithD6 = true
        self.disableCurses = true
        self.freeDevilItem = true
        self.fastReset = true
        self.fastClear = true
        self.fastTravel = true
        self.judasAddBomb = true
        self.samsonDropHeart = true
        self.taintedKeeperMoney = true
        self.showEdenStartingItems = true
        self.fadeBosses = true
        self.stopDeathSlow = true
        self.fastHaunt = true
        self.fastSatan = true
        self.replaceCodWorms = true
        self.disableInvulnerability = true
        self.fastGhosts = true
        self.fastHands = true
        self.appearHands = true
        self.globinSoftlock = true
        self.speedUpFadeIn = true
        self.easyFirstFloorItems = true
        self.changeCreepColor = true
        self.subvertTeleport = true
        self.deleteVoidPortals = true
        self.showNumSacrifices = true
        self.showDreamCatcherItem = true
        self.fadeVasculitisTears = true
        self.showPills = true
        self.showMaxFamiliars = true
        self.openHushDoor = true
        self.removeFortuneCookieBanners = true
        self.fastTeleports = true
        self.teleportInvalidEntrance = true
        self.flyItemSprites = true
        self.twentyTwenty = true
        self.starOfBethlehem = true
        self.paschalCandle = true
        self.silenceMomDad = true
        self.customConsole = true
    end
    return Config
end)()
return ____exports
 end,
["types.enums"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.EntityTypeCustom = EntityTypeCustom or ({})
____exports.EntityTypeCustom.ENTITY_RACE_TROPHY = Isaac.GetEntityTypeByName("Race Trophy")
____exports.EntityTypeCustom[____exports.EntityTypeCustom.ENTITY_RACE_TROPHY] = "ENTITY_RACE_TROPHY"
____exports.EffectVariantCustom = EffectVariantCustom or ({})
____exports.EffectVariantCustom.PITFALL_CUSTOM = Isaac.GetEntityVariantByName("Pitfall (Custom)")
____exports.EffectVariantCustom[____exports.EffectVariantCustom.PITFALL_CUSTOM] = "PITFALL_CUSTOM"
____exports.CollectibleTypeCustom = CollectibleTypeCustom or ({})
____exports.CollectibleTypeCustom.COLLECTIBLE_13_LUCK = Isaac.GetItemIdByName("13 Luck")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_13_LUCK] = "COLLECTIBLE_13_LUCK"
____exports.CollectibleTypeCustom.COLLECTIBLE_15_LUCK = Isaac.GetItemIdByName("15 Luck")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_15_LUCK] = "COLLECTIBLE_15_LUCK"
____exports.CollectibleTypeCustom.COLLECTIBLE_TROPHY = Isaac.GetItemIdByName("Trophy")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_TROPHY] = "COLLECTIBLE_TROPHY"
____exports.CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT] = "COLLECTIBLE_CHECKPOINT"
____exports.CollectibleTypeCustom.COLLECTIBLE_OFF_LIMITS = Isaac.GetItemIdByName("Off Limits")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_OFF_LIMITS] = "COLLECTIBLE_OFF_LIMITS"
____exports.CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1 = Isaac.GetItemIdByName("Diversity Placeholder 1")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1] = "COLLECTIBLE_DIVERSITY_PLACEHOLDER_1"
____exports.CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2 = Isaac.GetItemIdByName("Diversity Placeholder 2")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2] = "COLLECTIBLE_DIVERSITY_PLACEHOLDER_2"
____exports.CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3 = Isaac.GetItemIdByName("Diversity Placeholder 3")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3] = "COLLECTIBLE_DIVERSITY_PLACEHOLDER_3"
____exports.CollectibleTypeCustom.COLLECTIBLE_DEBUG = Isaac.GetItemIdByName("Debug")
____exports.CollectibleTypeCustom[____exports.CollectibleTypeCustom.COLLECTIBLE_DEBUG] = "COLLECTIBLE_DEBUG"
____exports.PickupPriceCustom = PickupPriceCustom or ({})
____exports.PickupPriceCustom.PRICE_NO_MINIMAP = -50
____exports.PickupPriceCustom[____exports.PickupPriceCustom.PRICE_NO_MINIMAP] = "PRICE_NO_MINIMAP"
____exports.EffectSubTypeCustom = EffectSubTypeCustom or ({})
____exports.EffectSubTypeCustom.FLOOR_EFFECT_CREEP = 12345
____exports.EffectSubTypeCustom[____exports.EffectSubTypeCustom.FLOOR_EFFECT_CREEP] = "FLOOR_EFFECT_CREEP"
____exports.SoundEffectCustom = SoundEffectCustom or ({})
____exports.SoundEffectCustom.SOUND_SPEEDRUN_FINISH = Isaac.GetSoundIdByName("Speedrun Finish")
____exports.SoundEffectCustom[____exports.SoundEffectCustom.SOUND_SPEEDRUN_FINISH] = "SOUND_SPEEDRUN_FINISH"
____exports.SaveFileState = SaveFileState or ({})
____exports.SaveFileState.NotChecked = 0
____exports.SaveFileState[____exports.SaveFileState.NotChecked] = "NotChecked"
____exports.SaveFileState.DeferredUntilNewRunBegins = 1
____exports.SaveFileState[____exports.SaveFileState.DeferredUntilNewRunBegins] = "DeferredUntilNewRunBegins"
____exports.SaveFileState.GoingToSetSeedWithEden = 2
____exports.SaveFileState[____exports.SaveFileState.GoingToSetSeedWithEden] = "GoingToSetSeedWithEden"
____exports.SaveFileState.GoingBack = 3
____exports.SaveFileState[____exports.SaveFileState.GoingBack] = "GoingBack"
____exports.SaveFileState.Finished = 4
____exports.SaveFileState[____exports.SaveFileState.Finished] = "Finished"
return ____exports
 end,
["features.optional.major.fastTravel.enums"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.FastTravelEntityType = FastTravelEntityType or ({})
____exports.FastTravelEntityType.Trapdoor = 0
____exports.FastTravelEntityType[____exports.FastTravelEntityType.Trapdoor] = "Trapdoor"
____exports.FastTravelEntityType.Crawlspace = 1
____exports.FastTravelEntityType[____exports.FastTravelEntityType.Crawlspace] = "Crawlspace"
____exports.FastTravelEntityType.HeavenDoor = 2
____exports.FastTravelEntityType[____exports.FastTravelEntityType.HeavenDoor] = "HeavenDoor"
____exports.FastTravelState = FastTravelState or ({})
____exports.FastTravelState.Disabled = 0
____exports.FastTravelState[____exports.FastTravelState.Disabled] = "Disabled"
____exports.FastTravelState.FadingToBlack = 1
____exports.FastTravelState[____exports.FastTravelState.FadingToBlack] = "FadingToBlack"
____exports.FastTravelState.ChangingToSameRoom = 2
____exports.FastTravelState[____exports.FastTravelState.ChangingToSameRoom] = "ChangingToSameRoom"
____exports.FastTravelState.GoingToNewFloor = 3
____exports.FastTravelState[____exports.FastTravelState.GoingToNewFloor] = "GoingToNewFloor"
____exports.FastTravelState.FadingIn = 4
____exports.FastTravelState[____exports.FastTravelState.FadingIn] = "FadingIn"
____exports.FastTravelEntityState = FastTravelEntityState or ({})
____exports.FastTravelEntityState.Open = 0
____exports.FastTravelEntityState[____exports.FastTravelEntityState.Open] = "Open"
____exports.FastTravelEntityState.Closed = 1
____exports.FastTravelEntityState[____exports.FastTravelEntityState.Closed] = "Closed"
return ____exports
 end,
["features.race.types.SeededDeathState"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local SeededDeathState = SeededDeathState or ({})
SeededDeathState.Disabled = 0
SeededDeathState[SeededDeathState.Disabled] = "Disabled"
SeededDeathState.DeathAnimation = 1
SeededDeathState[SeededDeathState.DeathAnimation] = "DeathAnimation"
SeededDeathState.ChangingRooms = 2
SeededDeathState[SeededDeathState.ChangingRooms] = "ChangingRooms"
SeededDeathState.FetalPosition = 3
SeededDeathState[SeededDeathState.FetalPosition] = "FetalPosition"
SeededDeathState.GhostForm = 4
SeededDeathState[SeededDeathState.GhostForm] = "GhostForm"
____exports.default = SeededDeathState
return ____exports
 end,
["features.optional.quality.showDreamCatcherItem.enums"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.WarpState = WarpState or ({})
____exports.WarpState.Initial = 0
____exports.WarpState[____exports.WarpState.Initial] = "Initial"
____exports.WarpState.Warping = 1
____exports.WarpState[____exports.WarpState.Warping] = "Warping"
____exports.WarpState.RepositioningPlayer = 2
____exports.WarpState[____exports.WarpState.RepositioningPlayer] = "RepositioningPlayer"
____exports.WarpState.Finished = 3
____exports.WarpState[____exports.WarpState.Finished] = "Finished"
return ____exports
 end,
["types.EntityLocation"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["types.GlobalsRunLevel"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____enums = require("features.optional.quality.showDreamCatcherItem.enums")
local WarpState = ____enums.WarpState
____exports.default = (function()
    ____exports.default = __TS__Class()
    local GlobalsRunLevel = ____exports.default
    GlobalsRunLevel.name = "GlobalsRunLevel"
    function GlobalsRunLevel.prototype.____constructor(self, stage, stageType)
        self.dreamCatcher = {items = {}, bosses = {}, dreamCatcherSprite = nil, itemSprites = {}, bossSprites = {}, warpState = WarpState.Initial}
        self.fastTravel = {tookDamage = false, blackMarket = false, previousRoomIndex = nil, subvertedRoomTransitionDirection = Direction.NO_DIRECTION}
        self.numSacrifices = 0
        self.trophy = nil
        self.stage = stage
        self.stageType = stageType
    end
    return GlobalsRunLevel
end)()
return ____exports
 end,
["features.optional.major.fastTravel.constants"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.TRAPDOOR_OPEN_DISTANCE = 60
____exports.TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS = ____exports.TRAPDOOR_OPEN_DISTANCE * 2.5
____exports.TRAPDOOR_BOSS_REACTION_FRAMES = 30
____exports.TRAPDOOR_TOUCH_DISTANCE = 16.5
____exports.FADE_TO_BLACK_FRAMES = 40
____exports.FAMES_BEFORE_JUMP = 13
return ____exports
 end,
["types.GlobalsRunRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local GlobalsRunRoom = ____exports.default
    GlobalsRunRoom.name = "GlobalsRunRoom"
    function GlobalsRunRoom.prototype.____constructor(self, clear)
        self.clearFrame = -1
        self.fastTravel = {trapdoors = {}, crawlspaces = {}, heavenDoors = {}, amChangingRooms = false}
        self.showEndOfRunText = false
        self.clear = clear
    end
    return GlobalsRunRoom
end)()
return ____exports
 end,
["types.PickingUpItemDescription"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["types.PillDescription"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["types.GlobalsRun"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelState = ____enums.FastTravelState
local ____SeededDeathState = require("features.race.types.SeededDeathState")
local SeededDeathState = ____SeededDeathState.default
local ____log = require("log")
local log = ____log.default
local ____GlobalsRunLevel = require("types.GlobalsRunLevel")
local GlobalsRunLevel = ____GlobalsRunLevel.default
local ____GlobalsRunRoom = require("types.GlobalsRunRoom")
local GlobalsRunRoom = ____GlobalsRunRoom.default
function ____exports.initPlayerVariables(self, player, run)
    local character = player:GetPlayerType()
    local index = ____exports.getPlayerLuaTableIndex(nil, player)
    run.currentCharacters[index] = character
    run.fastClear.paschalCandleCounters[index] = 1
    run.freeDevilItem.tookDamage[index] = false
    run.pickingUpItem[index] = {id = CollectibleType.COLLECTIBLE_NULL, type = ItemType.ITEM_NULL, roomIndex = -1}
    run.pocketActiveD6Charge[index] = 6
    local transformationArray = {}
    do
        local i = 0
        while i < PlayerForm.NUM_PLAYER_FORMS do
            __TS__ArrayPush(transformationArray, false)
            i = i + 1
        end
    end
    run.transformations[index] = transformationArray
    log(nil, "Initialized variables for player: " .. index)
end
function ____exports.getPlayerLuaTableIndex(self, player)
    return tostring(
        player:GetCollectibleRNG(1):GetSeed()
    )
end
____exports.default = (function()
    ____exports.default = __TS__Class()
    local GlobalsRun = ____exports.default
    GlobalsRun.name = "GlobalsRun"
    function GlobalsRun.prototype.____constructor(self, players)
        self.level = __TS__New(GlobalsRunLevel, 0, 0)
        self.forceNextLevel = false
        self.room = __TS__New(GlobalsRunRoom, true)
        self.forceNextRoom = false
        self.currentCharacters = {}
        self.debugChaosCard = false
        self.debugSpeed = false
        self.edenStartingItems = {active = 0, passive = 0, activeSprite = nil, passiveSprite = nil}
        self.fastClear = {aliveEnemies = {}, aliveEnemiesCount = 0, aliveBossesCount = 0, buttonsAllPushed = false, roomInitializing = false, delayFrame = 0, vanillaPhotosSpawning = false, deferClearForGhost = false, paschalCandleCounters = {}}
        self.fastResetFrame = 0
        self.fastTravel = {state = FastTravelState.Disabled, framesPassed = 0, playerIndexTouchedTrapdoor = -1, upwards = false, blueWomb = false, theVoid = false, antibirthSecretExit = false, reseed = false}
        self.fireworksSpawned = 0
        self.flippedAtLeastOnce = false
        self.freeDevilItem = {tookDamage = {}, granted = false}
        self.maxFamiliars = false
        self.pickingUpItem = {}
        self.pills = {}
        self.pillsPHD = false
        self.pillsFalsePHD = false
        self.pocketActiveD6Charge = {}
        self.removeMoreOptions = false
        self.restart = false
        self.roomsEntered = 0
        self.seededDeath = {state = SeededDeathState.Disabled}
        self.seededDrops = {roomClearAwardSeed = 0, roomClearAwardSeedDevilAngel = 0}
        self.slideAnimationHappening = false
        self.spedUpFadeIn = false
        self.startedTime = 0
        self.streakText = {text = "", tabText = "", frame = 0}
        self.switchForgotten = false
        self.transformations = {}
        self.victoryLaps = 0
        for ____, player in ipairs(players) do
            ____exports.initPlayerVariables(nil, player, self)
        end
    end
    return GlobalsRun
end)()
return ____exports
 end,
["types.Hotkeys"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.default = (function()
    ____exports.default = __TS__Class()
    local Hotkeys = ____exports.default
    Hotkeys.name = "Hotkeys"
    function Hotkeys.prototype.____constructor(self)
        self.fastDropAllKeyboard = -1
        self.fastDropAllController = -1
        self.fastDropTrinketsKeyboard = -1
        self.fastDropTrinketsController = -1
        self.fastDropPocketKeyboard = -1
        self.fastDropPocketController = -1
    end
    return Hotkeys
end)()
return ____exports
 end,
["types.SocketClient"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["types.Sandbox"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["types.Globals"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____RaceData = require("features.race.types.RaceData")
local RaceData = ____RaceData.default
local ____RaceVars = require("features.race.types.RaceVars")
local RaceVars = ____RaceVars.default
local ____SpeedrunData = require("features.speedrun.types.SpeedrunData")
local SpeedrunData = ____SpeedrunData.default
local ____log = require("log")
local log = ____log.default
local ____Config = require("types.Config")
local Config = ____Config.default
local ____enums = require("types.enums")
local SaveFileState = ____enums.SaveFileState
local ____GlobalsRun = require("types.GlobalsRun")
local GlobalsRun = ____GlobalsRun.default
local ____Hotkeys = require("types.Hotkeys")
local Hotkeys = ____Hotkeys.default
____exports.default = (function()
    ____exports.default = __TS__Class()
    local Globals = ____exports.default
    Globals.name = "Globals"
    function Globals.prototype.____constructor(self)
        self.debug = false
        self.corrupted = false
        self.g = Game()
        self.l = Game():GetLevel()
        self.r = Game():GetRoom()
        self.seeds = Game():GetSeeds()
        self.itemPool = Game():GetItemPool()
        self.itemConfig = Isaac.GetItemConfig()
        self.sfx = SFXManager()
        self.music = MusicManager()
        self.font = Font()
        self.config = __TS__New(Config)
        self.hotkeys = __TS__New(Hotkeys)
        self.run = __TS__New(GlobalsRun, {})
        self.race = __TS__New(RaceData)
        self.raceVars = __TS__New(RaceVars)
        self.speedrun = __TS__New(SpeedrunData)
        self.sandbox = nil
        self.saveFile = {state = SaveFileState.NotChecked, fullyUnlocked = false, oldRun = {challenge = 0, character = 0, seededRun = false, seed = ""}}
        self.socket = {enabled = false, client = nil, connectionAttemptFrame = 0}
        self.font:Load("font/droid.fnt")
        self:checkEnableSocket()
    end
    function Globals.prototype.checkEnableSocket(self)
        local ok, requiredSandbox = pcall(require, "sandbox")
        if not ok then
            log(nil, "Did not detect the sandbox environment.")
            return
        end
        self.sandbox = requiredSandbox
        if not self.sandbox:isSocketInitialized() then
            self.sandbox = nil
            log(nil, "Detected sandbox environment, but the socket library failed to load. (The \"--luadebug\" flag is probably turned off.)")
            return
        end
        log(nil, "Detected sandbox environment.")
        self.socket.enabled = true
    end
    return Globals
end)()
return ____exports
 end,
["globals"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____Globals = require("types.Globals")
local Globals = ____Globals.default
local globals = __TS__New(Globals)
____exports.default = globals
RacingPlusGlobals = globals
g = globals
return ____exports
 end,
["cache"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.updateAPIFunctions(self)
    g.l = g.g:GetLevel()
    g.r = g.g:GetRoom()
    g.seeds = g.g:GetSeeds()
    g.itemPool = g.g:GetItemPool()
end
return ____exports
 end,
["cardMap"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local CARD_MAP = __TS__New(Map, {{"fool", 1}, {"magician", 2}, {"magi", 2}, {"mag", 2}, {"high priestess", 3}, {"highpriestess", 3}, {"high", 3}, {"priestess", 3}, {"priest", 3}, {"hp", 3}, {"empress", 4}, {"emperor", 5}, {"emp", 5}, {"hierophant", 6}, {"hiero", 6}, {"lovers", 7}, {"chariot", 8}, {"justice", 9}, {"hermit", 10}, {"wheel of fortune", 11}, {"wheeloffortune", 11}, {"wheel", 11}, {"fortune", 11}, {"strength", 12}, {"str", 12}, {"hanged man", 13}, {"hangedman", 13}, {"hanged", 13}, {"death", 14}, {"temperance", 15}, {"devil", 16}, {"tower", 17}, {"stars", 18}, {"moon", 19}, {"sun", 20}, {"judgement", 21}, {"judge", 21}, {"world", 22}, {"2 of clubs", 23}, {"2ofclubs", 23}, {"2clubs", 23}, {"2 of diamonds", 24}, {"2ofdiamonds", 24}, {"2diamonds", 24}, {"2 of spades", 25}, {"2ofspades", 25}, {"2spades", 25}, {"2 of hearts", 26}, {"2ofhearts", 26}, {"2hearts", 26}, {"ace of clubs", 27}, {"aceofclubs", 27}, {"aceclubs", 27}, {"ace of diamonds", 28}, {"aceofdiamonds", 28}, {"acediamonds", 28}, {"ace of spades", 29}, {"aceofspades", 29}, {"acespades", 29}, {"ace of hearts", 30}, {"aceofhearts", 30}, {"acehearts", 30}, {"joker", 31}, {"hagalaz", 32}, {"destruction", 32}, {"jera", 33}, {"abundance", 33}, {"ehwaz", 34}, {"passage", 34}, {"dagaz", 35}, {"purity", 35}, {"ansuz", 36}, {"vision", 36}, {"perthro", 37}, {"change", 37}, {"berkano", 38}, {"companionship", 38}, {"algiz", 39}, {"resistance", 39}, {"shield", 39}, {"blank", 40}, {"black", 41}, {"chaos", 42}, {"credit", 43}, {"rules", 44}, {"against humanity", 45}, {"againsthumanity", 45}, {"humanity", 45}, {"suicide king", 46}, {"suicideking", 46}, {"suicide", 46}, {"get out of jail free", 47}, {"getoutofjailfree", 47}, {"get out of jail", 47}, {"getoutofjail", 47}, {"get out", 47}, {"getout", 47}, {"jail", 47}, {"?", 48}, {"dice shard", 49}, {"diceshard", 49}, {"dice", 49}, {"shard", 49}, {"emergency contact", 50}, {"emergencycontact", 50}, {"emergency", 50}, {"contact", 50}, {"holy", 51}, {"huge growth", 52}, {"hugegrowth", 52}, {"growth", 52}, {"ancient recall", 53}, {"ancientrecall", 53}, {"ancient", 53}, {"recall", 53}, {"era walk", 54}, {"erawalk", 54}, {"era", 54}, {"walk", 54}, {"rune shard", 55}, {"runeshard", 55}, {"shard", 55}, {"fool?", 56}, {"fool2", 56}, {"magician?", 57}, {"magician2", 57}, {"magi?", 57}, {"magi2", 57}, {"mag?", 57}, {"mag2", 57}, {"high priestess?", 58}, {"high priestess2", 58}, {"highpriestess?", 58}, {"highpriestess2", 58}, {"high?", 58}, {"high2", 58}, {"priestess?", 58}, {"priestess2", 58}, {"priest?", 58}, {"priest2", 58}, {"hp?", 58}, {"hp2", 58}, {"empress?", 59}, {"empress2", 59}, {"emperor?", 60}, {"emperor2", 60}, {"emp?", 60}, {"emp2", 60}, {"hierophant?", 61}, {"hierophant2", 61}, {"hiero?", 61}, {"hiero2", 61}, {"lovers?", 62}, {"lovers2", 62}, {"chariot?", 63}, {"chariot2", 63}, {"justice?", 64}, {"justice2", 64}, {"hermit?", 65}, {"hermit2", 65}, {"wheel of fortune?", 66}, {"wheel of fortune2", 66}, {"wheeloffortune?", 66}, {"wheeloffortune2", 66}, {"wheel?", 66}, {"wheel2", 66}, {"fortune?", 66}, {"fortune2", 66}, {"strength?", 67}, {"strength2", 67}, {"str?", 67}, {"str2", 67}, {"hanged man?", 68}, {"hanged man2", 68}, {"hangedman?", 68}, {"hangedman2", 68}, {"hanged?", 68}, {"hanged2", 68}, {"death?", 69}, {"death2", 69}, {"temperance?", 70}, {"temperance2", 70}, {"devil?", 71}, {"devil2", 71}, {"tower?", 72}, {"tower2", 72}, {"stars?", 73}, {"stars2", 73}, {"moon?", 74}, {"moon2", 74}, {"sun?", 75}, {"sun2", 75}, {"judgement?", 76}, {"judgement2", 76}, {"judge?", 76}, {"judge2", 76}, {"world?", 77}, {"world2", 77}, {"cracked key", 78}, {"crackedkey", 78}, {"cracked", 78}, {"key", 78}, {"queen of hearts", 79}, {"queenofhearts", 79}, {"queen hearts", 79}, {"queenhearts", 79}, {"queen", 79}, {"wild card", 80}, {"wildcard", 80}, {"wild", 80}, {"soul of isaac", 81}, {"soulofisaac", 81}, {"soulisaac", 81}, {"isaac", 81}, {"soul of magdalene", 82}, {"soulofmagdalene", 82}, {"soulmagdalene", 82}, {"magdalene", 82}, {"soul of cain", 83}, {"soulofcain", 83}, {"soulcain", 83}, {"cain", 83}, {"soul of judas", 84}, {"soulofjudas", 84}, {"souljudas", 84}, {"judas", 84}, {"soul of ???", 85}, {"soulof???", 85}, {"soul???", 85}, {"???", 85}, {"soul of blue baby", 85}, {"soulofbluebaby", 85}, {"soulbluebaby", 85}, {"blue baby", 85}, {"bluebaby", 85}, {"soul of eve", 86}, {"soulofeve", 86}, {"souleve", 86}, {"eve", 86}, {"soul of samson", 87}, {"soulofsamson", 87}, {"soulsamson", 87}, {"samson", 87}, {"soul of azazel", 88}, {"soulofazazel", 88}, {"soulazazel", 88}, {"azazel", 88}, {"soul of lazarus", 89}, {"souloflazarus", 89}, {"soullazarus", 89}, {"lazarus", 89}, {"soul of eden", 90}, {"soulofeden", 90}, {"souleden", 90}, {"eden", 90}, {"soul of the lost", 91}, {"soulofthelost", 91}, {"souloflost", 91}, {"soullost", 91}, {"the lost", 91}, {"thelost", 91}, {"lost", 91}, {"soul of lilith", 92}, {"souloflilith", 92}, {"soullilith", 92}, {"lilith", 92}, {"soul of the keeper", 93}, {"soulofthekeeper", 93}, {"soulofkeeper", 93}, {"soulkeeper", 93}, {"keeper", 93}, {"soul of apollyon", 94}, {"soulofapollyon", 94}, {"soulapollyon", 94}, {"apollyon", 94}, {"soul of the forgotten", 95}, {"souloftheforgotten", 95}, {"soulofforgotten", 95}, {"soulforgotten", 95}, {"forgotten", 95}, {"soul of bethany", 96}, {"soulofbethany", 96}, {"soulbethany", 96}, {"bethany", 96}, {"soul of jacob and esau", 97}, {"soul of jacob & esau", 97}, {"soul of jacob", 97}, {"soulofjacobandesau", 97}, {"soulofjacob&esau", 97}, {"soulofjacob", 97}, {"souljacobandesau", 97}, {"souljacob&esau", 97}, {"souljacob", 97}, {"jacobandesau", 97}, {"jacob&esau", 97}, {"jacob", 97}})
____exports.default = CARD_MAP
return ____exports
 end,
["characterMap"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local CHARACTER_MAP = __TS__New(Map, {{"isaac", 0}, {"magdalene", 1}, {"maggy", 1}, {"cain", 2}, {"judas", 3}, {"blue baby", 4}, {"bluebaby", 4}, {"bb", 4}, {"eve", 5}, {"samson", 6}, {"azazel", 7}, {"lazarus", 8}, {"laz", 8}, {"eden", 9}, {"the lost", 10}, {"thelost", 10}, {"lost", 10}, {"lazarus2", 11}, {"laz2", 11}, {"dark judas", 12}, {"darkjudas", 12}, {"black judas", 12}, {"blackjudas", 12}, {"lilith", 13}, {"keeper", 14}, {"apollyon", 15}, {"the forgotten", 16}, {"theforgotten", 16}, {"forgotten", 16}, {"the soul", 17}, {"thesoul", 17}, {"soul", 17}, {"bethany", 18}, {"jacob", 19}, {"esau", 20}, {"isaac2", 21}, {"tisaac", 21}, {"magdalene2", 22}, {"maggy2", 22}, {"tmagdalene", 22}, {"tmaggy", 22}, {"cain2", 23}, {"tcain", 23}, {"judas2", 24}, {"tjudas", 24}, {"bluebaby2", 25}, {"tbluebaby", 25}, {"bb2", 25}, {"tbb", 25}, {"eve2", 26}, {"teve", 26}, {"samson2", 27}, {"tsamson", 27}, {"azazel2", 28}, {"tazazel", 28}, {"lazarus2", 29}, {"tlazarus", 29}, {"tlaz", 29}, {"eden2", 30}, {"teden", 30}, {"lost2", 31}, {"tlost", 31}, {"lilith2", 32}, {"tlilith", 32}, {"keeper2", 33}, {"tkeeper", 33}, {"apollyon2", 34}, {"tapollyon", 34}, {"forgotten2", 35}, {"tforgotten", 35}, {"bethany2", 36}, {"tbethany", 36}, {"jacob2", 37}, {"tjacob", 37}})
____exports.default = CHARACTER_MAP
return ____exports
 end,
["configDescription"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.MAJOR_CHANGES = {{"clientCommunication", {4, "000", "Enable client support", "Allow the mod to talk with the Racing+ client. You can disable this if you are not using the client to very slightly reduce lag."}}, {"startWithD6", {4, "001", "Start with the D6", "Makes each character start with a D6 or a pocket D6."}}, {"disableCurses", {4, "002", "Disable curses", "Disables all curses, like Curse of the Maze."}}, {nil, {1, "", "Customized Devil/Angel Rooms", "Improves the quality and variety of Devil Rooms & Angel Rooms. This cannot be disabled because it affects the STB files."}}, {"freeDevilItem", {4, "003", "Free devil item", "Awards a Your Soul trinket upon entering the Basement 2 Devil Room if you have not taken damage."}}, {"fastReset", {4, "004", "Fast reset", "Instantaneously restart the game as soon as you press the R key."}}, {"fastClear", {4, "005", "Fast room clear", "Makes doors open at the beginning of the death animation instead of at the end."}}, {"fastTravel", {4, "006", "Fast floor travel", "Replace the fade-in and fade-out with a custom animation where you jump out of a hole. Also, replace the crawlspace animation."}}, {nil, {1, "", "Room fixes", "Fixes various softlocks and bugs. This cannot be disabled because it affects the STB files."}}, {nil, {1, "", "Room flipping", "To increase run variety, all rooms have a chance to be flipped on the X axis, Y axis, or both axes."}}}
____exports.CUSTOM_HOTKEYS = {{"fastDropAllKeyboard", {6, "", "Fast drop", "Drop all of your items instantaneously."}}, {"fastDropAllController", {7, "", "Fast drop", "Drop all of your items instantaneously."}}, {"fastDropTrinketsKeyboard", {6, "", "Fast drop (pocket)", "Drop your pocket items instantaneously."}}, {"fastDropTrinketsController", {7, "", "Fast drop (trinkets)", "Drop your trinkets instantaneously."}}, {"fastDropPocketKeyboard", {6, "", "Fast drop (pocket)", "Drop your pocket items instantaneously."}}, {"fastDropPocketController", {7, "", "Fast drop (pocket)", "Drop your pocket items instantaneously."}}}
____exports.CHARACTER_CHANGES = {{"judasAddBomb", {4, "021", "Add a bomb to Judas", "Makes Judas start with 1 bomb instead of 0 bombs."}}, {"samsonDropHeart", {4, "022", "Make Samson drop his trinket", "Makes Samson automatically drop his Child's Heart trinket at the beginning of a run."}}, {"taintedKeeperMoney", {4, "023", "Tainted Keeper extra money", "Make Tainted Keeper start with 15 cents. This gives him enough money to start a Treasure Room item."}}, {"showEdenStartingItems", {4, "024", "Show Eden's starting items", "Draw both of Eden's starting items on the screen while in the first room."}}}
____exports.BOSS_CHANGES = {{"fadeBosses", {4, "031", "Fade dead bosses", "Make bosses faded during their death animation so that you can see the dropped item."}}, {"stopDeathSlow", {4, "034", "Stop Death's slow attack", "Stop Death from performing the attack that reduces your speed by a factor of 2."}}, {"fastHaunt", {4, "032", "Fast The Haunt", "Some animations in The Haunt fight are sped up."}}, {"fastSatan", {4, "033", "Fast Satan", "All of the waiting during the Satan Fight is removed."}}}
____exports.ENEMY_CHANGES = {{"replaceCodWorms", {4, "041", "Replace Cod Worms", "Cod Worms are replaced with Para-Bites."}}, {"disableInvulnerability", {4, "042", "Disable invulnerability", "Wizoobs, Red Ghosts, and Lil' Haunts no longer have invulnerability frames after spawning."}}, {"fastGhosts", {4, "043", "Fast ghosts", "Wizoobs and Red Ghosts have faster attack patterns."}}, {"fastHands", {4, "044", "Fast hands", "Mom's Hands and Mom's Dead Hands have faster attack patterns."}}, {"appearHands", {4, "045", "Reveal hands", "Mom's Hands and Mom's Dead Hands will play an \"Appear\" animation."}}, {"globinSoftlock", {4, "046", "Fix Globin softlocks", "Make Globins permanently die on the 4th regeneration to prevent Epic Fetus softlocks."}}}
____exports.QUALITY_OF_LIFE_CHANGES_1 = {{nil, {1, "", "Start in the center", "On a new run, start in the center of the room (instead of at the bottom)."}}, {"speedUpFadeIn", {4, "051", "Speed-up new run fade-ins", "Speed-up the fade-in that occurs at the beginning of a new run."}}, {"easyFirstFloorItems", {4, "052", "Easier first floor items", "Slightly change first floor Treasure Rooms so that you never have to spend a bomb or walk on spikes."}}, {"changeCreepColor", {4, "053", "Consistent creep color", "Change enemy red creep to green and change friendly green creep to red."}}, {"subvertTeleport", {4, "054", "Subvert disruptive teleports", "Stop the disruptive teleport that happens when entering a room with Gurdy, Mom, Mom's Heart, or It Lives!"}}, {"deleteVoidPortals", {4, "055", "Delete Void portals", "Automatically delete the Void portals that spawn after bosses."}}, {"showNumSacrifices", {4, "056", "Show the number of sacrifices", "Show the number of sacrifices in the top-left when in a Sacrifice Room."}}, {"showDreamCatcherItem", {4, "057", "Show the Dream Catcher item", "If you have Dream Catcher, draw the Treasure Room item while in the starting room of the floor."}}, {"fadeVasculitisTears", {4, "058", "Fade Vasculitis tears", "Fade the tears that explode out of enemies when you have Vasculitis."}}, {"showPills", {4, "059", "Remember pills", "Hold the map button to see a list of identified pills for easy reference."}}}
____exports.QUALITY_OF_LIFE_CHANGES_2 = {{"showMaxFamiliars", {4, "060", "Show max familiars", "Show an icon on the UI when you have the maximum amount of familiars (i.e. 64)."}}, {"openHushDoor", {4, "061", "Open the Hush door", "Automatically open the big door to Hush when you arrive on the Blue womb."}}, {"removeFortuneCookieBanners", {4, "062", "Remove Fortune Cookie banners", "Remove Fortune Cookie banners when don't get any pickups."}}}
____exports.GAMEPLAY_CHANGES = {{nil, {1, "", "Remove Mercurius", "It is incredibly powerful and not very skill-based. This cannot be disabled for seeding reasons."}}, {nil, {1, "", "Remove Karma trinket", "Since all Donation Machines are removed, it has no effect. This cannot be disabled for seeding reasons."}}, {nil, {1, "", "Remove Amnesia and ??? pills", "Since curses are automatically removed, these pills have no effect. This cannot be disabled for seeding reasons."}}}
____exports.CUTSCENE_CHANGES = {{nil, {1, "", "Remove intro cutscene", "Remove the intro cutscene so that you go straight to the main menu upon launching the game."}}, {nil, {1, "", "Remove ending cutscenes", "Remove the cutscenes that play upon completing a run."}}, {nil, {1, "", "Remove boss cutscenes", "Remove the cutscenes that play upon entering a boss room."}}, {nil, {1, "", "Remove \"giantbook\" animations", "Remove all \"giantbook\" style animations (with the exception of Book of Revelations, Satanic Bible, eternal hearts, and rainbow poop)."}}, {"fastTeleports", {4, "071", "Fast teleports", "Teleport animations are sped up by a factor of 2."}}, {nil, {1, "", "Remove pausing/unpausing animations", "Pause and unpause the game instantaneously."}}}
____exports.BUG_FIXES = {{"teleportInvalidEntrance", {4, "081", "Fix bad teleports", "Never teleport to a non-existent entrance."}}, {nil, {1, "", "Fix shop Restock Machines", "Restock Machines are supposed to appear 25% of the time, but this does not happen in vanilla."}}, {nil, {1, "", "Fix Duality not giving both rooms", "Many boss rooms that only have 2 possible doors have been adjusted to have 3 doors."}}, {nil, {1, "", "Fix Black Market entrances", "Entering a Black Market will no longer send you to the I AM ERROR room. (This is a bug introduced in v820.)"}}, {nil, {1, "", "Fix crawlspace exits", "Returning from a crawlspace outside of the grid will no longer send you to the wrong room. (This is part of Fast-Travel.)"}}, {nil, {1, "", "Fix I AM ERROR exits", "Exits in an I AM ERROR room will be blocked if the room is not clear. (This is part of Fast-Travel.)"}}}
____exports.GRAPHIC_CHANGES = {{"flyItemSprites", {4, "091", "Fix fly colors", "Make the Distant Admiration, Forever Alone, and Friend Zone sprites match the color of the familiars."}}, {"twentyTwenty", {4, "092", "Better 20/20", "Make the 20/20 sprite easier to see."}}, {"starOfBethlehem", {4, "093", "Better Star of Bethlehem", "Make the Star of Bethlehem sprite more distinct from Eden's Soul."}}, {nil, {1, "", "Fix Locust of Famine", "Make the Locust of Famine sprite match the color of the flies."}}, {nil, {1, "", "Fix Error", "Make the Error trinket sprite have an outline."}}, {"paschalCandle", {4, "094", "Better Paschal Candle", "Paschal Candle now \"fills up\" so that you can easily tell at a glance if it is maxed out."}}, {nil, {1, "", "Consistent pill orientation", "Pills now have a consistent orientation on the ground."}}, {nil, {1, "", "Better pill colors", "The color of some pills are changed to make them easier to identify at a glance."}}, {nil, {1, "", "Better Purity colors", "The colors of some Purity auras have been changed to make them easier to see. Speed is now green and range is now yellow."}}, {nil, {1, "", "Speedrunning controls graphic", "The controls graphic in the start room is changed to be speedrunning-themed."}}}
____exports.SOUND_CHANGES = {{"silenceMomDad", {4, "101", "Silence mom & dad", "The audio clips of mom and dad on the Ascent are silenced."}}}
____exports.OTHER_FEATURES = {{"customConsole", {4, "111", "Enable the custom console", "Press enter to bring up a custom console that is better than the vanilla console. (not finished yet)"}}}
____exports.ALL_CONFIG_DESCRIPTIONS = {
    table.unpack(
        __TS__ArrayConcat(
            {
                table.unpack(____exports.MAJOR_CHANGES)
            },
            {
                table.unpack(____exports.CHARACTER_CHANGES)
            },
            {
                table.unpack(____exports.BOSS_CHANGES)
            },
            {
                table.unpack(____exports.ENEMY_CHANGES)
            },
            {
                table.unpack(____exports.QUALITY_OF_LIFE_CHANGES_1)
            },
            {
                table.unpack(____exports.QUALITY_OF_LIFE_CHANGES_2)
            },
            {
                table.unpack(____exports.GAMEPLAY_CHANGES)
            },
            {
                table.unpack(____exports.CUTSCENE_CHANGES)
            },
            {
                table.unpack(____exports.BUG_FIXES)
            },
            {
                table.unpack(____exports.GRAPHIC_CHANGES)
            },
            {
                table.unpack(____exports.SOUND_CHANGES)
            },
            {
                table.unpack(____exports.OTHER_FEATURES)
            }
        )
    )
}
____exports.ALL_HOTKEY_DESCRIPTIONS = {
    table.unpack(____exports.CUSTOM_HOTKEYS)
}
return ____exports
 end,
["constants"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.COLLECTIBLE_SPRITE_LAYER = 1
____exports.EXCLUDED_CHARACTERS = {PlayerType.PLAYER_ESAU, PlayerType.PLAYER_THESOUL_B}
____exports.KCOLOR_DEFAULT = KColor(1, 1, 1, 1)
____exports.MAX_NUM_DOORS = 8
____exports.RECOMMENDED_SHIFT_IDX = 35
____exports.SPRITE_CHALLENGE_OFFSET = Vector(-3, 0)
____exports.SPRITE_DIFFICULTY_OFFSET = Vector(13, 0)
____exports.SPRITE_BETHANY_OFFSET = Vector(0, 8)
____exports.SPRITE_TAINTED_BETHANY_OFFSET = Vector(0, 6)
____exports.VERSION = "0.58.18"
return ____exports
 end,
["debugFunction"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.default(self)
    g.debug = true
end
function ____exports.debugFunction2(self)
end
return ____exports
 end,
["jsonHelper"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local json = require("json")
local ____log = require("log")
local log = ____log.default
local tryEncode, tryDecode
function tryEncode(____table)
    return json.encode(____table)
end
function tryDecode(jsonString)
    return json.decode(jsonString)
end
function ____exports.encode(self, ____table)
    local ok, jsonStringOrErrMsg = pcall(tryEncode, ____table)
    if not ok then
        error("Failed to convert the Lua table to JSON: " .. jsonStringOrErrMsg)
    end
    return jsonStringOrErrMsg
end
function ____exports.decode(self, jsonString)
    local ok, luaTableOrErrMsg = pcall(tryDecode, jsonString)
    if not ok then
        log(nil, "Failed to convert the JSON string to a Lua table: " .. jsonString)
        return {}
    end
    return luaTableOrErrMsg
end
return ____exports
 end,
["misc"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local EXCLUDED_CHARACTERS = ____constants.EXCLUDED_CHARACTERS
local MAX_NUM_DOORS = ____constants.MAX_NUM_DOORS
local RECOMMENDED_SHIFT_IDX = ____constants.RECOMMENDED_SHIFT_IDX
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelState = ____enums.FastTravelState
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local logAllFlags
function ____exports.getPlayers(self, performExclusions)
    if performExclusions == nil then
        performExclusions = false
    end
    local players = {}
    do
        local i = 0
        while i < g.g:GetNumPlayers() do
            local player = Isaac.GetPlayer(i)
            if player ~= nil then
                local character = player:GetPlayerType()
                if (not performExclusions) or (not __TS__ArrayIncludes(EXCLUDED_CHARACTERS, character)) then
                    __TS__ArrayPush(players, player)
                end
            end
            i = i + 1
        end
    end
    return players
end
function ____exports.getRoomIndex(self)
    local roomIndex = g.l:GetCurrentRoomDesc().SafeGridIndex
    if roomIndex < 0 then
        return g.l:GetCurrentRoomIndex()
    end
    return roomIndex
end
function ____exports.hasFlag(self, flags, flag)
    return (flags & flag) == flag
end
function ____exports.initRNG(self, seed)
    local rng = RNG()
    rng:SetSeed(seed, RECOMMENDED_SHIFT_IDX)
    return rng
end
function ____exports.initSprite(self, anm2Path, pngPath)
    local sprite = Sprite()
    if pngPath == nil then
        sprite:Load(anm2Path, true)
    else
        sprite:Load(anm2Path, false)
        sprite:ReplaceSpritesheet(0, pngPath)
        sprite:LoadGraphics()
    end
    sprite:SetFrame("Default", 0)
    return sprite
end
function logAllFlags(self, flags, maxShift)
    do
        local i = 0
        while i <= maxShift do
            if ____exports.hasFlag(nil, flags, 1 << i) then
                log(
                    nil,
                    "Has flag: " .. tostring(i)
                )
            end
            i = i + 1
        end
    end
end
function ____exports.anyPlayerCloserThan(self, position, distance)
    local playersInRange = Isaac.FindInRadius(position, distance, EntityPartition.PLAYER)
    return #playersInRange > 0
end
function ____exports.anyPlayerHasCollectible(self, collectibleType)
    for ____, player in ipairs(
        ____exports.getPlayers(nil)
    ) do
        if player:HasCollectible(collectibleType) then
            return true
        end
    end
    return false
end
function ____exports.anyPlayerHasTrinket(self, trinketType)
    for ____, player in ipairs(
        ____exports.getPlayers(nil)
    ) do
        if player:HasTrinket(trinketType) then
            return true
        end
    end
    return false
end
function ____exports.arrayEquals(self, array1, array2)
    if #array1 ~= #array2 then
        return false
    end
    do
        local i = 0
        while i < #array1 do
            if array1[i + 1] ~= array2[i + 1] then
                return false
            end
            i = i + 1
        end
    end
    return true
end
function ____exports.changeRoom(self, roomIndex)
    g.l.LeaveDoor = -1
    g.g:ChangeRoom(roomIndex)
end
function ____exports.consoleCommand(self, command)
    log(nil, "Executing console command: " .. command)
    Isaac.ExecuteCommand(command)
    log(nil, "Finished executing console command: " .. command)
end
____exports.ensureAllCases = function(____, obj) return obj end
function ____exports.enteredRoomViaTeleport(self)
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    local previousRoomIndex = g.l:GetPreviousRoomIndex()
    local isFirstVisit = g.r:IsFirstVisit()
    local roomIndex = ____exports.getRoomIndex(nil)
    local justReachedThisFloor = (roomIndex == startingRoomIndex) and isFirstVisit
    local inCrawlspace = roomIndex == GridRooms.ROOM_DUNGEON_IDX
    local cameFromCrawlspace = previousRoomIndex == GridRooms.ROOM_DUNGEON_IDX
    return ((((g.run.fastTravel.state == FastTravelState.Disabled) and (g.l.LeaveDoor == -1)) and (not justReachedThisFloor)) and (not inCrawlspace)) and (not cameFromCrawlspace)
end
function ____exports.getAllDoors(self)
    local doors = {}
    do
        local i = 0
        while i < MAX_NUM_DOORS do
            local door = g.r:GetDoor(i)
            if door ~= nil then
                __TS__ArrayPush(doors, door)
            end
            i = i + 1
        end
    end
    return doors
end
function ____exports.getGridEntities(self)
    local gridEntities = {}
    do
        local gridIndex = 0
        while gridIndex < g.r:GetGridSize() do
            local gridEntity = g.r:GetGridEntity(gridIndex)
            if gridEntity ~= nil then
                __TS__ArrayPush(gridEntities, gridEntity)
            end
            gridIndex = gridIndex + 1
        end
    end
    return gridEntities
end
function ____exports.getHUDOffsetVector(self)
    local defaultVector = Vector.Zero
    if ((ModConfigMenu == nil) or (ModConfigMenu.Config == nil)) or (ModConfigMenu.Config.General == nil) then
        return defaultVector
    end
    local hudOffset = ModConfigMenu.Config.General.HudOffset
    if hudOffset == nil then
        return defaultVector
    end
    if ((type(hudOffset) ~= "number") or (hudOffset < 1)) or (hudOffset > 10) then
        return defaultVector
    end
    local x = hudOffset * 2
    local y = hudOffset
    if y >= 4 then
        y = y + 1
    end
    if y >= 9 then
        y = y + 1
    end
    return Vector(x, y)
end
local function getItemInitCharges(self, collectibleType)
    local itemConfigItem = g.itemConfig:GetCollectible(collectibleType)
    if itemConfigItem == nil then
        return -1
    end
    return itemConfigItem.InitCharge
end
local function getItemMaxCharges(self, collectibleType)
    local itemConfigItem = g.itemConfig:GetCollectible(collectibleType)
    if itemConfigItem == nil then
        return 0
    end
    return itemConfigItem.MaxCharges
end
function ____exports.getRoomNPCs(self)
    local npcs = {}
    for ____, entity in ipairs(
        Isaac.GetRoomEntities()
    ) do
        local npc = entity:ToNPC()
        if npc ~= nil then
            __TS__ArrayPush(npcs, npc)
        end
    end
    return npcs
end
function ____exports.getBottomRightCorner(self)
    local pos = (g.r:WorldToScreenPosition(Vector.Zero) - g.r:GetRenderScrollOffset()) - g.g.ScreenShakeOffset
    local rx = pos.X + 39
    local ry = pos.Y + 91
    return Vector((rx * 2) + 338, (ry * 2) + 182)
end
function ____exports.getTotalCollectibles(self, collectibleType)
    local numCollectibles = 0
    for ____, player in ipairs(
        ____exports.getPlayers(nil)
    ) do
        numCollectibles = numCollectibles + player:GetCollectibleNum(collectibleType)
    end
    return numCollectibles
end
function ____exports.getOpenTrinketSlot(self, player)
    local maxTrinkets = player:GetMaxTrinkets()
    local trinket0 = player:GetTrinket(0)
    local trinket1 = player:GetTrinket(1)
    if maxTrinkets == 1 then
        return ((trinket0 == TrinketType.TRINKET_NULL) and 0) or nil
    end
    if maxTrinkets == 2 then
        if trinket0 == TrinketType.TRINKET_NULL then
            return 0
        end
        return ((trinket1 == TrinketType.TRINKET_NULL) and 1) or nil
    end
    error(
        ("The player has " .. tostring(maxTrinkets)) .. " trinket slots, which is not supported."
    )
    return nil
end
function ____exports.getRandom(self, x, y, seed)
    local rng = ____exports.initRNG(nil, seed)
    return rng:RandomInt((y - x) + 1) + x
end
function ____exports.giveItemAndRemoveFromPools(self, player, collectibleType)
    local initCharges = getItemInitCharges(nil, collectibleType)
    local maxCharges = getItemMaxCharges(nil, collectibleType)
    local charges = ((initCharges == -1) and maxCharges) or initCharges
    player:AddCollectible(collectibleType, charges, false)
    g.itemPool:RemoveCollectible(collectibleType)
end
function ____exports.gridToPos(self, x, y)
    x = x + 1
    y = y + 1
    local gridIndex = (y * g.r:GetGridWidth()) + x
    return g.r:GetGridPosition(gridIndex)
end
function ____exports.incrementRNG(self, seed)
    local rng = ____exports.initRNG(nil, seed)
    rng:Next()
    return rng:GetSeed()
end
function ____exports.initGlowingItemSprite(self, itemID)
    local fileNum
    if itemID < 1 then
        fileNum = "NEW"
    elseif (((itemID >= 1) and (itemID <= 729)) or (itemID == 800)) or (itemID == 801) then
        local paddedNumber = __TS__StringPadStart(
            tostring(itemID),
            3,
            "0"
        )
        fileNum = paddedNumber
    elseif (itemID > 729) and (itemID < 2001) then
        fileNum = "NEW"
    elseif (itemID >= 2001) and (itemID <= 2189) then
        fileNum = tostring(itemID)
    elseif (itemID > 2189) and (itemID < 32769) then
        fileNum = "NEW"
    elseif (itemID >= 32769) and (itemID <= 32957) then
        fileNum = tostring(itemID)
    else
        fileNum = "NEW"
    end
    return ____exports.initSprite(nil, "gfx/glowing_item.anm2", ("gfx/items_glowing/collectibles_" .. fileNum) .. ".png")
end
function ____exports.isActionPressedOnAnyInput(self, buttonAction)
    do
        local i = 0
        while i <= 3 do
            if Input.IsActionPressed(buttonAction, i) then
                return true
            end
            i = i + 1
        end
    end
    return false
end
function ____exports.isActionTriggeredOnAnyInput(self, buttonAction)
    do
        local i = 0
        while i <= 3 do
            if Input.IsActionTriggered(buttonAction, i) then
                return true
            end
            i = i + 1
        end
    end
    return false
end
function ____exports.isAntibirthStage(self)
    local stageType = g.l:GetStageType()
    return (stageType == StageType.STAGETYPE_REPENTANCE) or (stageType == StageType.STAGETYPE_REPENTANCE_B)
end
function ____exports.isSelfDamage(self, damageFlags)
    return ____exports.hasFlag(nil, damageFlags, DamageFlag.DAMAGE_NO_PENALTIES) or ____exports.hasFlag(nil, damageFlags, DamageFlag.DAMAGE_RED_HEARTS)
end
function ____exports.isPostBossVoidPortal(self, gridEntity)
    local saveState = gridEntity:GetSaveState()
    return saveState.VarData == 1
end
function ____exports.logAllEntityFlags(self, flags)
    logAllFlags(nil, flags, 59)
end
function ____exports.logColor(self, color)
    Isaac.DebugString(
        (((((((((((tostring(color.R) .. " ") .. tostring(color.G)) .. " ") .. tostring(color.B)) .. " ") .. tostring(color.A)) .. " ") .. tostring(color.RO)) .. " ") .. tostring(color.GO)) .. " ") .. tostring(color.BO)
    )
end
function ____exports.moveEsauNextToJacob(self)
    local esaus = Isaac.FindByType(EntityType.ENTITY_PLAYER, 0, PlayerType.PLAYER_ESAU)
    for ____, esau in ipairs(esaus) do
        local player = esau:ToPlayer()
        if player ~= nil then
            local jacob = player:GetMainTwin()
            local adjustment = Vector(20, 0)
            local adjustedPosition = jacob.Position + adjustment
            esau.Position = adjustedPosition
        end
    end
end
function ____exports.movePlayersAndFamiliars(self, position)
    local players = ____exports.getPlayers(nil)
    for ____, player in ipairs(players) do
        player.Position = position
    end
    ____exports.moveEsauNextToJacob(nil)
    local familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR)
    for ____, familiar in ipairs(familiars) do
        familiar.Position = position
    end
end
function ____exports.playingOnSetSeed(self)
    local customRun = g.seeds:IsCustomRun()
    local challenge = Isaac.GetChallenge()
    return (challenge == Challenge.CHALLENGE_NULL) and customRun
end
function ____exports.openAllDoors(self)
    for ____, door in ipairs(
        ____exports.getAllDoors(nil)
    ) do
        door:Open()
    end
end
function ____exports.removeGridEntity(self, gridEntity)
    local gridIndex = gridEntity:GetGridIndex()
    g.r:RemoveGridEntity(gridIndex, 0, false)
end
function ____exports.removeItemFromItemTracker(self, collectibleType)
    local itemConfig = g.itemConfig:GetCollectible(collectibleType)
    log(
        nil,
        ((("Removing collectible " .. tostring(collectibleType)) .. " (") .. itemConfig.Name) .. ")"
    )
end
function ____exports.restartAsCharacter(self, character)
    if character == PlayerType.PLAYER_THESOUL_B then
        character = PlayerType.PLAYER_THEFORGOTTEN_B
    end
    ____exports.consoleCommand(
        nil,
        "restart " .. tostring(character)
    )
end
function ____exports.teleport(self, roomIndex, direction, roomTransitionAnim)
    if direction == nil then
        direction = Direction.NO_DIRECTION
    end
    if roomTransitionAnim == nil then
        roomTransitionAnim = RoomTransitionAnim.TELEPORT
    end
    g.l.LeaveDoor = -1
    g.g:StartRoomTransition(roomIndex, direction, roomTransitionAnim)
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.entityTakeDmg"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local isSelfDamage = ____misc.isSelfDamage
function ____exports.entityTakeDmgPlayer(self, tookDamage, damageFlags)
    if not g.config.fastTravel then
        return
    end
    local player = tookDamage:ToPlayer()
    if (player ~= nil) and (not isSelfDamage(nil, damageFlags)) then
        g.run.level.fastTravel.tookDamage = true
    end
end
return ____exports
 end,
["features.optional.major.freeDevilItem"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local enteredRoomViaTeleport = ____misc.enteredRoomViaTeleport
local getOpenTrinketSlot = ____misc.getOpenTrinketSlot
local getPlayers = ____misc.getPlayers
local isAntibirthStage = ____misc.isAntibirthStage
local isSelfDamage = ____misc.isSelfDamage
local ____GlobalsRun = require("types.GlobalsRun")
local getPlayerLuaTableIndex = ____GlobalsRun.getPlayerLuaTableIndex
local giveTrinket
function giveTrinket(self, player)
    local character = player:GetPlayerType()
    player:AnimateHappy()
    if (character == PlayerType.PLAYER_KEEPER) or (character == PlayerType.PLAYER_KEEPER_B) then
        player:AddCoins(15)
        return
    end
    local trinketType = TrinketType.TRINKET_YOUR_SOUL
    if getOpenTrinketSlot(nil, player) ~= nil then
        player:AddTrinket(trinketType)
    else
        Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TRINKET, trinketType, player.Position, Vector.Zero, nil)
    end
end
function ____exports.entityTakeDmgPlayer(self, tookDamage, damageFlags)
    if not g.config.freeDevilItem then
        return
    end
    local player = tookDamage:ToPlayer()
    if (player ~= nil) and (not isSelfDamage(nil, damageFlags)) then
        local index = getPlayerLuaTableIndex(nil, player)
        g.run.freeDevilItem.tookDamage[index] = true
    end
end
function ____exports.postNewRoom(self)
    if not g.config.freeDevilItem then
        return
    end
    local stage = g.l:GetStage()
    local roomType = g.r:GetType()
    if (((not g.run.freeDevilItem.granted) and ((stage == 2) or ((stage == 1) and isAntibirthStage(nil)))) and (roomType == RoomType.ROOM_DEVIL)) and (not enteredRoomViaTeleport(nil)) then
        g.run.freeDevilItem.granted = true
        for ____, player in ipairs(
            getPlayers(nil)
        ) do
            local index = getPlayerLuaTableIndex(nil, player)
            local takenDamage = g.run.freeDevilItem.tookDamage[index]
            local playerType = player:GetPlayerType()
            local amTaintedSoul = playerType == PlayerType.PLAYER_THESOUL_B
            if (not takenDamage) and (not amTaintedSoul) then
                giveTrinket(nil, player)
            end
        end
    end
end
return ____exports
 end,
["callbacks.entityTakeDmg"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fastTravelEntityTakeDmg = require("features.optional.major.fastTravel.callbacks.entityTakeDmg")
local freeDevilItem = require("features.optional.major.freeDevilItem")
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local hasFlag = ____misc.hasFlag
local sacrificeRoom
function ____exports.player(self, tookDamage, _damageAmount, damageFlags, _damageSource, _damageCountdownFrames)
    sacrificeRoom(nil, damageFlags)
    freeDevilItem:entityTakeDmgPlayer(tookDamage, damageFlags)
    fastTravelEntityTakeDmg:entityTakeDmgPlayer(tookDamage, damageFlags)
end
function sacrificeRoom(self, damageFlags)
    local roomType = g.r:GetType()
    if roomType ~= RoomType.ROOM_SACRIFICE then
        return
    end
    if hasFlag(nil, damageFlags, DamageFlag.DAMAGE_SPIKES) then
        local ____obj, ____index = g.run.level, "numSacrifices"
        ____obj[____index] = ____obj[____index] + 1
    end
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, ____exports.player, EntityType.ENTITY_PLAYER)
end
return ____exports
 end,
["features.optional.quality.changeCreepColor"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.evaluateCacheTearColor(self, player)
    if not g.config.changeCreepColor then
        return
    end
    if not player:HasCollectible(CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID) then
        return
    end
    local color = player.TearColor
    player.TearColor = Color(color.R, color.G, color.B, color.A, color.RO, color.GO - 0.2, color.BO + 0.2)
end
function ____exports.postEffectInitCreepRed(self, effect)
    if g.config.changeCreepColor then
        return
    end
    local sprite = effect:GetSprite()
    local oldColor = sprite.Color
    local newColor = Color(oldColor.R, oldColor.G, oldColor.B, oldColor.A, oldColor.RO, oldColor.GO, oldColor.BO)
    newColor:SetColorize(0, 2.9, 0, 1)
    sprite.Color = newColor
end
function ____exports.postEffectInitPlayerCreepGreen(self, effect)
    if not g.config.changeCreepColor then
        return
    end
    if (effect.SpawnerType == EntityType.ENTITY_FAMILIAR) and (effect.SpawnerVariant == FamiliarVariant.LIL_SPEWER) then
        return
    end
    local sprite = effect:GetSprite()
    local oldColor = sprite.Color
    local newColor = Color(oldColor.R, oldColor.G, oldColor.B, oldColor.A, oldColor.RO, oldColor.GO, oldColor.BO)
    newColor:SetColorize(0, 0, 255, 1)
    sprite.Color = newColor
end
return ____exports
 end,
["callbacks.evaluateCacheFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local changeCreepColor = require("features.optional.quality.changeCreepColor")
local ____globals = require("globals")
local g = ____globals.default
local ____enums = require("types.enums")
local CollectibleTypeCustom = ____enums.CollectibleTypeCustom
local debugSpeed, thirteenLuck, fifteenLuck
function debugSpeed(self, player)
    if g.run.debugSpeed then
        player.MoveSpeed = 2
    end
end
function thirteenLuck(self, player)
    local num13Luck = player:GetCollectibleNum(CollectibleTypeCustom.COLLECTIBLE_13_LUCK)
    do
        local i = 0
        while i < num13Luck do
            player.Luck = player.Luck + 13
            i = i + 1
        end
    end
end
function fifteenLuck(self, player)
    local num15Luck = player:GetCollectibleNum(CollectibleTypeCustom.COLLECTIBLE_15_LUCK)
    do
        local i = 0
        while i < num15Luck do
            player.Luck = player.Luck + 15
            i = i + 1
        end
    end
end
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    CacheFlag.CACHE_SPEED,
    function(____, player)
        debugSpeed(nil, player)
    end
)
functionMap:set(
    CacheFlag.CACHE_TEARCOLOR,
    function(____, player)
        changeCreepColor:evaluateCacheTearColor(player)
    end
)
functionMap:set(
    CacheFlag.CACHE_LUCK,
    function(____, player)
        thirteenLuck(nil, player)
        fifteenLuck(nil, player)
    end
)
return ____exports
 end,
["callbacks.evaluateCache"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____evaluateCacheFunctions = require("callbacks.evaluateCacheFunctions")
local evaluateCacheFunctions = ____evaluateCacheFunctions.default
function ____exports.main(self, player, cacheFlag)
    local evaluateCacheFunction = evaluateCacheFunctions:get(cacheFlag)
    if evaluateCacheFunction ~= nil then
        evaluateCacheFunction(nil, player)
    end
end
return ____exports
 end,
["features.mandatory.saveFileCheck"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local playingOnSetSeed = ____misc.playingOnSetSeed
local restartAsCharacter = ____misc.restartAsCharacter
local ____enums = require("types.enums")
local SaveFileState = ____enums.SaveFileState
____exports.SAVE_FILE_SEED = "SG3K BG3F"
____exports.EDEN_ACTIVE_ITEM = CollectibleType.COLLECTIBLE_DEATH_CERTIFICATE
____exports.EDEN_PASSIVE_ITEM = CollectibleType.COLLECTIBLE_ARIES
local EDEN_ACTIVE_ITEM_BABIES_MOD = CollectibleType.COLLECTIBLE_DOCTORS_REMOTE
local EDEN_PASSIVE_ITEM_BABIES_MOD = CollectibleType.COLLECTIBLE_BOBS_BRAIN
function ____exports.isFullyUnlocked(self)
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    local activeItem = player:GetActiveItem()
    local startSeedString = g.seeds:GetStartSeedString()
    local challenge = Isaac.GetChallenge()
    if g.saveFile.state == SaveFileState.Finished then
        return true
    end
    if (g.saveFile.state == SaveFileState.NotChecked) or (g.saveFile.state == SaveFileState.DeferredUntilNewRunBegins) then
        g.saveFile.oldRun.challenge = challenge
        g.saveFile.oldRun.character = character
        g.saveFile.oldRun.seededRun = playingOnSetSeed(nil)
        g.saveFile.oldRun.seed = startSeedString
        g.saveFile.state = SaveFileState.GoingToSetSeedWithEden
        log(nil, "saveFileCheck - Performing a save file check with Eden.")
    end
    if g.saveFile.state == SaveFileState.GoingToSetSeedWithEden then
        local valid = true
        if challenge ~= Challenge.CHALLENGE_NULL then
            valid = false
        end
        if character ~= PlayerType.PLAYER_EDEN then
            valid = false
        end
        if startSeedString ~= ____exports.SAVE_FILE_SEED then
            valid = false
        end
        if not valid then
            g.run.restart = true
            return false
        end
        local neededActiveItem = ____exports.EDEN_ACTIVE_ITEM
        local neededPassiveItem = ____exports.EDEN_PASSIVE_ITEM
        if BabiesModGlobals ~= nil then
            neededActiveItem = EDEN_ACTIVE_ITEM_BABIES_MOD
            neededPassiveItem = EDEN_PASSIVE_ITEM_BABIES_MOD
        end
        local text = ("Error: On seed \"" .. ____exports.SAVE_FILE_SEED) .. "\", Eden needs "
        if activeItem ~= neededActiveItem then
            text = tostring(text) .. (((("an active item of " .. tostring(neededActiveItem)) .. " (they have an active item of ") .. tostring(activeItem)) .. ").")
            log(nil, text)
        elseif not player:HasCollectible(neededPassiveItem) then
            text = tostring(text) .. (("a passive item of " .. tostring(neededPassiveItem)) .. ".")
            log(nil, text)
        else
            g.saveFile.fullyUnlocked = true
            log(nil, "Valid save file detected.")
        end
        g.saveFile.state = SaveFileState.GoingBack
        log(nil, "saveFileCheck - Going back to the old run.")
    end
    if g.saveFile.state == SaveFileState.GoingBack then
        local valid = true
        if challenge ~= g.saveFile.oldRun.challenge then
            valid = false
        end
        if character ~= g.saveFile.oldRun.character then
            valid = false
        end
        if playingOnSetSeed(nil) ~= g.saveFile.oldRun.seededRun then
            valid = false
        end
        if g.saveFile.oldRun.seededRun and (startSeedString ~= g.saveFile.oldRun.seed) then
            valid = false
        end
        if not valid then
            g.run.restart = true
            return false
        end
        g.saveFile.state = SaveFileState.Finished
        log(nil, "saveFileCheck - Completed.")
    end
    return true
end
function ____exports.checkRestart(self)
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    local startSeedString = g.seeds:GetStartSeedString()
    local challenge = Isaac.GetChallenge()
    local ____switch21 = g.saveFile.state
    if ____switch21 == SaveFileState.GoingToSetSeedWithEden then
        goto ____switch21_case_0
    elseif ____switch21 == SaveFileState.GoingBack then
        goto ____switch21_case_1
    end
    goto ____switch21_case_default
    ::____switch21_case_0::
    do
        do
            if challenge ~= Challenge.CHALLENGE_NULL then
                consoleCommand(
                    nil,
                    "challenge " .. tostring(Challenge.CHALLENGE_NULL)
                )
            end
            if character ~= PlayerType.PLAYER_EDEN then
                restartAsCharacter(nil, PlayerType.PLAYER_EDEN)
            end
            if startSeedString ~= ____exports.SAVE_FILE_SEED then
                consoleCommand(nil, "seed " .. ____exports.SAVE_FILE_SEED)
            end
            return true
        end
    end
    ::____switch21_case_1::
    do
        do
            if challenge ~= g.saveFile.oldRun.challenge then
                consoleCommand(
                    nil,
                    "challenge " .. tostring(g.saveFile.oldRun.challenge)
                )
            end
            if character ~= g.saveFile.oldRun.character then
                restartAsCharacter(nil, g.saveFile.oldRun.character)
            end
            if playingOnSetSeed(nil) ~= g.saveFile.oldRun.seededRun then
                g.seeds:Reset()
                consoleCommand(nil, "restart")
            end
            if g.saveFile.oldRun.seededRun and (startSeedString ~= g.saveFile.oldRun.seed) then
                consoleCommand(nil, "seed " .. g.saveFile.oldRun.seed)
            end
            return true
        end
    end
    ::____switch21_case_default::
    do
        do
            return false
        end
    end
    ::____switch21_end::
end
return ____exports
 end,
["types.SocketCommands"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["features.mandatory.racingPlusSprite"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____constants = require("constants")
local SPRITE_BETHANY_OFFSET = ____constants.SPRITE_BETHANY_OFFSET
local SPRITE_CHALLENGE_OFFSET = ____constants.SPRITE_CHALLENGE_OFFSET
local SPRITE_DIFFICULTY_OFFSET = ____constants.SPRITE_DIFFICULTY_OFFSET
local SPRITE_TAINTED_BETHANY_OFFSET = ____constants.SPRITE_TAINTED_BETHANY_OFFSET
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getHUDOffsetVector = ____misc.getHUDOffsetVector
local initSprite = ____misc.initSprite
local SPRITE_POSITION
function ____exports.getPosition(self)
    local challenge = Isaac.GetChallenge()
    local HUDOffsetVector = getHUDOffsetVector(nil)
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    local position = SPRITE_POSITION + HUDOffsetVector
    if challenge ~= Challenge.CHALLENGE_NULL then
        position = position + SPRITE_CHALLENGE_OFFSET
    elseif g.g.Difficulty ~= Difficulty.DIFFICULTY_NORMAL then
        position = position + SPRITE_DIFFICULTY_OFFSET
    elseif (character == PlayerType.PLAYER_BETHANY) or (character == PlayerType.PLAYER_JACOB) then
        position = position + SPRITE_BETHANY_OFFSET
    elseif character == PlayerType.PLAYER_BETHANY_B then
        position = position + SPRITE_TAINTED_BETHANY_OFFSET
    end
    return position
end
local SpriteLayer = SpriteLayer or ({})
SpriteLayer.Blue = 0
SpriteLayer[SpriteLayer.Blue] = "Blue"
SpriteLayer.Green = 1
SpriteLayer[SpriteLayer.Green] = "Green"
SPRITE_POSITION = Vector(4, 72)
local sprite = initSprite(nil, "gfx/ui/racing_plus/racing_plus.anm2")
function ____exports.postRender(self)
    local spriteLayer = ((g.socket.client == nil) and SpriteLayer.Blue) or SpriteLayer.Green
    local position = ____exports.getPosition(nil)
    sprite:RenderLayer(spriteLayer, position)
end
return ____exports
 end,
["features.race.constants"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.COLLECTIBLE_13_LUCK_SERVER_ID = 800
____exports.COLLECTIBLE_15_LUCK_SERVER_ID = 801
____exports.RACE_ROOM_STAGE_ID = 2
____exports.RACE_ROOM_VARIANT = 5
____exports.RACE_ROOM_POSITION = Vector(320, 380)
return ____exports
 end,
["features.race.raceRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local getPlayers = ____misc.getPlayers
local getRoomIndex = ____misc.getRoomIndex
local gridToPos = ____misc.gridToPos
local initSprite = ____misc.initSprite
local ____constants = require("features.race.constants")
local RACE_ROOM_POSITION = ____constants.RACE_ROOM_POSITION
local RACE_ROOM_STAGE_ID = ____constants.RACE_ROOM_STAGE_ID
local RACE_ROOM_VARIANT = ____constants.RACE_ROOM_VARIANT
local GFX_PATH, X_SPACING, Y_SPACING, sprites, emulateGapingMaws, drawSprites, getPosition, gotoRaceRoom, shouldGotoRaceRoom, setupRaceRoom, shouldSetupRaceRoom, initNumSprite
function emulateGapingMaws(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        player.Position = RACE_ROOM_POSITION
    end
end
function drawSprites(self)
    for ____, ____value in ipairs(
        __TS__ObjectEntries(sprites)
    ) do
        local key
        key = ____value[1]
        local sprite
        sprite = ____value[2]
        if sprite ~= nil then
            local spriteName = key
            local position = getPosition(nil, spriteName)
            sprite:RenderLayer(0, position)
        end
    end
end
function getPosition(self, spriteName)
    local centerPos = g.r:GetCenterPos()
    local renderPosition = Isaac.WorldToRenderPosition(centerPos)
    local ____switch10 = spriteName
    if ____switch10 == "wait" then
        goto ____switch10_case_0
    elseif ____switch10 == "myStatus" then
        goto ____switch10_case_1
    elseif ____switch10 == "numReady" then
        goto ____switch10_case_2
    elseif ____switch10 == "slash" then
        goto ____switch10_case_3
    elseif ____switch10 == "numEntrants" then
        goto ____switch10_case_4
    elseif ____switch10 == "ranked" then
        goto ____switch10_case_5
    elseif ____switch10 == "rankedIcon" then
        goto ____switch10_case_6
    elseif ____switch10 == "format" then
        goto ____switch10_case_7
    elseif ____switch10 == "formatIcon" then
        goto ____switch10_case_8
    elseif ____switch10 == "goal" then
        goto ____switch10_case_9
    elseif ____switch10 == "goalIcon" then
        goto ____switch10_case_10
    end
    goto ____switch10_case_default
    ::____switch10_case_0::
    do
        do
            return Vector(renderPosition.X, renderPosition.Y - 80)
        end
    end
    ::____switch10_case_1::
    do
        do
            return Vector(renderPosition.X, renderPosition.Y - 40)
        end
    end
    ::____switch10_case_2::
    do
        do
            return Vector(renderPosition.X - 20, renderPosition.Y - 15)
        end
    end
    ::____switch10_case_3::
    do
        do
            return Vector(renderPosition.X, renderPosition.Y - 15)
        end
    end
    ::____switch10_case_4::
    do
        do
            return Vector(renderPosition.X + 20, renderPosition.Y - 15)
        end
    end
    ::____switch10_case_5::
    do
        do
            return Vector(renderPosition.X - X_SPACING, renderPosition.Y + Y_SPACING)
        end
    end
    ::____switch10_case_6::
    do
        do
            return Vector(renderPosition.X - X_SPACING, (renderPosition.Y + Y_SPACING) + 23)
        end
    end
    ::____switch10_case_7::
    do
        do
            return Vector(renderPosition.X + X_SPACING, renderPosition.Y + Y_SPACING)
        end
    end
    ::____switch10_case_8::
    do
        do
            return Vector(renderPosition.X + X_SPACING, (renderPosition.Y + Y_SPACING) + 23)
        end
    end
    ::____switch10_case_9::
    do
        do
            return Vector(renderPosition.X - 25, renderPosition.Y + 95)
        end
    end
    ::____switch10_case_10::
    do
        do
            return Vector(renderPosition.X + 25, renderPosition.Y + 95)
        end
    end
    ::____switch10_case_default::
    do
        do
            error(
                ("Race room sprites named \"" .. tostring(spriteName)) .. "\" are unsupported."
            )
            return Vector.Zero
        end
    end
    ::____switch10_end::
end
function gotoRaceRoom(self)
    if not shouldGotoRaceRoom(nil) then
        return
    end
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    if (stage ~= 1) or (stageType ~= StageType.STAGETYPE_WOTL) then
        g.run.forceNextLevel = true
        consoleCommand(nil, "stage 1a")
    end
    g.run.forceNextRoom = true
    consoleCommand(nil, "goto d.5")
end
function shouldGotoRaceRoom(self)
    return ((g.race.status == "open") or (g.race.status == "starting")) and (g.run.roomsEntered == 1)
end
function setupRaceRoom(self)
    if not shouldSetupRaceRoom(nil) then
        return
    end
    local gapers = Isaac.FindByType(EntityType.ENTITY_GAPER)
    for ____, gaper in ipairs(gapers) do
        gaper:Remove()
    end
    g.r:SetClear(true)
    do
        local i = 0
        while i <= 3 do
            g.r:RemoveDoor(i)
            i = i + 1
        end
    end
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        player.Position = RACE_ROOM_POSITION
    end
    local familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR)
    for ____, familiar in ipairs(familiars) do
        familiar.Position = RACE_ROOM_POSITION
    end
    local positions = {{5, 5}, {7, 5}}
    for ____, ____value in ipairs(positions) do
        local x
        x = ____value[1]
        local y
        y = ____value[2]
        local gapingMaw = Isaac.Spawn(
            EntityType.ENTITY_GAPING_MAW,
            0,
            0,
            gridToPos(nil, x, y),
            Vector.Zero,
            nil
        )
        gapingMaw:ClearEntityFlags(EntityFlag.FLAG_APPEAR)
    end
    if MinimapAPI ~= nil then
        MinimapAPI.Config.Disable = true
    end
end
function shouldSetupRaceRoom(self)
    return ((g.race.status == "open") or (g.race.status == "starting")) and ____exports.inRaceRoom(nil)
end
function ____exports.inRaceRoom(self)
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomData = roomDesc.Data
    local roomStageID = roomData.StageID
    local roomVariant = roomData.Variant
    local roomIndex = getRoomIndex(nil)
    return ((roomStageID == RACE_ROOM_STAGE_ID) and (roomVariant == RACE_ROOM_VARIANT)) and (roomIndex == GridRooms.ROOM_DEBUG_IDX)
end
function ____exports.initMyStatusSprite(self)
    sprites.myStatus = initSprite(nil, ((GFX_PATH .. "/my-status/") .. g.race.myStatus) .. ".anm2")
end
function ____exports.initNumReadySprite(self)
    sprites.numReady = initNumSprite(nil, g.race.numReady)
end
function ____exports.initNumEntrantsSprite(self)
    sprites.numEntrants = initNumSprite(nil, g.race.numEntrants)
end
function initNumSprite(self, num)
    local anm2Name = ((num > 50) and "unknown") or tostring(num)
    return initSprite(nil, ((GFX_PATH .. "/ready/") .. anm2Name) .. ".anm2")
end
GFX_PATH = "gfx/race/race-room"
X_SPACING = 110
Y_SPACING = 10
sprites = {wait = nil, myStatus = nil, numReady = nil, slash = nil, numEntrants = nil, ranked = nil, rankedIcon = nil, format = nil, formatIcon = nil, goal = nil, goalIcon = nil}
function ____exports.postRender(self)
    if not ____exports.inRaceRoom(nil) then
        return
    end
    emulateGapingMaws(nil)
    drawSprites(nil)
end
function ____exports.postNewRoom(self)
    gotoRaceRoom(nil)
    setupRaceRoom(nil)
end
function ____exports.resetSprites(self)
    for ____, key in ipairs(
        __TS__ObjectKeys(sprites)
    ) do
        local property = key
        sprites[property] = nil
    end
end
function ____exports.initSprites(self)
    if g.race.status ~= "open" then
        return
    end
    sprites.wait = initSprite(nil, GFX_PATH .. "/wait.anm2")
    ____exports.initMyStatusSprite(nil)
    ____exports.initNumReadySprite(nil)
    sprites.slash = initSprite(nil, GFX_PATH .. "/slash.anm2")
    ____exports.initNumEntrantsSprite(nil)
    local isRanked = g.race.ranked or (not g.race.solo)
    local ranked = (isRanked and "ranked") or "unranked"
    sprites.ranked = initSprite(nil, ((GFX_PATH .. "/ranked/") .. ranked) .. ".anm2")
    sprites.rankedIcon = initSprite(nil, ((GFX_PATH .. "/ranked/") .. ranked) .. "-icon.anm2")
    sprites.format = initSprite(nil, ((GFX_PATH .. "/formats/") .. g.race.format) .. ".anm2")
    sprites.formatIcon = initSprite(nil, ((GFX_PATH .. "/formats/") .. g.race.format) .. "-icon.anm2")
    sprites.goal = initSprite(nil, GFX_PATH .. "/goal.anm2")
    sprites.goalIcon = initSprite(nil, ((GFX_PATH .. "/goals/") .. g.race.goal) .. ".anm2")
end
function ____exports.statusChanged(self)
    if g.race.status == "starting" then
        sprites.wait = nil
        sprites.myStatus = nil
        sprites.numReady = nil
        sprites.slash = nil
        sprites.numEntrants = nil
    end
end
function ____exports.myStatusChanged(self)
    if g.race.status == "open" then
        ____exports.initMyStatusSprite(nil)
    end
end
function ____exports.numReadyChanged(self)
    if g.race.status == "open" then
        ____exports.initNumReadySprite(nil)
    end
end
function ____exports.numEntrantsChanged(self)
    if g.race.status == "open" then
        ____exports.initNumEntrantsSprite(nil)
    end
end
return ____exports
 end,
["features.race.placeLeft"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local initSprite = ____misc.initSprite
local racingPlusSprite = require("features.mandatory.racingPlusSprite")
local ____raceRoom = require("features.race.raceRoom")
local inRaceRoom = ____raceRoom.inRaceRoom
local GFX_PATH, MAX_PLACE, SPRITE_OFFSET, sprite, drawSprite, getPosition
function drawSprite(self)
    if inRaceRoom(nil) then
        return
    end
    if g.race.solo then
        return
    end
    if sprite ~= nil then
        local position = getPosition(nil)
        sprite:RenderLayer(0, position)
    end
end
function getPosition(self)
    return racingPlusSprite:getPosition() + SPRITE_OFFSET
end
function ____exports.statusOrMyStatusChanged(self)
    if g.race.status == "open" then
        sprite = initSprite(nil, ((GFX_PATH .. "/pre-") .. g.race.myStatus) .. ".anm2")
    elseif g.race.status == "starting" then
        sprite = nil
    end
end
function ____exports.placeMidChanged(self)
    if (g.race.status ~= "in progress") or (g.race.myStatus ~= "racing") then
        return
    end
    if (g.race.placeMid == -1) or (g.race.placeMid > MAX_PLACE) then
        sprite = nil
    else
        sprite = initSprite(
            nil,
            ((GFX_PATH .. "/") .. tostring(g.race.placeMid)) .. ".anm2"
        )
    end
end
GFX_PATH = "gfx/race/place-left"
MAX_PLACE = 16
SPRITE_OFFSET = Vector(20, 7)
sprite = nil
function ____exports.postRender(self)
    drawSprite(nil)
end
function ____exports.postNewLevel(self)
    local stage = g.l:GetStage()
    if ((g.race.status == "in progress") and (g.race.myStatus == "racing")) and (stage == 2) then
        ____exports.placeMidChanged(nil)
    end
end
function ____exports.postGameStarted(self)
    ____exports.statusOrMyStatusChanged(nil)
end
function ____exports.placeChanged(self)
    if (g.race.place == -1) or (g.race.place > MAX_PLACE) then
        sprite = nil
    else
        sprite = initSprite(
            nil,
            ((GFX_PATH .. "/") .. tostring(g.race.place)) .. ".anm2"
        )
    end
end
function ____exports.resetSprite(self)
    sprite = nil
end
return ____exports
 end,
["features.race.raceStart"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____RaceVars = require("features.race.types.RaceVars")
local RaceVars = ____RaceVars.default
function ____exports.default(self)
    g.raceVars = __TS__New(RaceVars)
    g.raceVars.started = true
    g.raceVars.startedTime = Isaac.GetTime()
    g.raceVars.startedFrame = Isaac.GetFrameCount()
end
return ____exports
 end,
["features.race.startingRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local initGlowingItemSprite = ____misc.initGlowingItemSprite
local initSprite = ____misc.initSprite
local FIRST_GOLDEN_TRINKET_ID, GFX_PATH, sprites, drawSprites, getPosition, initSeededSprites, initDiversitySprites
function drawSprites(self)
    for ____, ____value in ipairs(
        __TS__ObjectEntries(sprites)
    ) do
        local key
        key = ____value[1]
        local sprite
        sprite = ____value[2]
        if sprite ~= nil then
            local spriteName = key
            local position = getPosition(nil, spriteName)
            sprite:RenderLayer(0, position)
        end
    end
end
function getPosition(self, spriteName)
    local centerPos = g.r:GetCenterPos()
    local renderPosition = Isaac.WorldToRenderPosition(centerPos)
    local itemRow1Y = renderPosition.Y - 10
    local ____switch7 = spriteName
    if ____switch7 == "seededStartingTitle" then
        goto ____switch7_case_0
    elseif ____switch7 == "seededItemCenter" then
        goto ____switch7_case_1
    elseif ____switch7 == "seededItemLeft" then
        goto ____switch7_case_2
    elseif ____switch7 == "seededItemRight" then
        goto ____switch7_case_3
    elseif ____switch7 == "seededItemFarLeft" then
        goto ____switch7_case_4
    elseif ____switch7 == "seededItemFarRight" then
        goto ____switch7_case_5
    elseif ____switch7 == "diversityActive" then
        goto ____switch7_case_6
    elseif ____switch7 == "diversityPassives" then
        goto ____switch7_case_7
    elseif ____switch7 == "diversityTrinket" then
        goto ____switch7_case_8
    elseif ____switch7 == "diversityItem1" then
        goto ____switch7_case_9
    elseif ____switch7 == "diversityItem2" then
        goto ____switch7_case_10
    elseif ____switch7 == "diversityItem3" then
        goto ____switch7_case_11
    elseif ____switch7 == "diversityItem4" then
        goto ____switch7_case_12
    elseif ____switch7 == "diversityItem5" then
        goto ____switch7_case_13
    end
    goto ____switch7_case_default
    ::____switch7_case_0::
    do
        do
            return Vector(renderPosition.X, renderPosition.Y - 40)
        end
    end
    ::____switch7_case_1::
    do
        do
            return Vector(renderPosition.X, itemRow1Y)
        end
    end
    ::____switch7_case_2::
    do
        do
            return Vector(renderPosition.X - 15, itemRow1Y)
        end
    end
    ::____switch7_case_3::
    do
        do
            return Vector(renderPosition.X + 15, itemRow1Y)
        end
    end
    ::____switch7_case_4::
    do
        do
            return Vector(renderPosition.X - 45, itemRow1Y)
        end
    end
    ::____switch7_case_5::
    do
        do
            return Vector(renderPosition.X + 45, itemRow1Y)
        end
    end
    ::____switch7_case_6::
    do
        do
            return Vector(renderPosition.X - 90, renderPosition.Y - 70)
        end
    end
    ::____switch7_case_7::
    do
        do
            return Vector(renderPosition.X + 90, renderPosition.Y - 40)
        end
    end
    ::____switch7_case_8::
    do
        do
            return Vector(renderPosition.X - 90, renderPosition.Y + 30)
        end
    end
    ::____switch7_case_9::
    do
        do
            return Vector(renderPosition.X - 90, renderPosition.Y - 40)
        end
    end
    ::____switch7_case_10::
    do
        do
            return Vector(renderPosition.X + 60, itemRow1Y)
        end
    end
    ::____switch7_case_11::
    do
        do
            return Vector(renderPosition.X + 90, itemRow1Y)
        end
    end
    ::____switch7_case_12::
    do
        do
            return Vector(renderPosition.X + 120, itemRow1Y)
        end
    end
    ::____switch7_case_13::
    do
        do
            return Vector(renderPosition.X - 90, renderPosition.Y + 60)
        end
    end
    ::____switch7_case_default::
    do
        do
            error(
                ("Starting room sprites named \"" .. tostring(spriteName)) .. "\" are unsupported."
            )
            return Vector.Zero
        end
    end
    ::____switch7_end::
end
function ____exports.resetSprites(self)
    for ____, key in ipairs(
        __TS__ObjectKeys(sprites)
    ) do
        local property = key
        sprites[property] = nil
    end
end
function initSeededSprites(self)
    local title = ((#g.race.startingItems == 1) and "item") or "build"
    sprites.seededStartingTitle = initSprite(nil, ((GFX_PATH .. "/seeded-starting-") .. title) .. ".anm2")
    if #g.race.startingItems == 1 then
        sprites.seededItemCenter = initGlowingItemSprite(nil, g.race.startingItems[1])
    elseif #g.race.startingItems == 2 then
        sprites.seededItemLeft = initGlowingItemSprite(nil, g.race.startingItems[1])
        sprites.seededItemRight = initGlowingItemSprite(nil, g.race.startingItems[2])
    elseif #g.race.startingItems == 3 then
        sprites.seededItemCenter = initGlowingItemSprite(nil, g.race.startingItems[1])
        sprites.seededItemFarLeft = initGlowingItemSprite(nil, g.race.startingItems[2])
        sprites.seededItemFarRight = initGlowingItemSprite(nil, g.race.startingItems[3])
    elseif #g.race.startingItems == 4 then
        sprites.seededItemLeft = initGlowingItemSprite(nil, g.race.startingItems[2])
        sprites.seededItemRight = initGlowingItemSprite(nil, g.race.startingItems[3])
        sprites.seededItemFarLeft = initGlowingItemSprite(nil, g.race.startingItems[1])
        sprites.seededItemFarRight = initGlowingItemSprite(nil, g.race.startingItems[4])
    end
end
function initDiversitySprites(self)
    sprites.diversityActive = initSprite(nil, GFX_PATH .. "/diversity-active.anm2")
    sprites.diversityPassives = initSprite(nil, GFX_PATH .. "/diversity-passives.anm2")
    sprites.diversityTrinket = initSprite(nil, GFX_PATH .. "/diversity-trinket.anm2")
    sprites.diversityItem1 = initGlowingItemSprite(nil, g.race.startingItems[1])
    sprites.diversityItem2 = initGlowingItemSprite(nil, g.race.startingItems[2])
    sprites.diversityItem3 = initGlowingItemSprite(nil, g.race.startingItems[3])
    sprites.diversityItem4 = initGlowingItemSprite(nil, g.race.startingItems[4])
    local modifiedTrinketID = tonumber(g.race.startingItems[5])
    if modifiedTrinketID == nil then
        error(
            "Failed to convert the diversity trinket to a number: " .. tostring(g.race.startingItems[5])
        )
    end
    if modifiedTrinketID < FIRST_GOLDEN_TRINKET_ID then
        modifiedTrinketID = modifiedTrinketID + 2000
    end
    sprites.diversityItem5 = initGlowingItemSprite(nil, modifiedTrinketID)
end
FIRST_GOLDEN_TRINKET_ID = 32769
GFX_PATH = "gfx/race/starting-room"
sprites = {seededStartingTitle = nil, seededItemCenter = nil, seededItemLeft = nil, seededItemRight = nil, seededItemFarLeft = nil, seededItemFarRight = nil, diversityActive = nil, diversityPassives = nil, diversityTrinket = nil, diversityItem1 = nil, diversityItem2 = nil, diversityItem3 = nil, diversityItem4 = nil, diversityItem5 = nil}
function ____exports.postRender(self)
    drawSprites(nil)
end
function ____exports.postNewRoom(self)
    if g.run.roomsEntered > 1 then
        ____exports.resetSprites(nil)
    end
end
function ____exports.initSprites(self)
    if (g.race.status ~= "in progress") or (g.race.myStatus ~= "racing") then
        return
    end
    local ____switch29 = g.race.format
    if ____switch29 == "seeded" then
        goto ____switch29_case_0
    elseif ____switch29 == "diversity" then
        goto ____switch29_case_1
    end
    goto ____switch29_case_default
    ::____switch29_case_0::
    do
        do
            initSeededSprites(nil)
            goto ____switch29_end
        end
    end
    ::____switch29_case_1::
    do
        do
            initDiversitySprites(nil)
            goto ____switch29_end
        end
    end
    ::____switch29_case_default::
    do
        do
            goto ____switch29_end
        end
    end
    ::____switch29_end::
end
return ____exports
 end,
["features.race.topSprite"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local initSprite = ____misc.initSprite
local GFX_PATH, GO_GFX_PATH, sprite, drawSprite, getPosition, hideGoSprite
function drawSprite(self)
    if sprite ~= nil then
        local position = getPosition(nil)
        sprite:RenderLayer(0, position)
    end
end
function getPosition(self)
    local centerPos = g.r:GetCenterPos()
    local renderPos = Isaac.WorldToRenderPosition(centerPos)
    return Vector(renderPos.X, renderPos.Y - 80)
end
function hideGoSprite(self)
    if (((sprite ~= nil) and (sprite:GetFilename() == GO_GFX_PATH)) and (g.race.status == "in progress")) and (g.race.myStatus == "racing") then
        local elapsedMilliseconds = Isaac.GetTime() - g.raceVars.startedTime
        local elapsedSeconds = elapsedMilliseconds / 1000
        if elapsedSeconds >= 3 then
            sprite = nil
        end
    end
end
function ____exports.statusChanged(self)
    if g.race.status == "starting" then
        ____exports.countdownChanged(nil)
    elseif (g.race.status == "in progress") and (g.race.myStatus == "racing") then
        sprite = initSprite(nil, GO_GFX_PATH)
    end
end
function ____exports.countdownChanged(self)
    if g.race.countdown == -1 then
        sprite = nil
    elseif g.race.status == "starting" then
        sprite = initSprite(
            nil,
            ((GFX_PATH .. "/countdown/") .. tostring(g.race.countdown)) .. ".anm2"
        )
    end
end
GFX_PATH = "gfx/race"
GO_GFX_PATH = GFX_PATH .. "/countdown/go.anm2"
local MAX_PLACE = 32
sprite = nil
function ____exports.postRender(self)
    drawSprite(nil)
    hideGoSprite(nil)
end
function ____exports.postGameStarted(self)
    ____exports.statusChanged(nil)
end
function ____exports.postNewRoom(self)
    if (g.race.status == "none") or g.raceVars.finished then
        sprite = nil
    end
end
function ____exports.placeChanged(self)
    if (not g.raceVars.finished) or (g.race.place == -1) then
        return
    end
    if g.race.place > MAX_PLACE then
        sprite = nil
    else
        sprite = initSprite(
            nil,
            ((GFX_PATH .. "/place-top/") .. tostring(g.race.place)) .. ".anm2"
        )
    end
end
function ____exports.setErrorNormalMode(self)
    sprite = initSprite(nil, GFX_PATH .. "/error-not-hard-mode.anm2")
end
function ____exports.setErrorHardMode(self)
    sprite = initSprite(nil, GFX_PATH .. "/error-hard-mode.anm2")
end
function ____exports.resetSprite(self)
    sprite = nil
end
return ____exports
 end,
["features.race.sprites"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local placeLeft = require("features.race.placeLeft")
local raceRoom = require("features.race.raceRoom")
local startingRoom = require("features.race.startingRoom")
local topSprite = require("features.race.topSprite")
function ____exports.resetAll(self)
    raceRoom:resetSprites()
    startingRoom:resetSprites()
    placeLeft:resetSprite()
    topSprite:resetSprite()
end
return ____exports
 end,
["features.race.checkRaceChanged"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local arrayEquals = ____misc.arrayEquals
local ensureAllCases = ____misc.ensureAllCases
local getRoomIndex = ____misc.getRoomIndex
local placeLeft = require("features.race.placeLeft")
local raceRoom = require("features.race.raceRoom")
local ____raceStart = require("features.race.raceStart")
local raceStart = ____raceStart.default
local sprites = require("features.race.sprites")
local topSprite = require("features.race.topSprite")
local ____RaceVars = require("features.race.types.RaceVars")
local RaceVars = ____RaceVars.default
local raceValueChanged, functionMap
function raceValueChanged(self, property, oldValue, newValue)
    log(
        nil,
        (((("Race value \"" .. property) .. "\" changed: ") .. tostring(oldValue)) .. " --> ") .. tostring(newValue)
    )
    local changedFunction = functionMap:get(property)
    if changedFunction ~= nil then
        changedFunction(nil, oldValue, newValue)
    end
end
function ____exports.checkRaceChanged(self, oldRaceData, newRaceData)
    local keys = __TS__ObjectKeys(oldRaceData)
    table.sort(keys)
    for ____, key in ipairs(keys) do
        local property = key
        local oldValue = oldRaceData[property]
        if oldValue == nil then
            error(("The previous value for \"" .. key) .. "\" does not exist.")
        end
        local newValue = newRaceData[property]
        if newValue == nil then
            error(("The new value for \"" .. key) .. "\" does not exist.")
        end
        local valueType = type(oldValue)
        if valueType == "table" then
            local oldArray = oldValue
            local newArray = newValue
            if not arrayEquals(nil, oldArray, newArray) then
                raceValueChanged(nil, property, oldArray, newArray)
            end
        elseif oldValue ~= newValue then
            raceValueChanged(nil, property, oldValue, newValue)
        end
    end
end
functionMap = __TS__New(Map)
functionMap:set(
    "status",
    function(____, _oldValue, newValue)
        local newStatus = newValue
        local roomIndex = getRoomIndex(nil)
        local stage = g.l:GetStage()
        local startingRoomIndex = g.l:GetStartingRoomIndex()
        local ____switch12 = newStatus
        if ____switch12 == "none" then
            goto ____switch12_case_0
        elseif ____switch12 == "open" then
            goto ____switch12_case_1
        elseif ____switch12 == "starting" then
            goto ____switch12_case_2
        elseif ____switch12 == "in progress" then
            goto ____switch12_case_3
        end
        goto ____switch12_case_default
        ::____switch12_case_0::
        do
            do
                if raceRoom:inRaceRoom() then
                    g.run.restart = true
                    log(nil, "Restarting because we want to exit the race room.")
                end
                g.raceVars = __TS__New(RaceVars)
                sprites:resetAll()
                goto ____switch12_end
            end
        end
        ::____switch12_case_1::
        do
            do
                if (stage == 1) and (roomIndex == startingRoomIndex) then
                    g.run.restart = true
                    log(nil, "Restarting to go to the race room.")
                end
                placeLeft:statusOrMyStatusChanged()
                topSprite:statusChanged()
                goto ____switch12_end
            end
        end
        ::____switch12_case_2::
        do
            do
                raceRoom:statusChanged()
                placeLeft:statusOrMyStatusChanged()
                topSprite:statusChanged()
                goto ____switch12_end
            end
        end
        ::____switch12_case_3::
        do
            do
                g.run.restart = true
                log(nil, "Restarting because the run has now started.")
                raceStart(nil)
                goto ____switch12_end
            end
        end
        ::____switch12_case_default::
        do
            do
                ensureAllCases(nil, newStatus)
                goto ____switch12_end
            end
        end
        ::____switch12_end::
    end
)
functionMap:set(
    "myStatus",
    function(____, _oldValue, _newValue)
        raceRoom:myStatusChanged()
        placeLeft:statusOrMyStatusChanged()
    end
)
functionMap:set(
    "countdown",
    function(____, _oldValue, _newValue)
        topSprite:countdownChanged()
    end
)
functionMap:set(
    "place",
    function(____, _oldValue, _newValue)
        placeLeft:placeChanged()
        topSprite:placeChanged()
    end
)
functionMap:set(
    "placeMid",
    function(____, _oldValue, _newValue)
        placeLeft:placeMidChanged()
    end
)
functionMap:set(
    "numReady",
    function(____, _oldValue, _newValue)
        raceRoom:numReadyChanged()
    end
)
functionMap:set(
    "numEntrants",
    function(____, _oldValue, _newValue)
        raceRoom:numEntrantsChanged()
    end
)
return ____exports
 end,
["features.race.socketFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local jsonHelper = require("jsonHelper")
local ____checkRaceChanged = require("features.race.checkRaceChanged")
local checkRaceChanged = ____checkRaceChanged.checkRaceChanged
local ____RaceData = require("features.race.types.RaceData")
local RaceData = ____RaceData.default
local cloneRaceData = ____RaceData.cloneRaceData
local unpackSetMsg, setRace
function ____exports.reset(self)
    local oldRaceData = cloneRaceData(nil, g.race)
    g.race = __TS__New(RaceData)
    checkRaceChanged(nil, oldRaceData, g.race)
end
function unpackSetMsg(self, rawData)
    local separator = " "
    local ____ = __TS__StringSplit(rawData, separator)
    local property = ____[1]
    local dataArray = __TS__ArraySlice(____, 1)
    local data = table.concat(dataArray, separator or ",")
    return {property, data}
end
function setRace(self, key, value)
    g.race[key] = value
end
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set("reset", ____exports.reset)
functionMap:set(
    "set",
    function(____, rawData)
        local propertyString, data = table.unpack(
            unpackSetMsg(nil, rawData)
        )
        local property = propertyString
        local previousValue = g.race[property]
        if previousValue == nil then
            error("Got a set command from the Racing+ client for a property that does not exist.")
        end
        local previousValueType = type(previousValue)
        local ____switch5 = previousValueType
        if ____switch5 == "string" then
            goto ____switch5_case_0
        elseif ____switch5 == "boolean" then
            goto ____switch5_case_1
        elseif ____switch5 == "number" then
            goto ____switch5_case_2
        elseif ____switch5 == "table" then
            goto ____switch5_case_3
        end
        goto ____switch5_case_default
        ::____switch5_case_0::
        do
            do
                setRace(nil, property, data)
                goto ____switch5_end
            end
        end
        ::____switch5_case_1::
        do
            do
                local bool
                if data == "true" then
                    bool = true
                elseif data == "false" then
                    bool = false
                else
                    error((("Failed to convert \"" .. data) .. "\" to a boolean when setting the race property: ") .. property)
                end
                setRace(nil, property, bool)
                goto ____switch5_end
            end
        end
        ::____switch5_case_2::
        do
            do
                local num = tonumber(data)
                if num == nil then
                    error((("Failed to convert \"" .. data) .. "\" to a number when setting the race property: ") .. property)
                end
                setRace(nil, property, num)
                goto ____switch5_end
            end
        end
        ::____switch5_case_3::
        do
            do
                local newArray = jsonHelper:decode(data)
                g.race.startingItems = newArray
                goto ____switch5_end
            end
        end
        ::____switch5_case_default::
        do
            do
                error(("Setting race types of \"" .. previousValueType) .. "\" are not supported.")
            end
        end
        ::____switch5_end::
    end
)
return ____exports
 end,
["features.race.socket"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____checkRaceChanged = require("features.race.checkRaceChanged")
local checkRaceChanged = ____checkRaceChanged.checkRaceChanged
local ____socketFunctions = require("features.race.socketFunctions")
local socketFunctions = ____socketFunctions.default
local reset = ____socketFunctions.reset
local ____RaceData = require("features.race.types.RaceData")
local RaceData = ____RaceData.default
local cloneRaceData = ____RaceData.cloneRaceData
local DEBUG, MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS, PORT, read, packSocketMsg, disconnect
function read(self)
    if g.socket.client == nil then
        return false
    end
    local rawData, errMsg = g.socket.client:receive()
    if rawData == nil then
        if errMsg ~= "timeout" then
            log(nil, "Failed to read data: " .. errMsg)
            disconnect(nil)
        end
        return false
    end
    local command, data = table.unpack(
        ____exports.unpackSocketMsg(nil, rawData)
    )
    if DEBUG then
        log(nil, "Got socket data: " .. rawData)
    end
    local socketFunction = socketFunctions:get(command)
    if socketFunction ~= nil then
        socketFunction(nil, data)
    else
        log(nil, "Error: Received an unknown socket command: " .. command)
    end
    return true
end
function ____exports.connect(self)
    if (not g.socket.enabled) or (g.sandbox == nil) then
        return false
    end
    local isaacFrameCount = Isaac.GetFrameCount()
    if (g.socket.connectionAttemptFrame ~= 0) and (isaacFrameCount < (g.socket.connectionAttemptFrame + MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS)) then
        g.socket.connectionAttemptFrame = isaacFrameCount
        return false
    end
    g.socket.connectionAttemptFrame = isaacFrameCount
    g.socket.client = g.sandbox.connectLocalhost(PORT)
    if g.socket.client == nil then
        return false
    end
    g.socket.client:settimeout(0)
    return true
end
function ____exports.send(self, command, data)
    if data == nil then
        data = ""
    end
    if g.socket.client == nil then
        return
    end
    if (g.race.status == "none") and (command ~= "ping") then
        return
    end
    local packedMsg = packSocketMsg(nil, command, data)
    local sentBytes, errMsg = g.socket.client:send(packedMsg)
    if sentBytes == nil then
        log(nil, "Failed to send data over the socket: " .. errMsg)
        disconnect(nil)
    end
end
function packSocketMsg(self, command, data)
    if data == "" then
        return command .. "\n"
    end
    local separator = " "
    return ((command .. separator) .. data) .. "\n"
end
function ____exports.unpackSocketMsg(self, rawData)
    local separator = " "
    local ____ = __TS__StringSplit(
        __TS__StringTrim(rawData),
        separator
    )
    local command = ____[1]
    local dataArray = __TS__ArraySlice(____, 1)
    local data = table.concat(dataArray, separator or ",")
    return {command, data}
end
function disconnect(self)
    g.socket.client = nil
    reset(nil)
end
DEBUG = false
MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS = 2 * 60
PORT = 9112
function ____exports.postRender(self)
    if not g.config.clientCommunication then
        return
    end
    if g.socket.client == nil then
        return
    end
    ____exports.send(nil, "ping")
    if g.socket.client == nil then
        return
    end
    local oldRaceData = cloneRaceData(nil, g.race)
    while read(nil) do
    end
    checkRaceChanged(nil, oldRaceData, g.race)
end
function ____exports.postGameStarted(self)
    local startSeedString = g.seeds:GetStartSeedString()
    if g.socket.client == nil then
        if not ____exports.connect(nil) then
            g.race = __TS__New(RaceData)
        end
    end
    ____exports.send(nil, "seed", startSeedString)
end
function ____exports.preGameExit(self)
    ____exports.send(nil, "mainMenu")
end
function ____exports.postNewLevel(self)
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    ____exports.send(
        nil,
        "level",
        (tostring(stage) .. "-") .. tostring(stageType)
    )
end
function ____exports.postNewRoom(self)
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomData = roomDesc.Data
    local roomType = roomData.Type
    local roomVariant = roomData.Variant
    ____exports.send(
        nil,
        "room",
        (tostring(roomType) .. "-") .. tostring(roomVariant)
    )
end
function ____exports.postItemPickup(self, pickingUpItemDescription)
    if ((pickingUpItemDescription.type == ItemType.ITEM_ACTIVE) or (pickingUpItemDescription.type == ItemType.ITEM_PASSIVE)) or (pickingUpItemDescription.type == ItemType.ITEM_FAMILIAR) then
        ____exports.send(
            nil,
            "item",
            tostring(pickingUpItemDescription.id)
        )
    end
end
return ____exports
 end,
["callbacks.executeCmdSubroutines"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local teleport = ____misc.teleport
function ____exports.blackMarket(self)
    teleport(nil, GridRooms.ROOM_BLACK_MARKET_IDX)
end
function ____exports.chaosCardTears(self)
    g.run.debugChaosCard = not g.run.debugChaosCard
    local enabled = (g.run.debugChaosCard and "Enabled") or "Disabled"
    print(enabled .. " Chaos Card tears.")
end
function ____exports.crawlspace(self)
    local player = Isaac.GetPlayer()
    if player ~= nil then
        local position = g.r:FindFreePickupSpawnPosition(player.Position, 0, true)
        Isaac.GridSpawn(GridEntityType.GRID_STAIRS, 0, position, true)
    end
end
function ____exports.commands(self, functionMap)
    local commandNames = {
        __TS__Spread(
            functionMap:keys()
        )
    }
    table.sort(commandNames)
    print("List of Racing+ commands:")
    local text = table.concat(commandNames, " " or ",")
    print(text)
end
function ____exports.devil(self)
    local player = Isaac.GetPlayer()
    if player ~= nil then
        player:UseCard(Card.CARD_JOKER)
    end
end
function ____exports.IAMERROR(self)
    teleport(nil, GridRooms.ROOM_ERROR_IDX)
end
function ____exports.trapdoor(self)
    local player = Isaac.GetPlayer()
    if player ~= nil then
        local position = g.r:FindFreePickupSpawnPosition(player.Position, 0, true)
        Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, position, true)
    end
end
function ____exports.validateNumber(self, params)
    local num = tonumber(params)
    if num == nil then
        print("You must specify a number.")
    end
    return num
end
return ____exports
 end,
["callbacks.executeCmdFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____cardMap = require("cardMap")
local CARD_MAP = ____cardMap.default
local ____characterMap = require("characterMap")
local CHARACTER_MAP = ____characterMap.default
local ____constants = require("constants")
local VERSION = ____constants.VERSION
local ____debugFunction = require("debugFunction")
local debugFunction = ____debugFunction.default
local debugFunction2 = ____debugFunction.debugFunction2
local ____saveFileCheck = require("features.mandatory.saveFileCheck")
local EDEN_ACTIVE_ITEM = ____saveFileCheck.EDEN_ACTIVE_ITEM
local EDEN_PASSIVE_ITEM = ____saveFileCheck.EDEN_PASSIVE_ITEM
local SAVE_FILE_SEED = ____saveFileCheck.SAVE_FILE_SEED
local socket = require("features.race.socket")
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local getPlayers = ____misc.getPlayers
local gridToPos = ____misc.gridToPos
local restartAsCharacter = ____misc.restartAsCharacter
local ____executeCmdSubroutines = require("callbacks.executeCmdSubroutines")
local blackMarket = ____executeCmdSubroutines.blackMarket
local chaosCardTears = ____executeCmdSubroutines.chaosCardTears
local commands = ____executeCmdSubroutines.commands
local crawlspace = ____executeCmdSubroutines.crawlspace
local devil = ____executeCmdSubroutines.devil
local IAMERROR = ____executeCmdSubroutines.IAMERROR
local trapdoor = ____executeCmdSubroutines.trapdoor
local validateNumber = ____executeCmdSubroutines.validateNumber
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    "angel",
    function(____, _params)
        local player = Isaac.GetPlayer()
        local hasEucharist = player:HasCollectible(CollectibleType.COLLECTIBLE_EUCHARIST)
        if not hasEucharist then
            player:AddCollectible(CollectibleType.COLLECTIBLE_EUCHARIST, 0, false)
        end
        player:UseCard(Card.CARD_JOKER)
        if not hasEucharist then
            player:RemoveCollectible(CollectibleType.COLLECTIBLE_EUCHARIST)
        end
    end
)
functionMap:set(
    "blackmarket",
    function(____, _params)
        blackMarket(nil)
    end
)
functionMap:set(
    "bomb",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:AddBombs(1)
        end
    end
)
functionMap:set(
    "bombs",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:AddBombs(99)
        end
    end
)
functionMap:set(
    "boss",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:UseCard(Card.CARD_EMPEROR)
        end
    end
)
functionMap:set(
    "bm",
    function(____, _params)
        blackMarket(nil)
    end
)
functionMap:set(
    "card",
    function(____, params)
        if params == "" then
            print("You must specify a card name.")
            return
        end
        local num = tonumber(params)
        if num ~= nil then
            if (num < 1) or (num >= Card.NUM_CARDS) then
                print("That is an invalid card ID.")
                return
            end
            consoleCommand(
                nil,
                "g k" .. tostring(num)
            )
            print(
                "Gave card: #" .. tostring(num)
            )
            return
        end
        local word = string.lower(params)
        local card = CARD_MAP:get(word)
        if card == nil then
            print("Unknown card.")
            return
        end
        consoleCommand(
            nil,
            "g k" .. tostring(card)
        )
        print(
            "Gave card: #" .. tostring(card)
        )
    end
)
functionMap:set(
    "cards",
    function(____, _params)
        local cardNum = 1
        do
            local y = 0
            while y <= 6 do
                do
                    local x = 0
                    while x <= 12 do
                        if cardNum < Card.NUM_CARDS then
                            local pos = gridToPos(nil, x, y)
                            Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, cardNum, pos, Vector.Zero, nil)
                            cardNum = cardNum + 1
                        end
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
    end
)
functionMap:set(
    "cc",
    function(____, _params)
        chaosCardTears(nil)
    end
)
functionMap:set(
    "chaos",
    function(____, _params)
        chaosCardTears(nil)
    end
)
functionMap:set(
    "char",
    function(____, params)
        if params == "" then
            print("You must specify a character name or number.")
            return
        end
        local character
        local num = tonumber(params)
        if num ~= nil then
            character = num
        else
            local word = string.lower(params)
            local characterFromMap = CHARACTER_MAP:get(word)
            if characterFromMap == nil then
                print("Unknown character.")
                return
            end
            character = characterFromMap
        end
        restartAsCharacter(nil, character)
    end
)
functionMap:set(
    "coin",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:AddCoins(1)
        end
    end
)
functionMap:set(
    "coins",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:AddCoins(99)
        end
    end
)
functionMap:set(
    "connect",
    function(____, _params)
        if socket:connect() then
            print("Successfully connected.")
        else
            print("Failed to connect.")
        end
    end
)
functionMap:set(
    "commands",
    function(____, _params)
        commands(nil, functionMap)
    end
)
functionMap:set(
    "crawl",
    function(____, _params)
        crawlspace(nil)
    end
)
functionMap:set(
    "crawlspace",
    function(____, _params)
        crawlspace(nil)
    end
)
functionMap:set(
    "dd",
    function(____, _params)
        devil(nil)
    end
)
functionMap:set(
    "debug",
    function(____, _params)
        debugFunction(nil)
    end
)
functionMap:set(
    "debug2",
    function(____, _params)
        debugFunction2(nil)
    end
)
functionMap:set(
    "devil",
    function(____, _params)
        devil(nil)
    end
)
functionMap:set(
    "fool",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:UseCard(Card.CARD_FOOL)
        end
    end
)
functionMap:set(
    "effects",
    function(____, _params)
        local player = Isaac.GetPlayer()
        local effects = player:GetEffects()
        local effectsList = effects:GetEffectsList()
        if effectsList.Size == 0 then
            print("There are no current temporary effects.")
            return
        end
        do
            local i = 0
            while i < effectsList.Size do
                local effect = effectsList:Get(i)
                if effect ~= nil then
                    log(
                        nil,
                        (tostring(i + 1) .. " - ") .. effect.Item.Name
                    )
                end
                i = i + 1
            end
        end
        print("Logged the player's effects to the \"log.txt\" file.")
    end
)
functionMap:set(
    "error",
    function(____, _params)
        IAMERROR(nil)
    end
)
functionMap:set(
    "getedenseed",
    function(____, _params)
        print("The seed to check for a fully-unlocked save file is: " .. SAVE_FILE_SEED)
        local activeItemName = g.itemConfig:GetCollectible(EDEN_ACTIVE_ITEM).Name
        print("Eden should start with an active item of: " .. activeItemName)
        local passiveItemName = g.itemConfig:GetCollectible(EDEN_PASSIVE_ITEM).Name
        print("Eden should start with a passive item of: " .. passiveItemName)
    end
)
functionMap:set(
    "help",
    function(____, _params)
        commands(nil, functionMap)
    end
)
functionMap:set(
    "iamerror",
    function(____, _params)
        IAMERROR(nil)
    end
)
functionMap:set(
    "key",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:AddKeys(1)
        end
    end
)
functionMap:set(
    "keys",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:AddKeys(99)
        end
    end
)
functionMap:set(
    "list",
    function(____, _params)
        log(nil, "Entities in the room:")
        local roomEntities = Isaac.GetRoomEntities()
        do
            local i = 0
            while i < #roomEntities do
                local entity = roomEntities[i + 1]
                local debugString = (((((tostring(i + 1) .. "  - ") .. tostring(entity.Type)) .. ".") .. tostring(entity.Variant)) .. ".") .. tostring(entity.SubType)
                local npc = entity:ToNPC()
                if npc ~= nil then
                    debugString = tostring(debugString) .. ("." .. tostring(npc.State))
                end
                debugString = tostring(debugString) .. ((" (InitSeed: " .. tostring(entity.InitSeed)) .. ")")
                log(nil, debugString)
                i = i + 1
            end
        end
        print("Logged the entities in the room to the \"log.txt\" file.")
    end
)
functionMap:set(
    "luck",
    function(____, _params)
        consoleCommand(nil, "debug 9")
    end
)
functionMap:set(
    "pills",
    function(____, _params)
        local pillNum = 1
        do
            local y = 0
            while y <= 6 do
                do
                    local x = 0
                    while x <= 12 do
                        if pillNum < PillColor.NUM_PILLS then
                            local pos = gridToPos(nil, x, y)
                            Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, pillNum, pos, Vector.Zero, nil)
                            pillNum = 1
                        end
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
    end
)
functionMap:set(
    "pos",
    function(____, _params)
        for ____, player in ipairs(
            getPlayers(nil)
        ) do
            print(
                ((("Player position: (" .. tostring(player.Position.X)) .. ", ") .. tostring(player.Position.Y)) .. ")"
            )
        end
    end
)
functionMap:set(
    "s",
    function(____, params)
        if params == "" then
            print("You must specify a stage number.")
            return
        end
        local finalCharacter = string.sub(params, -1)
        local stageString
        local stageType
        if (((finalCharacter == "a") or (finalCharacter == "b")) or (finalCharacter == "c")) or (finalCharacter == "d") then
            stageString = __TS__StringCharAt(params, #params - 2)
            stageType = finalCharacter
        else
            stageString = params
            stageType = ""
        end
        local stage = validateNumber(nil, stageString)
        if stage == nil then
            return
        end
        local minStage = 1
        local maxStage = 13
        if (stage < minStage) or (stage > maxStage) then
            print(
                ((("Invalid stage number; must be between " .. tostring(minStage)) .. " and ") .. tostring(maxStage)) .. "."
            )
            return
        end
        consoleCommand(
            nil,
            ("stage " .. tostring(stage)) .. stageType
        )
    end
)
functionMap:set(
    "shop",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:UseCard(Card.CARD_HERMIT)
        end
    end
)
functionMap:set(
    "sound",
    function(____, params)
        local soundEffect = validateNumber(nil, params)
        if soundEffect == nil then
            return
        end
        g.sfx:Play(soundEffect)
    end
)
functionMap:set(
    "sounds",
    function(____, _params)
        print("Printing out the currently playing sounds to the log.txt.")
        do
            local i = 0
            while i < SoundEffect.NUM_SOUND_EFFECTS do
                if g.sfx:IsPlaying(i) then
                    log(
                        nil,
                        "Currently playing sound effect: " .. tostring(i)
                    )
                end
                i = i + 1
            end
        end
    end
)
functionMap:set(
    "speed",
    function(____, _params)
        local player = Isaac.GetPlayer()
        g.run.debugSpeed = not g.run.debugSpeed
        local enabled = (g.run.debugSpeed and "Enabled") or "Disabled"
        print(enabled .. " max speed.")
        player:AddCollectible(CollectibleType.COLLECTIBLE_LORD_OF_THE_PIT)
    end
)
functionMap:set(
    "trap",
    function(____, _params)
        trapdoor(nil)
    end
)
functionMap:set(
    "trapdoor",
    function(____, _params)
        trapdoor(nil)
    end
)
functionMap:set(
    "treasure",
    function(____, _params)
        local player = Isaac.GetPlayer()
        if player ~= nil then
            player:UseCard(Card.CARD_STARS)
        end
    end
)
functionMap:set(
    "unseed",
    function(____, _params)
        g.seeds:Reset()
        consoleCommand(nil, "restart")
    end
)
functionMap:set(
    "version",
    function(____, _params)
        local msg = "Racing+ version: " .. VERSION
        log(nil, msg)
        print(msg)
    end
)
return ____exports
 end,
["callbacks.executeCmd"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____log = require("log")
local log = ____log.default
local ____executeCmdFunctions = require("callbacks.executeCmdFunctions")
local executeCmdFunctions = ____executeCmdFunctions.default
function ____exports.main(self, command, parameters)
    local debugString = "MC_EXECUTE_CMD - " .. command
    if parameters ~= "" then
        debugString = tostring(debugString) .. (" " .. parameters)
    end
    log(nil, debugString)
    local lowercaseCommand = string.lower(command)
    local executeCmdFunction = executeCmdFunctions:get(lowercaseCommand)
    if executeCmdFunction ~= nil then
        executeCmdFunction(nil, parameters)
    else
        print("Unknown Racing+ command.")
    end
end
return ____exports
 end,
["callbacks.getPillEffect"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local BANNED_PILLS = __TS__New(Map, {{PillEffect.PILLEFFECT_AMNESIA, PillEffect.PILLEFFECT_HORF}, {PillEffect.PILLEFFECT_QUESTIONMARK, PillEffect.PILLEFFECT_IM_EXCITED}})
function ____exports.main(self, pillEffect, _pillColor)
    local pillReplacement = BANNED_PILLS:get(pillEffect)
    if pillReplacement ~= nil then
        return pillReplacement
    end
    return nil
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.inputAction"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelState = ____enums.FastTravelState
function ____exports.disableInput(self)
    if not g.config.fastTravel then
        return nil
    end
    if g.run.fastTravel.state > FastTravelState.Disabled then
        return 0
    end
    return nil
end
return ____exports
 end,
["callbacks.getActionValueFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local fastTravelInputAction = require("features.optional.major.fastTravel.callbacks.inputAction")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    ButtonAction.ACTION_LEFT,
    function()
        return fastTravelInputAction:disableInput()
    end
)
functionMap:set(
    ButtonAction.ACTION_RIGHT,
    function()
        return fastTravelInputAction:disableInput()
    end
)
functionMap:set(
    ButtonAction.ACTION_UP,
    function()
        return fastTravelInputAction:disableInput()
    end
)
functionMap:set(
    ButtonAction.ACTION_DOWN,
    function()
        return fastTravelInputAction:disableInput()
    end
)
functionMap:set(
    ButtonAction.ACTION_SHOOTLEFT,
    function()
        return fastTravelInputAction:disableInput()
    end
)
functionMap:set(
    ButtonAction.ACTION_SHOOTRIGHT,
    function()
        return fastTravelInputAction:disableInput()
    end
)
functionMap:set(
    ButtonAction.ACTION_SHOOTUP,
    function()
        return fastTravelInputAction:disableInput()
    end
)
functionMap:set(
    ButtonAction.ACTION_SHOOTDOWN,
    function()
        return fastTravelInputAction:disableInput()
    end
)
return ____exports
 end,
["features.mandatory.switchForgotten"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.actionDrop(self)
    if g.run.switchForgotten then
        g.run.switchForgotten = false
        return true
    end
    return nil
end
return ____exports
 end,
["callbacks.isActionTriggeredFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local switchForgotten = require("features.mandatory.switchForgotten")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    ButtonAction.ACTION_DROP,
    function()
        return switchForgotten:actionDrop()
    end
)
return ____exports
 end,
["callbacks.inputAction"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____getActionValueFunctions = require("callbacks.getActionValueFunctions")
local getActionValueFunctions = ____getActionValueFunctions.default
local ____isActionTriggeredFunctions = require("callbacks.isActionTriggeredFunctions")
local isActionTriggeredFunctions = ____isActionTriggeredFunctions.default
local inputHookFunctionMap
function ____exports.main(self, entity, inputHook, buttonAction)
    local inputHookFunction = inputHookFunctionMap:get(inputHook)
    if inputHookFunction ~= nil then
        return inputHookFunction(nil, entity, buttonAction)
    end
    return nil
end
inputHookFunctionMap = __TS__New(Map)
inputHookFunctionMap:set(
    InputHook.IS_ACTION_TRIGGERED,
    function(____, entity, buttonAction)
        local isActionTriggeredFunction = isActionTriggeredFunctions:get(buttonAction)
        if isActionTriggeredFunction ~= nil then
            return isActionTriggeredFunction(nil, entity)
        end
        return nil
    end
)
inputHookFunctionMap:set(
    InputHook.GET_ACTION_VALUE,
    function(____, entity, buttonAction)
        local getActionValueFunction = getActionValueFunctions:get(buttonAction)
        if getActionValueFunction ~= nil then
            return getActionValueFunction(nil, entity)
        end
        return nil
    end
)
return ____exports
 end,
["features.optional.major.disableCurses"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.default(self)
    if not g.config.disableCurses then
        return nil
    end
    return LevelCurse.CURSE_NONE
end
return ____exports
 end,
["callbacks.postCurseEval"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____disableCurses = require("features.optional.major.disableCurses")
local disableCurses = ____disableCurses.default
function ____exports.main(self, curses)
    local newCurses = disableCurses(nil)
    if newCurses ~= nil then
        return newCurses
    end
    return curses
end
return ____exports
 end,
["features.mandatory.centerStart"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local movePlayersAndFamiliars = ____misc.movePlayersAndFamiliars
local distributeAround, pickUpTaintedForgotten
function ____exports.centerPlayers(self)
    local isGreedMode = g.g:IsGreedMode()
    local centerPos = g.r:GetCenterPos()
    if isGreedMode then
        return
    end
    movePlayersAndFamiliars(nil, centerPos)
    local players = getPlayers(nil, true)
    if #players > 1 then
        local distanceBetweenPlayers = 50
        local positions = distributeAround(nil, centerPos, distanceBetweenPlayers, #players)
        do
            local i = 0
            while i < #players do
                players[i + 1].Position = positions[i + 1]
                i = i + 1
            end
        end
    end
end
function distributeAround(self, centerPos, distance, numPoints)
    local positions = {}
    local leftOfCenter = Vector(-distance, 0)
    do
        local i = 0
        while i < numPoints do
            local rotatedPosition = leftOfCenter:Rotated((i * 360) / numPoints)
            local positionFromCenter = centerPos + rotatedPosition
            __TS__ArrayPush(positions, positionFromCenter)
            i = i + 1
        end
    end
    return positions
end
function pickUpTaintedForgotten(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local character = player:GetPlayerType()
        if character == PlayerType.PLAYER_THESOUL_B then
            local taintedForgotten = player:GetOtherTwin()
            player:TryHoldEntity(taintedForgotten)
        end
    end
end
function ____exports.postGameStarted(self)
    ____exports.centerPlayers(nil)
    pickUpTaintedForgotten(nil)
end
function ____exports.poof01(self, effect)
    local gameFrameCount = g.g:GetFrameCount()
    if gameFrameCount == 0 then
        effect:Remove()
        effect.Visible = false
    end
end
return ____exports
 end,
["callbacks.postEffectInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local centerStart = require("features.mandatory.centerStart")
local changeCreepColor = require("features.optional.quality.changeCreepColor")
function ____exports.poof01(self, effect)
    centerStart:poof01(effect)
end
function ____exports.creepRed(self, effect)
    changeCreepColor:postEffectInitCreepRed(effect)
end
function ____exports.playerCreepGreen(self, effect)
    changeCreepColor:postEffectInitPlayerCreepGreen(effect)
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, ____exports.poof01, EffectVariant.POOF01)
    mod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, ____exports.creepRed, EffectVariant.CREEP_RED)
    mod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, ____exports.playerCreepGreen, EffectVariant.PLAYER_CREEP_GREEN)
end
return ____exports
 end,
["features.optional.major.fastTravel.state"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local anyPlayerCloserThan = ____misc.anyPlayerCloserThan
local ensureAllCases = ____misc.ensureAllCases
local ____constants = require("features.optional.major.fastTravel.constants")
local TRAPDOOR_BOSS_REACTION_FRAMES = ____constants.TRAPDOOR_BOSS_REACTION_FRAMES
local TRAPDOOR_OPEN_DISTANCE = ____constants.TRAPDOOR_OPEN_DISTANCE
local TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS = ____constants.TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelEntityState = ____enums.FastTravelEntityState
local FastTravelEntityType = ____enums.FastTravelEntityType
local setOpenClose, set, getIndex, shouldBeClosedFromStartingInRoomWithEnemies, playerCloseAfterBoss
function setOpenClose(self, isOpen, entity, fastTravelEntityType, initial)
    if initial == nil then
        initial = false
    end
    local state = (isOpen and FastTravelEntityState.Open) or FastTravelEntityState.Closed
    set(nil, entity, fastTravelEntityType, state)
    local sprite = entity:GetSprite()
    local animationPrefix = (isOpen and "Opened") or "Closed"
    if ((not initial) and (animationPrefix == "Opened")) and (fastTravelEntityType ~= FastTravelEntityType.HeavenDoor) then
        animationPrefix = "Open Animation"
    end
    local animation = animationPrefix .. " Custom"
    sprite:Play(animation, true)
end
function set(self, entity, fastTravelEntityType, state)
    local entityDescription = ____exports.getDescription(nil, entity, fastTravelEntityType)
    entityDescription.state = state
end
function ____exports.getDescription(self, entity, fastTravelEntityType)
    local index = getIndex(nil, entity, fastTravelEntityType)
    local description
    local ____switch15 = fastTravelEntityType
    if ____switch15 == FastTravelEntityType.Trapdoor then
        goto ____switch15_case_0
    elseif ____switch15 == FastTravelEntityType.Crawlspace then
        goto ____switch15_case_1
    elseif ____switch15 == FastTravelEntityType.HeavenDoor then
        goto ____switch15_case_2
    end
    goto ____switch15_case_default
    ::____switch15_case_0::
    do
        do
            description = g.run.room.fastTravel.trapdoors[index]
            goto ____switch15_end
        end
    end
    ::____switch15_case_1::
    do
        do
            description = g.run.room.fastTravel.crawlspaces[index]
            goto ____switch15_end
        end
    end
    ::____switch15_case_2::
    do
        do
            description = g.run.room.fastTravel.heavenDoors[index]
            goto ____switch15_end
        end
    end
    ::____switch15_case_default::
    do
        do
            ensureAllCases(nil, fastTravelEntityType)
        end
    end
    ::____switch15_end::
    if description == nil then
        __TS__OptionalMethodCall(g.sandbox, "traceback")
        error(
            (("Failed to get a " .. FastTravelEntityType[fastTravelEntityType]) .. " fast-travel entity description for index: ") .. tostring(index)
        )
    end
    return description
end
function getIndex(self, entity, fastTravelEntityType)
    local ____switch22 = fastTravelEntityType
    if ____switch22 == FastTravelEntityType.Trapdoor then
        goto ____switch22_case_0
    elseif ____switch22 == FastTravelEntityType.Crawlspace then
        goto ____switch22_case_1
    elseif ____switch22 == FastTravelEntityType.HeavenDoor then
        goto ____switch22_case_2
    end
    goto ____switch22_case_default
    ::____switch22_case_0::
    do
        do
            local gridEntity = entity
            return gridEntity:GetGridIndex()
        end
    end
    ::____switch22_case_1::
    do
        do
            local gridEntity = entity
            return gridEntity:GetGridIndex()
        end
    end
    ::____switch22_case_2::
    do
        do
            return g.r:GetGridIndex(entity.Position)
        end
    end
    ::____switch22_case_default::
    do
        do
            ensureAllCases(nil, fastTravelEntityType)
            return -1
        end
    end
    ::____switch22_end::
end
function shouldBeClosedFromStartingInRoomWithEnemies(self, initial)
    return initial and (not g.r:IsClear())
end
function playerCloseAfterBoss(self, position)
    if ((g.r:GetType() ~= RoomType.ROOM_BOSS) or (g.run.room.clearFrame == -1)) or (g.g:GetFrameCount() >= (g.run.room.clearFrame + TRAPDOOR_BOSS_REACTION_FRAMES)) then
        return false
    end
    return anyPlayerCloserThan(nil, position, TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS)
end
function ____exports.open(self, entity, fastTravelEntityType, initial)
    if initial == nil then
        initial = false
    end
    setOpenClose(nil, true, entity, fastTravelEntityType, initial)
end
function ____exports.close(self, entity, fastTravelEntityType)
    setOpenClose(nil, false, entity, fastTravelEntityType)
end
function ____exports.get(self, entity, fastTravelEntityType)
    local entityDescription = ____exports.getDescription(nil, entity, fastTravelEntityType)
    return entityDescription.state
end
function ____exports.initDescription(self, entity, fastTravelEntityType)
    local roomFrameCount = g.r:GetFrameCount()
    local index = getIndex(nil, entity, fastTravelEntityType)
    local description = {initial = roomFrameCount == 0, state = FastTravelEntityState.Open}
    local ____switch9 = fastTravelEntityType
    if ____switch9 == FastTravelEntityType.Trapdoor then
        goto ____switch9_case_0
    elseif ____switch9 == FastTravelEntityType.Crawlspace then
        goto ____switch9_case_1
    elseif ____switch9 == FastTravelEntityType.HeavenDoor then
        goto ____switch9_case_2
    end
    goto ____switch9_case_default
    ::____switch9_case_0::
    do
        do
            g.run.room.fastTravel.trapdoors[index] = description
            goto ____switch9_end
        end
    end
    ::____switch9_case_1::
    do
        do
            g.run.room.fastTravel.crawlspaces[index] = description
            goto ____switch9_end
        end
    end
    ::____switch9_case_2::
    do
        do
            g.run.room.fastTravel.heavenDoors[index] = description
            goto ____switch9_end
        end
    end
    ::____switch9_case_default::
    do
        do
            ensureAllCases(nil, fastTravelEntityType)
        end
    end
    ::____switch9_end::
end
function ____exports.shouldOpen(self, entity, fastTravelEntityType)
    local entityDescription = ____exports.getDescription(nil, entity, fastTravelEntityType)
    return ((not anyPlayerCloserThan(nil, entity.Position, TRAPDOOR_OPEN_DISTANCE)) and (not playerCloseAfterBoss(nil, entity.Position))) and (not shouldBeClosedFromStartingInRoomWithEnemies(nil, entityDescription.initial))
end
return ____exports
 end,
["features.optional.major.fastTravel.fastTravel"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local ensureAllCases = ____misc.ensureAllCases
local getRoomIndex = ____misc.getRoomIndex
local isAntibirthStage = ____misc.isAntibirthStage
local ____constants = require("features.optional.major.fastTravel.constants")
local TRAPDOOR_TOUCH_DISTANCE = ____constants.TRAPDOOR_TOUCH_DISTANCE
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelEntityState = ____enums.FastTravelEntityState
local FastTravelEntityType = ____enums.FastTravelEntityType
local FastTravelState = ____enums.FastTravelState
local state = require("features.optional.major.fastTravel.state")
local getCustomSpriteFilename
function getCustomSpriteFilename(self, fastTravelEntityType)
    local isGreedMode = g.g:IsGreedMode()
    local stage = g.l:GetStage()
    local roomIndex = getRoomIndex(nil)
    local antibirthStage = isAntibirthStage(nil)
    local ____switch8 = fastTravelEntityType
    if ____switch8 == FastTravelEntityType.Trapdoor then
        goto ____switch8_case_0
    elseif ____switch8 == FastTravelEntityType.Crawlspace then
        goto ____switch8_case_1
    elseif ____switch8 == FastTravelEntityType.HeavenDoor then
        goto ____switch8_case_2
    end
    goto ____switch8_case_default
    ::____switch8_case_0::
    do
        do
            if roomIndex == GridRooms.ROOM_BLUE_WOOM_IDX then
                return "gfx/grid/door_11_wombhole_blue_custom.anm2"
            end
            if roomIndex == GridRooms.ROOM_THE_VOID_IDX then
                return "gfx/grid/voidtrapdoor.anm2"
            end
            if roomIndex == GridRooms.ROOM_SECRET_EXIT_IDX then
                if (not antibirthStage) and ((stage == 1) or (stage == 2)) then
                    return "gfx/grid/trapdoor_downpour_custom.anm2"
                end
                if (antibirthStage and (stage == 2)) or ((not antibirthStage) and ((stage == 3) or (stage == 4))) then
                    return "gfx/grid/trapdoor_mines_custom.anm2"
                end
                if (antibirthStage and (stage == 4)) or ((not antibirthStage) and (stage == 6)) then
                    return "gfx/grid/trapdoor_mausoleum_custom.anm2"
                end
            end
            if ((antibirthStage and (stage == 6)) and g.g:GetStateFlag(GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED)) or (antibirthStage and (stage == 7)) then
                return "gfx/grid/door_11_corpsehole_custom.anm2"
            end
            if (isGreedMode and (stage == 3)) or ((not isGreedMode) and ((stage == 6) or (stage == 7))) then
                return "gfx/grid/door_11_wombhole_custom.anm2"
            end
            return "gfx/grid/door_11_trapdoor_custom.anm2"
        end
    end
    ::____switch8_case_1::
    do
        do
            return "gfx/grid/door_20_secrettrapdoor_custom.anm2"
        end
    end
    ::____switch8_case_2::
    do
        do
            return "gfx/1000.039_heaven door custom.anm2"
        end
    end
    ::____switch8_case_default::
    do
        do
            ensureAllCases(nil, fastTravelEntityType)
            return ""
        end
    end
    ::____switch8_end::
end
function ____exports.canInteractWith(self, player)
    local sprite = player:GetSprite()
    return ((not player:IsHoldingItem()) and (not sprite:IsPlaying("Happy"))) and (not sprite:IsPlaying("Jump"))
end
function ____exports.init(self, entity, fastTravelEntityType, shouldSpawnOpen)
    local gameFrameCount = g.g:GetFrameCount()
    local roomFrameCount = g.r:GetFrameCount()
    local sprite = entity:GetSprite()
    local fileName = sprite:GetFilename()
    local customFileName = getCustomSpriteFilename(nil, fastTravelEntityType)
    if fileName == customFileName then
        return
    end
    log(
        nil,
        (("Initializing a type " .. tostring(fastTravelEntityType)) .. " Fast-Travel entity on frame: ") .. tostring(gameFrameCount)
    )
    sprite:Load(customFileName, true)
    state:initDescription(entity, fastTravelEntityType)
    if shouldSpawnOpen(nil, entity) then
        state:open(entity, fastTravelEntityType, true)
    else
        state:close(entity, fastTravelEntityType)
    end
    if fastTravelEntityType == FastTravelEntityType.HeavenDoor then
        local effect = entity
        local data = effect:GetData()
        data.onInitialRoom = roomFrameCount == 0
    end
end
function ____exports.checkShouldOpen(self, entity, fastTravelEntityType)
    local entityState = state:get(entity, fastTravelEntityType)
    if (entityState == FastTravelEntityState.Closed) and state:shouldOpen(entity, fastTravelEntityType) then
        state:open(entity, fastTravelEntityType)
    end
end
function ____exports.checkPlayerTouched(self, entity, fastTravelEntityType, touchedFunction)
    if g.run.fastTravel.state ~= FastTravelState.Disabled then
        return
    end
    local entityState = state:get(entity, fastTravelEntityType)
    if entityState == FastTravelEntityState.Closed then
        return
    end
    local playersTouching = Isaac.FindInRadius(entity.Position, TRAPDOOR_TOUCH_DISTANCE, EntityPartition.PLAYER)
    for ____, playerEntity in ipairs(playersTouching) do
        local player = playerEntity:ToPlayer()
        if (player ~= nil) and ____exports.canInteractWith(nil, player) then
            touchedFunction(nil, entity, player)
            return
        end
    end
end
return ____exports
 end,
["features.optional.major.fastTravel.blackSprite"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local initSprite = ____misc.initSprite
local ____constants = require("features.optional.major.fastTravel.constants")
local FADE_TO_BLACK_FRAMES = ____constants.FADE_TO_BLACK_FRAMES
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelState = ____enums.FastTravelState
local sprite = initSprite(nil, "gfx/black.anm2")
function ____exports.draw(self)
    if g.run.fastTravel.state == FastTravelState.Disabled then
        return
    end
    if g.run.fastTravel.state == FastTravelState.FadingToBlack then
        local opacity = g.run.fastTravel.framesPassed / FADE_TO_BLACK_FRAMES
        sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0)
    elseif g.run.fastTravel.state == FastTravelState.FadingIn then
        local opacity = 1 - (g.run.fastTravel.framesPassed / FADE_TO_BLACK_FRAMES)
        sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0)
    end
    sprite:RenderLayer(0, Vector.Zero)
end
function ____exports.setFullyOpaque(self)
    local opacity = 1
    sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0)
end
function ____exports.setFullyTransparent(self)
    local opacity = 0
    sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0)
end
return ____exports
 end,
["features.optional.major.fastTravel.nextFloor"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local isAntibirthStage = ____misc.isAntibirthStage
local getNextStage, getNextStageType, getStageType, getStageTypeAntibirth, travelStage
function getNextStage(self)
    local stage = g.l:GetStage()
    local antibirthStage = isAntibirthStage(nil)
    if g.g:GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH) then
        if stage == 1 then
            return 13
        end
        if (stage == 6) and antibirthStage then
            return stage
        end
        return stage - 1
    end
    if g.run.fastTravel.blueWomb then
        return 9
    end
    if g.run.fastTravel.theVoid then
        return 12
    end
    if g.run.fastTravel.antibirthSecretExit then
        if antibirthStage then
            return stage + 1
        end
        return stage
    end
    if (antibirthStage and (stage == 6)) and g.g:GetStateFlag(GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED) then
        return stage + 1
    end
    if antibirthStage and (((stage == 2) or (stage == 4)) or (stage == 6)) then
        return stage + 2
    end
    if stage == 8 then
        return 10
    end
    if stage == 11 then
        return 11
    end
    if stage == 12 then
        return 12
    end
    return stage + 1
end
function getNextStageType(self, stage, nextStage, upwards)
    local stageType = g.l:GetStageType()
    local antibirthStage = isAntibirthStage(nil)
    if g.run.fastTravel.antibirthSecretExit then
        return getStageTypeAntibirth(nil, nextStage)
    end
    if antibirthStage and ((((stage == 1) or (stage == 3)) or (stage == 5)) or (stage == 7)) then
        return getStageTypeAntibirth(nil, nextStage)
    end
    if (antibirthStage and (stage == 6)) and g.g:GetStateFlag(GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED) then
        return getStageTypeAntibirth(nil, nextStage)
    end
    if nextStage == 9 then
        return 0
    end
    if nextStage == 10 then
        if upwards then
            return 1
        end
        return 0
    end
    if nextStage == 11 then
        if stageType == 0 then
            return 0
        end
        return 1
    end
    return getStageType(nil, nextStage)
end
function getStageType(self, stage)
    local stageSeed = g.seeds:GetStageSeed(stage)
    if (stageSeed % 2) == 0 then
        return StageType.STAGETYPE_WOTL
    end
    if (stageSeed % 3) == 0 then
        return StageType.STAGETYPE_AFTERBIRTH
    end
    return StageType.STAGETYPE_ORIGINAL
end
function getStageTypeAntibirth(self, stage)
    if (stage == 7) or (stage == 8) then
        return StageType.STAGETYPE_REPENTANCE
    end
    local stageSeed = g.seeds:GetStageSeed(stage + 1)
    local halfStageSeed = math.floor(stageSeed / 2)
    if (halfStageSeed % 2) == 0 then
        return StageType.STAGETYPE_REPENTANCE_B
    end
    return StageType.STAGETYPE_REPENTANCE
end
function travelStage(self, stage, stageType)
    local command = "stage " .. tostring(stage)
    if stageType == StageType.STAGETYPE_WOTL then
        command = tostring(command) .. "a"
    elseif stageType == StageType.STAGETYPE_AFTERBIRTH then
        command = tostring(command) .. "b"
    elseif stageType == StageType.STAGETYPE_REPENTANCE then
        command = tostring(command) .. "c"
    elseif stageType == StageType.STAGETYPE_REPENTANCE_B then
        command = tostring(command) .. "d"
    end
    consoleCommand(nil, command)
    if g.run.fastTravel.reseed then
        g.run.fastTravel.reseed = false
        consoleCommand(nil, "reseed")
    end
end
____exports["goto"] = function(self, upwards)
    local stage = g.l:GetStage()
    local nextStage = getNextStage(nil)
    local nextStageType = getNextStageType(nil, stage, nextStage, upwards)
    g.run.fastTravel.reseed = (stage == nextStage) and (not g.run.fastTravel.antibirthSecretExit)
    if not g.run.level.fastTravel.tookDamage then
        g.g:AddStageWithoutDamage()
        Isaac.DebugString("Finished this floor without taking any damage.")
    else
        Isaac.DebugString("Finished this floor with damage taken.")
    end
    travelStage(nil, nextStage, nextStageType)
end
return ____exports
 end,
["features.optional.major.fastTravel.setNewState"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local changeRoom = ____misc.changeRoom
local getPlayers = ____misc.getPlayers
local getRoomIndex = ____misc.getRoomIndex
local isAntibirthStage = ____misc.isAntibirthStage
local moveEsauNextToJacob = ____misc.moveEsauNextToJacob
local ____enums = require("types.enums")
local EffectVariantCustom = ____enums.EffectVariantCustom
local blackSprite = require("features.optional.major.fastTravel.blackSprite")
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelState = ____enums.FastTravelState
local nextFloor = require("features.optional.major.fastTravel.nextFloor")
local setPlayerAttributes, movePlayerToTrapdoor, shouldMoveTaintedSoul, warpForgottenBody, dropTaintedForgotten, playTravellingAnimation, setChangingToNewRoom, setGoingToNewFloor, setFadingIn, adjustJacobAndEsau, adjustTaintedForgotten, spawnHoles, setDisabled
function setPlayerAttributes(self, playerTouchedTrapdoor, position)
    movePlayerToTrapdoor(nil, playerTouchedTrapdoor, position)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        player.Velocity = Vector.Zero
        player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
    end
end
function movePlayerToTrapdoor(self, player, position)
    local shouldMoveOther = shouldMoveTaintedSoul(nil, player)
    player.Position = position
    if shouldMoveOther then
        local taintedSoul = player:GetOtherTwin()
        taintedSoul.Position = position
    end
end
function shouldMoveTaintedSoul(self, player)
    local character = player:GetPlayerType()
    if character == PlayerType.PLAYER_THEFORGOTTEN_B then
        local taintedSoul = player:GetOtherTwin()
        return (player.Position.X == taintedSoul.Position.X) and (player.Position.Y == taintedSoul.Position.Y)
    end
    return false
end
function warpForgottenBody(self, player)
    if player:GetPlayerType() ~= PlayerType.PLAYER_THESOUL then
        return
    end
    g.run.switchForgotten = true
    local forgottenBodies = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.FORGOTTEN_BODY)
    for ____, forgottenBody in ipairs(forgottenBodies) do
        forgottenBody.Position = player.Position
    end
end
function dropTaintedForgotten(self, player)
    local character = player:GetPlayerType()
    if character == PlayerType.PLAYER_THEFORGOTTEN_B then
        local taintedSoul = player:GetOtherTwin()
        taintedSoul:ThrowHeldEntity(Vector.Zero)
    end
end
function playTravellingAnimation(self, player, upwards)
    local character = player:GetPlayerType()
    local animation
    if upwards then
        animation = "LightTravelCustom"
    else
        animation = "TrapdoorCustom"
    end
    player:PlayExtraAnimation(animation)
    if character == PlayerType.PLAYER_THEFORGOTTEN_B then
        local taintedSoul = player:GetOtherTwin()
        if (player.Position.X == taintedSoul.Position.X) and (player.Position.Y == taintedSoul.Position.Y) then
            taintedSoul.Visible = false
        end
    end
end
function setChangingToNewRoom(self)
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    blackSprite:setFullyOpaque()
    changeRoom(nil, startingRoomIndex)
end
function setGoingToNewFloor(self)
    nextFloor["goto"](nextFloor, g.run.fastTravel.upwards)
end
function setFadingIn(self)
    local players = getPlayers(nil)
    g.run.fastTravel.framesPassed = 0
    adjustJacobAndEsau(nil, players)
    adjustTaintedForgotten(nil, players)
    spawnHoles(nil, players)
    ____exports.setPlayersVisible(nil, players, false)
end
function adjustJacobAndEsau(self, players)
    if #players ~= 2 then
        return
    end
    local centerPos = g.r:GetCenterPos()
    local jacobs = Isaac.FindByType(EntityType.ENTITY_PLAYER, 0, PlayerType.PLAYER_JACOB)
    for ____, jacob in ipairs(jacobs) do
        jacob.Position = centerPos
    end
    moveEsauNextToJacob(nil)
end
function adjustTaintedForgotten(self, players)
    if #players ~= 2 then
        return
    end
    local centerPos = g.r:GetCenterPos()
    local taintedForgottens = Isaac.FindByType(EntityType.ENTITY_PLAYER, 0, PlayerType.PLAYER_THEFORGOTTEN_B)
    for ____, taintedForgotten in ipairs(taintedForgottens) do
        local player = taintedForgotten:ToPlayer()
        if player ~= nil then
            taintedForgotten.Position = centerPos
            local taintedSoul = player:GetOtherTwin()
            taintedSoul.Position = centerPos
        end
    end
end
function spawnHoles(self, players)
    for ____, player in ipairs(players) do
        Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariantCustom.PITFALL_CUSTOM, 0, player.Position, Vector.Zero, nil)
    end
end
function ____exports.setPlayersVisible(self, players, visible)
    for ____, player in ipairs(players) do
        player.Visible = visible
    end
end
function setDisabled(self)
    blackSprite:setFullyTransparent()
end
function ____exports.default(self, fastTravelState)
    g.run.fastTravel.state = fastTravelState
    local ____switch3 = fastTravelState
    if ____switch3 == FastTravelState.FadingToBlack then
        goto ____switch3_case_0
    elseif ____switch3 == FastTravelState.ChangingToSameRoom then
        goto ____switch3_case_1
    elseif ____switch3 == FastTravelState.GoingToNewFloor then
        goto ____switch3_case_2
    elseif ____switch3 == FastTravelState.FadingIn then
        goto ____switch3_case_3
    elseif ____switch3 == FastTravelState.Disabled then
        goto ____switch3_case_4
    end
    goto ____switch3_case_default
    ::____switch3_case_0::
    do
        do
            goto ____switch3_end
        end
    end
    ::____switch3_case_1::
    do
        do
            setChangingToNewRoom(nil)
            goto ____switch3_end
        end
    end
    ::____switch3_case_2::
    do
        do
            setGoingToNewFloor(nil)
            goto ____switch3_end
        end
    end
    ::____switch3_case_3::
    do
        do
            setFadingIn(nil)
            goto ____switch3_end
        end
    end
    ::____switch3_case_4::
    do
        do
            setDisabled(nil)
            goto ____switch3_end
        end
    end
    ::____switch3_case_default::
    do
        do
            goto ____switch3_end
        end
    end
    ::____switch3_end::
end
function ____exports.setFadingToBlack(self, entity, player, upwards)
    local stage = g.l:GetStage()
    local roomIndex = getRoomIndex(nil)
    local antibirthStage = isAntibirthStage(nil)
    g.run.fastTravel.state = FastTravelState.FadingToBlack
    g.run.fastTravel.framesPassed = 0
    g.run.fastTravel.upwards = upwards
    g.run.fastTravel.blueWomb = roomIndex == GridRooms.ROOM_BLUE_WOOM_IDX
    g.run.fastTravel.theVoid = roomIndex == GridRooms.ROOM_THE_VOID_IDX
    g.run.fastTravel.antibirthSecretExit = roomIndex == GridRooms.ROOM_SECRET_EXIT_IDX
    if ((not antibirthStage) and (stage == 6)) and (roomIndex == GridRooms.ROOM_SECRET_EXIT_IDX) then
        g.g:SetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH_INIT, true)
    end
    setPlayerAttributes(nil, player, entity.Position)
    warpForgottenBody(nil, player)
    dropTaintedForgotten(nil, player)
    playTravellingAnimation(nil, player, upwards)
end
return ____exports
 end,
["features.optional.major.fastTravel.heavenDoor"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelEntityState = ____enums.FastTravelEntityState
local FastTravelEntityType = ____enums.FastTravelEntityType
local fastTravel = require("features.optional.major.fastTravel.fastTravel")
local ____setNewState = require("features.optional.major.fastTravel.setNewState")
local setFadingToBlack = ____setNewState.setFadingToBlack
local state = require("features.optional.major.fastTravel.state")
local FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen, touched, openClosedHeavenDoors
function shouldSpawnOpen(self)
    return g.r:IsClear()
end
function touched(self, entity, player)
    local entityDescription = state:getDescription(entity, FAST_TRAVEL_ENTITY_TYPE)
    local effect = entity
    if (not entityDescription.initial) and (effect.FrameCount < 40) then
        return
    end
    setFadingToBlack(nil, entity, player, true)
end
function openClosedHeavenDoors(self)
    local heavenDoors = Isaac.FindByType(EntityType.ENTITY_EFFECT, EffectVariant.HEAVEN_LIGHT_DOOR)
    for ____, entity in ipairs(heavenDoors) do
        local effect = entity:ToEffect()
        if effect ~= nil then
            local entityState = state:get(effect, FAST_TRAVEL_ENTITY_TYPE)
            if entityState == FastTravelEntityState.Closed then
                state:open(effect, FAST_TRAVEL_ENTITY_TYPE)
            end
        end
    end
end
FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.HeavenDoor
function ____exports.postEffectUpdate(self, effect)
    effect.State = 0
    fastTravel:init(effect, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen)
    fastTravel:checkPlayerTouched(effect, FAST_TRAVEL_ENTITY_TYPE, touched)
end
function ____exports.postRoomClear(self)
    openClosedHeavenDoors(nil)
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.postEffectUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local heavenDoor = require("features.optional.major.fastTravel.heavenDoor")
function ____exports.heavenLightDoor(self, effect)
    if not g.config.fastTravel then
        return
    end
    if effect.SubType == 0 then
        heavenDoor:postEffectUpdate(effect)
    end
end
return ____exports
 end,
["callbacks.postEffectUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fastTravelPostEffectUpdate = require("features.optional.major.fastTravel.callbacks.postEffectUpdate")
function ____exports.heavenLightDoor(self, effect)
    fastTravelPostEffectUpdate:heavenLightDoor(effect)
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE, ____exports.heavenLightDoor, EffectVariant.HEAVEN_LIGHT_DOOR)
end
return ____exports
 end,
["features.optional.bosses.fadeBosses"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local FADE_AMOUNT = 0.4
local FADE_COLOR = Color(1, 1, 1, FADE_AMOUNT, 0, 0, 0)
local MULTI_SEGMENT_BOSSES = {EntityType.ENTITY_LARRYJR, EntityType.ENTITY_PIN, EntityType.ENTITY_GEMINI, EntityType.ENTITY_HEART_OF_INFAMY}
function ____exports.postEntityKill(self, entity)
    if not g.config.fadeBosses then
        return
    end
    local npc = entity:ToNPC()
    if (npc == nil) or (not npc:IsBoss()) then
        return
    end
    if __TS__ArrayIncludes(MULTI_SEGMENT_BOSSES, entity.Type) then
        return
    end
    entity:SetColor(FADE_COLOR, 1000, 0, true, true)
end
return ____exports
 end,
["features.optional.major.fastClear.util"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.deleteDyingEntity(self, entityType, entityVariant, deathAnimationLength)
    local gameFrameCount = g.g:GetFrameCount()
    local entities = Isaac.FindByType(entityType, entityVariant)
    for ____, entity in ipairs(entities) do
        local data = entity:GetData()
        local killedFrame = data.killedFrame
        if (killedFrame ~= nil) and (gameFrameCount >= ((killedFrame + deathAnimationLength) - 1)) then
            entity:Remove()
        end
    end
end
function ____exports.getItemDropPosition(self, npc)
    local gridIndex = g.r:GetGridIndex(npc.Position)
    local gridEntity = g.r:GetGridEntity(gridIndex)
    return ((gridEntity == nil) and npc.Position) or g.r:FindFreePickupSpawnPosition(npc.Position)
end
return ____exports
 end,
["features.optional.major.fastClear.angels"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local anyPlayerHasCollectible = ____misc.anyPlayerHasCollectible
local anyPlayerHasTrinket = ____misc.anyPlayerHasTrinket
local ____util = require("features.optional.major.fastClear.util")
local deleteDyingEntity = ____util.deleteDyingEntity
local getItemDropPosition = ____util.getItemDropPosition
local markDeathFrame, getKeySubType
function markDeathFrame(self, npc)
    local gameFrameCount = g.g:GetFrameCount()
    local data = npc:GetData()
    data.killedFrame = gameFrameCount
end
function ____exports.spawnKeyPiece(self, npc)
    local roomType = g.r:GetType()
    if ((roomType ~= RoomType.ROOM_SUPERSECRET) and (roomType ~= RoomType.ROOM_SACRIFICE)) and (roomType ~= RoomType.ROOM_ANGEL) then
        return
    end
    if (anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_KEY_PIECE_1) and anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_KEY_PIECE_2)) and (not anyPlayerHasTrinket(nil, TrinketType.TRINKET_FILIGREE_FEATHERS)) then
        return
    end
    g.g:Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        getItemDropPosition(nil, npc),
        Vector.Zero,
        nil,
        getKeySubType(nil, npc),
        npc.InitSeed
    )
end
function getKeySubType(self, npc)
    if anyPlayerHasTrinket(nil, TrinketType.TRINKET_FILIGREE_FEATHERS) then
        return CollectibleType.COLLECTIBLE_NULL
    end
    if (npc.Type == EntityType.ENTITY_URIEL) and (not anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_KEY_PIECE_1)) then
        return CollectibleType.COLLECTIBLE_KEY_PIECE_1
    end
    if (npc.Type == EntityType.ENTITY_GABRIEL) and (not anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_KEY_PIECE_2)) then
        return CollectibleType.COLLECTIBLE_KEY_PIECE_2
    end
    if anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_KEY_PIECE_1) then
        return CollectibleType.COLLECTIBLE_KEY_PIECE_2
    end
    if anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_KEY_PIECE_2) then
        return CollectibleType.COLLECTIBLE_KEY_PIECE_1
    end
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1
end
local DEATH_ANIMATION_LENGTH = 24
function ____exports.postUpdate(self)
    for ____, entityType in ipairs({EntityType.ENTITY_GABRIEL, EntityType.ENTITY_URIEL}) do
        deleteDyingEntity(nil, entityType, 0, DEATH_ANIMATION_LENGTH)
    end
end
function ____exports.postEntityKill(self, npc)
    markDeathFrame(nil, npc)
    ____exports.spawnKeyPiece(nil, npc)
end
return ____exports
 end,
["features.optional.major.fastClear.constants"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
____exports.FAST_CLEAR_WHITELIST = {EntityType.ENTITY_MONSTRO, EntityType.ENTITY_CHUB, EntityType.ENTITY_HOPPER, EntityType.ENTITY_GURDY, EntityType.ENTITY_MONSTRO2, EntityType.ENTITY_PEEP, EntityType.ENTITY_MOMS_HEART, EntityType.ENTITY_FALLEN, EntityType.ENTITY_SATAN, EntityType.ENTITY_MASK_OF_INFAMY, EntityType.ENTITY_HEART_OF_INFAMY, EntityType.ENTITY_GURDY_JR, EntityType.ENTITY_WIDOW, EntityType.ENTITY_DADDYLONGLEGS, EntityType.ENTITY_ISAAC, EntityType.ENTITY_GURGLING, EntityType.ENTITY_THE_HAUNT, EntityType.ENTITY_DINGLE, EntityType.ENTITY_MEGA_MAW, EntityType.ENTITY_GATE, EntityType.ENTITY_MEGA_FATTY, EntityType.ENTITY_CAGE, EntityType.ENTITY_MAMA_GURDY, EntityType.ENTITY_DARK_ONE, EntityType.ENTITY_ADVERSARY, EntityType.ENTITY_POLYCEPHALUS, EntityType.ENTITY_MR_FRED, EntityType.ENTITY_URIEL, EntityType.ENTITY_GABRIEL, EntityType.ENTITY_THE_LAMB, EntityType.ENTITY_MEGA_SATAN, EntityType.ENTITY_MEGA_SATAN_2, EntityType.ENTITY_STAIN, EntityType.ENTITY_FORSAKEN, EntityType.ENTITY_LITTLE_HORN, EntityType.ENTITY_RAG_MAN, EntityType.ENTITY_ULTRA_GREED, EntityType.ENTITY_HUSH, EntityType.ENTITY_SISTERS_VIS, EntityType.ENTITY_BIG_HORN, EntityType.ENTITY_REAP_CREEP, EntityType.ENTITY_RAINMAKER, EntityType.ENTITY_VISAGE, EntityType.ENTITY_SIREN, EntityType.ENTITY_HERETIC, EntityType.ENTITY_GIDEON, EntityType.ENTITY_BABY_PLUM, EntityType.ENTITY_SCOURGE, EntityType.ENTITY_MOTHER, EntityType.ENTITY_MIN_MIN, EntityType.ENTITY_CLOG, EntityType.ENTITY_SINGE, EntityType.ENTITY_BUMBINO, EntityType.ENTITY_COLOSTOMIA, EntityType.ENTITY_RAGLICH, EntityType.ENTITY_HORNY_BOYS, EntityType.ENTITY_CLUTCH, EntityType.ENTITY_DOGMA, EntityType.ENTITY_BEAST}
____exports.FAST_CLEAR_WHITELIST_WITH_SPECIFIC_VARIANT = {{EntityType.ENTITY_MOTHER, MotherVariant.PHASE_1}, {EntityType.ENTITY_ROTGUT, RotgutVariant.PHASE_1_HEAD}}
return ____exports
 end,
["features.optional.major.fastClear.krampus"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local anyPlayerHasCollectible = ____misc.anyPlayerHasCollectible
local getRandom = ____misc.getRandom
local ____util = require("features.optional.major.fastClear.util")
local deleteDyingEntity = ____util.deleteDyingEntity
local getItemDropPosition = ____util.getItemDropPosition
local markDeathFrame, getKrampusItemSubType, getKrampusBans
function markDeathFrame(self, npc)
    local gameFrameCount = g.g:GetFrameCount()
    local data = npc:GetData()
    data.killedFrame = gameFrameCount
end
function ____exports.spawnKrampusDrop(self, npc)
    g.g:Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        getItemDropPosition(nil, npc),
        Vector.Zero,
        nil,
        getKrampusItemSubType(nil),
        npc.InitSeed
    )
end
function getKrampusItemSubType(self)
    local startSeed = g.seeds:GetStartSeed()
    local coalBanned, headBanned = table.unpack(
        getKrampusBans(nil)
    )
    if coalBanned and headBanned then
        return g.itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, startSeed)
    end
    if coalBanned then
        return CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS
    end
    if headBanned then
        return CollectibleType.COLLECTIBLE_LUMP_OF_COAL
    end
    getRandom(nil, 1, 2, startSeed)
    local seededChoice = math.random(1, 2)
    local coal = seededChoice == 1
    if coal then
        return CollectibleType.COLLECTIBLE_LUMP_OF_COAL
    end
    return CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS
end
function getKrampusBans(self)
    local coalBanned = false
    local headBanned = false
    if anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_LUMP_OF_COAL) then
        coalBanned = true
    end
    if anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS) then
        headBanned = true
    end
    if (g.race.status == "in progress") and (g.race.myStatus == "racing") then
        if __TS__ArrayIncludes(g.race.startingItems, CollectibleType.COLLECTIBLE_LUMP_OF_COAL) then
            coalBanned = true
        end
        if __TS__ArrayIncludes(g.race.startingItems, CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS) then
            headBanned = true
        end
    end
    return {coalBanned, headBanned}
end
local DEATH_ANIMATION_LENGTH = 29
function ____exports.postUpdate(self)
    deleteDyingEntity(nil, EntityType.ENTITY_FALLEN, 1, DEATH_ANIMATION_LENGTH)
end
function ____exports.postEntityKill(self, npc)
    markDeathFrame(nil, npc)
    ____exports.spawnKrampusDrop(nil, npc)
end
return ____exports
 end,
["features.optional.major.fastClear.callbacks.postEntityKill"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local angels = require("features.optional.major.fastClear.angels")
local ____constants = require("features.optional.major.fastClear.constants")
local FAST_CLEAR_WHITELIST = ____constants.FAST_CLEAR_WHITELIST
local FAST_CLEAR_WHITELIST_WITH_SPECIFIC_VARIANT = ____constants.FAST_CLEAR_WHITELIST_WITH_SPECIFIC_VARIANT
local krampus = require("features.optional.major.fastClear.krampus")
local isWhitelistedNPC, getFinalFrame
function isWhitelistedNPC(self, npc)
    if __TS__ArrayIncludes(FAST_CLEAR_WHITELIST, npc.Type) then
        return true
    end
    for ____, ____value in ipairs(FAST_CLEAR_WHITELIST_WITH_SPECIFIC_VARIANT) do
        local entityType
        entityType = ____value[1]
        local entityVariant
        entityVariant = ____value[2]
        if (entityType == npc.Type) and (entityVariant == npc.Variant) then
            return true
        end
    end
    return false
end
function getFinalFrame(self, sprite)
    local currentFrame = sprite:GetFrame()
    sprite:SetLastFrame()
    local finalFrame = sprite:GetFrame()
    sprite:SetFrame(currentFrame)
    return finalFrame
end
function ____exports.main(self, entity)
    if not g.config.fastClear then
        return
    end
    local npc = entity:ToNPC()
    if npc == nil then
        return
    end
    if isWhitelistedNPC(nil, npc) then
        return
    end
    npc.CanShutDoors = false
    local sprite = npc:GetSprite()
    sprite:Play("Death", true)
    local finalFrame = getFinalFrame(nil, sprite)
    local data = npc:GetData()
    data.resetAttributeFrame = finalFrame
    if (npc.Type == EntityType.ENTITY_FALLEN) and (npc.Variant == 1) then
        krampus:postEntityKill(npc)
    elseif ((npc.Type == EntityType.ENTITY_URIEL) or (npc.Type == EntityType.ENTITY_GABRIEL)) and (entity.Variant == 0) then
        angels:postEntityKill(npc)
    end
end
return ____exports
 end,
["callbacks.postEntityKill"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fadeBosses = require("features.optional.bosses.fadeBosses")
local fastClearPostEntityKill = require("features.optional.major.fastClear.callbacks.postEntityKill")
function ____exports.main(self, entity)
    fastClearPostEntityKill:main(entity)
    fadeBosses:postEntityKill(entity)
end
return ____exports
 end,
["features.optional.graphics.paschalCandle"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local CUSTOM_ANM2_PATH = "gfx/003.221_paschal candle custom.anm2"
function ____exports.postFamiliarInit(self, familiar)
    if not g.config.paschalCandle then
        return
    end
    local sprite = familiar:GetSprite()
    local fileName = sprite:GetFilename()
    if fileName ~= CUSTOM_ANM2_PATH then
        sprite:Load(CUSTOM_ANM2_PATH, true)
    end
end
return ____exports
 end,
["callbacks.postFamiliarInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local pc = require("features.optional.graphics.paschalCandle")
function ____exports.paschalCandle(self, familiar)
    pc:postFamiliarInit(familiar)
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_FAMILIAR_INIT, ____exports.paschalCandle, FamiliarVariant.PASCHAL_CANDLE)
end
return ____exports
 end,
["callbacks.postFireTear"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local chaosCardTears
function chaosCardTears(self, tear)
    if g.run.debugChaosCard then
        tear:ChangeVariant(TearVariant.CHAOS_CARD)
    end
end
function ____exports.main(self, tear)
    chaosCardTears(nil, tear)
end
return ____exports
 end,
["features.mandatory.removeKarma"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
function ____exports.postGameStarted(self)
    g.itemPool:RemoveTrinket(TrinketType.TRINKET_KARMA)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        if player:HasTrinket(TrinketType.TRINKET_KARMA) then
            player:TryRemoveTrinket(TrinketType.TRINKET_KARMA)
        end
    end
end
return ____exports
 end,
["features.mandatory.removeMercurius"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
function ____exports.postGameStarted(self)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_MERCURIUS)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        if player:HasCollectible(CollectibleType.COLLECTIBLE_MERCURIUS) then
            player:RemoveCollectible(CollectibleType.COLLECTIBLE_MERCURIUS)
            player:AddCollectible(CollectibleType.COLLECTIBLE_SAD_ONION)
        end
    end
end
return ____exports
 end,
["features.mandatory.seededDrops"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local anyPlayerHasCollectible = ____misc.anyPlayerHasCollectible
local getTotalCollectibles = ____misc.getTotalCollectibles
local incrementRNG = ____misc.incrementRNG
local initRNG = ____misc.initRNG
local playingOnSetSeed = ____misc.playingOnSetSeed
local initVariables, removeSeededItemsTrinkets
function initVariables(self)
    local startSeed = g.seeds:GetStartSeed()
    g.run.seededDrops.roomClearAwardSeed = startSeed
    local rng = initRNG(nil, startSeed)
    do
        local i = 0
        while i < 500 do
            rng:Next()
            i = i + 1
        end
    end
    g.run.seededDrops.roomClearAwardSeedDevilAngel = rng:GetSeed()
end
function removeSeededItemsTrinkets(self)
    if playingOnSetSeed(nil) then
        g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_LUCKY_FOOT)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_DAEMONS_TAIL)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_CHILDS_HEART)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_RUSTED_KEY)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_MATCH_STICK)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_LUCKY_TOE)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_SAFETY_CAP)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_ACE_SPADES)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_WATCH_BATTERY)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_NUH_UH)
    end
end
function ____exports.shouldSpawnSeededDrop(self)
    local roomType = g.r:GetType()
    return (playingOnSetSeed(nil) and (roomType ~= RoomType.ROOM_BOSS)) and (roomType ~= RoomType.ROOM_DUNGEON)
end
function ____exports.spawn(self)
    local roomType = g.r:GetType()
    local centerPos = g.r:GetCenterPos()
    local seed
    if (roomType == RoomType.ROOM_DEVIL) or (roomType == RoomType.ROOM_ANGEL) then
        g.run.seededDrops.roomClearAwardSeedDevilAngel = incrementRNG(nil, g.run.seededDrops.roomClearAwardSeedDevilAngel)
        seed = g.run.seededDrops.roomClearAwardSeedDevilAngel
    else
        g.run.seededDrops.roomClearAwardSeed = incrementRNG(nil, g.run.seededDrops.roomClearAwardSeed)
        seed = g.run.seededDrops.roomClearAwardSeed
    end
    local rng = RNG()
    rng:SetSeed(seed, 35)
    local pickupPercent = rng:RandomFloat()
    local pickupVariant = PickupVariant.PICKUP_NULL
    if pickupPercent > 0.22 then
        if pickupPercent < 0.3 then
            if rng:RandomInt(3) == 0 then
                pickupVariant = PickupVariant.PICKUP_TAROTCARD
            elseif rng:RandomInt(2) == 0 then
                pickupVariant = PickupVariant.PICKUP_TRINKET
            else
                pickupVariant = PickupVariant.PICKUP_PILL
            end
        elseif pickupPercent < 0.45 then
            pickupVariant = PickupVariant.PICKUP_COIN
        elseif pickupPercent < 0.6 then
            pickupVariant = PickupVariant.PICKUP_HEART
        elseif pickupPercent < 0.8 then
            pickupVariant = PickupVariant.PICKUP_KEY
        elseif pickupPercent < 0.95 then
            pickupVariant = PickupVariant.PICKUP_BOMB
        else
            pickupVariant = PickupVariant.PICKUP_CHEST
        end
        if rng:RandomInt(20) == 0 then
            pickupVariant = PickupVariant.PICKUP_LIL_BATTERY
        end
        if rng:RandomInt(50) == 0 then
            pickupVariant = PickupVariant.PICKUP_GRAB_BAG
        end
    end
    local pickupCount = 1
    if anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW) and (pickupVariant ~= PickupVariant.PICKUP_TRINKET) then
        pickupCount = getTotalCollectibles(nil, CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW) + 1
        local nothingChance = 0.666 ~ pickupCount
        if (nothingChance * 0.5) > rng:RandomFloat() then
            pickupCount = 0
        end
    end
    if (g.g.Difficulty == Difficulty.DIFFICULTY_HARD) and (pickupVariant == PickupVariant.PICKUP_HEART) then
        if rng:RandomInt(100) >= 35 then
            pickupVariant = PickupVariant.PICKUP_NULL
        end
    end
    if pickupCount >= 1 then
        local numBrokenModems = getTotalCollectibles(nil, CollectibleType.COLLECTIBLE_BROKEN_MODEM)
        do
            local i = 0
            while i < numBrokenModems do
                if (rng:RandomInt(4) == 0) and (((((pickupVariant == PickupVariant.PICKUP_HEART) or (pickupVariant == PickupVariant.PICKUP_COIN)) or (pickupVariant == PickupVariant.PICKUP_KEY)) or (pickupVariant == PickupVariant.PICKUP_BOMB)) or (pickupVariant == PickupVariant.PICKUP_GRAB_BAG)) then
                    pickupCount = pickupCount + 1
                end
                i = i + 1
            end
        end
    end
    if (pickupCount > 0) and (pickupVariant ~= PickupVariant.PICKUP_NULL) then
        local subType = 0
        do
            local i = 1
            while i <= pickupCount do
                local pos = g.r:FindFreePickupSpawnPosition(centerPos, 0, true)
                local pickup = g.g:Spawn(
                    EntityType.ENTITY_PICKUP,
                    pickupVariant,
                    pos,
                    Vector.Zero,
                    nil,
                    subType,
                    rng:Next()
                )
                subType = pickup.SubType
                i = i + 1
            end
        end
    end
end
function ____exports.postGameStarted(self)
    initVariables(nil)
    removeSeededItemsTrinkets(nil)
end
return ____exports
 end,
["features.mandatory.seededFloors"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local playingOnSetSeed = ____misc.playingOnSetSeed
function ____exports.postGameStarted(self)
    if playingOnSetSeed(nil) then
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_SILVER_DOLLAR)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_BLOODY_CROWN)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_TELESCOPE_LENS)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_HOLY_CROWN)
        g.itemPool:RemoveTrinket(TrinketType.TRINKET_WICKED_CROWN)
    end
end
return ____exports
 end,
["features.optional.major.startWithD6"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local giveItemAndRemoveFromPools = ____misc.giveItemAndRemoveFromPools
local ____GlobalsRun = require("types.GlobalsRun")
local getPlayerLuaTableIndex = ____GlobalsRun.getPlayerLuaTableIndex
local TAINTED_CHARACTERS_WITH_POCKET_ACTIVES, TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES, shouldGetPocketActiveD6, givePocketActiveD6, giveActiveD6, checkGenesisRoom
function shouldGetPocketActiveD6(self, player)
    local character = player:GetPlayerType()
    local randomBaby = Isaac.GetPlayerTypeByName("Random Baby")
    if character == randomBaby then
        return true
    end
    return ((character >= PlayerType.PLAYER_ISAAC) and (character <= PlayerType.PLAYER_BETHANY)) or __TS__ArrayIncludes(TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES, character)
end
function ____exports.shouldGetActiveD6(self, player)
    local character = player:GetPlayerType()
    return (__TS__ArrayIncludes(TAINTED_CHARACTERS_WITH_POCKET_ACTIVES, character) or (character == PlayerType.PLAYER_JACOB)) or (character == PlayerType.PLAYER_ESAU)
end
function givePocketActiveD6(self, player, charge)
    player:SetPocketActiveItem(CollectibleType.COLLECTIBLE_D6, ActiveSlot.SLOT_POCKET)
    if charge ~= nil then
        player:SetActiveCharge(charge, ActiveSlot.SLOT_POCKET)
    end
end
function giveActiveD6(self, player)
    giveItemAndRemoveFromPools(nil, player, CollectibleType.COLLECTIBLE_D6)
end
function checkGenesisRoom(self)
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomType = g.r:GetType()
    if (roomType == RoomType.ROOM_ISAACS) and (roomDesc.Data.Variant == 1000) then
        for ____, player in ipairs(
            getPlayers(nil)
        ) do
            if shouldGetPocketActiveD6(nil, player) then
                givePocketActiveD6(nil, player)
            end
        end
    end
end
TAINTED_CHARACTERS_WITH_POCKET_ACTIVES = {PlayerType.PLAYER_MAGDALENA_B, PlayerType.PLAYER_CAIN_B, PlayerType.PLAYER_JUDAS_B, PlayerType.PLAYER_XXX_B, PlayerType.PLAYER_EVE_B, PlayerType.PLAYER_LAZARUS_B, PlayerType.PLAYER_APOLLYON_B, PlayerType.PLAYER_BETHANY_B, PlayerType.PLAYER_JACOB_B, PlayerType.PLAYER_LAZARUS2_B, PlayerType.PLAYER_JACOB2_B}
TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES = {PlayerType.PLAYER_ISAAC_B, PlayerType.PLAYER_SAMSON_B, PlayerType.PLAYER_AZAZEL_B, PlayerType.PLAYER_EDEN_B, PlayerType.PLAYER_THELOST_B, PlayerType.PLAYER_LILITH_B, PlayerType.PLAYER_KEEPER_B, PlayerType.PLAYER_THEFORGOTTEN_B, PlayerType.PLAYER_THESOUL_B}
function ____exports.postUpdate(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local index = getPlayerLuaTableIndex(nil, player)
        local pocketActiveCharge = player:GetActiveCharge(ActiveSlot.SLOT_POCKET)
        g.run.pocketActiveD6Charge[index] = pocketActiveCharge
    end
end
function ____exports.postGameStarted(self)
    if not g.config.startWithD6 then
        return
    end
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        if shouldGetPocketActiveD6(nil, player) then
            givePocketActiveD6(nil, player)
        elseif ____exports.shouldGetActiveD6(nil, player) then
            giveActiveD6(nil, player)
        end
    end
end
function ____exports.postNewRoom(self)
    checkGenesisRoom(nil)
end
function ____exports.postPlayerChange(self, player)
    if shouldGetPocketActiveD6(nil, player) then
        local index = getPlayerLuaTableIndex(nil, player)
        local charge = g.run.pocketActiveD6Charge[index]
        givePocketActiveD6(nil, player, charge)
        log(nil, "Awarded another pocket D6 (due to character change).")
    end
end
return ____exports
 end,
["features.optional.quality.judasAddBomb"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
function ____exports.postGameStarted(self)
    if not g.config.judasAddBomb then
        return
    end
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local character = player:GetPlayerType()
        if character == PlayerType.PLAYER_JUDAS then
            player:AddBombs(1)
        end
    end
end
return ____exports
 end,
["features.optional.quality.samsonDropHeart"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local gridToPos = ____misc.gridToPos
function ____exports.postGameStarted(self)
    if not g.config.samsonDropHeart then
        return
    end
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local character = player:GetPlayerType()
        if character == PlayerType.PLAYER_SAMSON then
            player:TryRemoveTrinket(TrinketType.TRINKET_CHILDS_HEART)
            local childsHeart = Isaac.Spawn(
                EntityType.ENTITY_PICKUP,
                PickupVariant.PICKUP_TRINKET,
                TrinketType.TRINKET_CHILDS_HEART,
                gridToPos(nil, 0, 6),
                Vector.Zero,
                player
            )
            childsHeart:GetSprite():Play("Idle", true)
        end
    end
end
return ____exports
 end,
["features.optional.quality.showEdenStartingItems"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getRoomIndex = ____misc.getRoomIndex
local initGlowingItemSprite = ____misc.initGlowingItemSprite
local SPRITE_X, SPRITE_Y, SPRITE_SPACING, drawItemSprites, setItemSprites, shouldShowSprites, storeItemIdentities, getEdenPassiveItem
function drawItemSprites(self)
    if g.run.slideAnimationHappening then
        return
    end
    if g.run.edenStartingItems.activeSprite ~= nil then
        local position = Vector(SPRITE_X, SPRITE_Y)
        g.run.edenStartingItems.activeSprite:RenderLayer(0, position)
    end
    if g.run.edenStartingItems.passiveSprite ~= nil then
        local position = Vector(SPRITE_X + SPRITE_SPACING, SPRITE_Y)
        g.run.edenStartingItems.passiveSprite:RenderLayer(0, position)
    end
end
function setItemSprites(self)
    if not shouldShowSprites(nil) then
        g.run.edenStartingItems.activeSprite = nil
        g.run.edenStartingItems.passiveSprite = nil
        return
    end
    if g.run.edenStartingItems.activeSprite == nil then
        g.run.edenStartingItems.activeSprite = initGlowingItemSprite(nil, g.run.edenStartingItems.active)
    end
    if g.run.edenStartingItems.passiveSprite == nil then
        g.run.edenStartingItems.passiveSprite = initGlowingItemSprite(nil, g.run.edenStartingItems.passive)
    end
end
function shouldShowSprites(self)
    local stage = g.l:GetStage()
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    local roomIndex = getRoomIndex(nil)
    return (((character == PlayerType.PLAYER_EDEN) or (character == PlayerType.PLAYER_EDEN_B)) and (stage == 1)) and (roomIndex == startingRoomIndex)
end
function storeItemIdentities(self)
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    if (character ~= PlayerType.PLAYER_EDEN) and (character ~= PlayerType.PLAYER_EDEN_B) then
        return
    end
    g.run.edenStartingItems.active = player:GetActiveItem(ActiveSlot.SLOT_PRIMARY)
    local passive = getEdenPassiveItem(nil, player)
    if passive == nil then
        error("Failed to find Eden's passive item.")
    end
    g.run.edenStartingItems.passive = passive
end
function getEdenPassiveItem(self, player)
    local activeItem = player:GetActiveItem(ActiveSlot.SLOT_PRIMARY)
    local highestCollectible = g.itemConfig:GetCollectibles().Size - 1
    do
        local i = 1
        while i <= highestCollectible do
            if (player:HasCollectible(i) and (i ~= activeItem)) and (i ~= CollectibleType.COLLECTIBLE_D6) then
                return i
            end
            i = i + 1
        end
    end
    return nil
end
SPRITE_X = 123
SPRITE_Y = 17
SPRITE_SPACING = 30
function ____exports.postRender(self)
    if not g.config.showEdenStartingItems then
        return
    end
    drawItemSprites(nil)
end
function ____exports.postNewRoom(self)
    if not g.config.showEdenStartingItems then
        g.run.edenStartingItems.activeSprite = nil
        g.run.edenStartingItems.passiveSprite = nil
        return
    end
    setItemSprites(nil)
end
function ____exports.postGameStarted(self)
    if not g.config.showEdenStartingItems then
        return
    end
    storeItemIdentities(nil)
end
return ____exports
 end,
["features.optional.quality.taintedKeeperMoney"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
function ____exports.postGameStarted(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local character = player:GetPlayerType()
        if character == PlayerType.PLAYER_KEEPER_B then
            player:AddCoins(15)
        end
    end
end
return ____exports
 end,
["features.race.tempMoreOptions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local isAntibirthStage = ____misc.isAntibirthStage
local removeItemFromItemTracker = ____misc.removeItemFromItemTracker
function ____exports.postNewLevel(self)
    local stage = g.l:GetStage()
    local player = Isaac.GetPlayer()
    if ((stage >= 2) or ((stage == 1) and isAntibirthStage(nil))) and g.run.removeMoreOptions then
        g.run.removeMoreOptions = false
        player:RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS)
    end
end
function ____exports.postNewRoom(self)
    local roomType = g.r:GetType()
    local player = Isaac.GetPlayer()
    if g.run.removeMoreOptions and (roomType == RoomType.ROOM_TREASURE) then
        g.run.removeMoreOptions = false
        player:RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS)
    end
end
function ____exports.give(self, player)
    if player:HasCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS) then
        return
    end
    player:AddCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS)
    removeItemFromItemTracker(nil, CollectibleType.COLLECTIBLE_MORE_OPTIONS)
    player:RemoveCostume(
        g.itemConfig:GetCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS)
    )
    g.run.removeMoreOptions = true
end
return ____exports
 end,
["features.race.callbacks.postGameStarted"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local giveItemAndRemoveFromPools = ____misc.giveItemAndRemoveFromPools
local playingOnSetSeed = ____misc.playingOnSetSeed
local ____enums = require("types.enums")
local CollectibleTypeCustom = ____enums.CollectibleTypeCustom
local ____startWithD6 = require("features.optional.major.startWithD6")
local shouldGetActiveD6 = ____startWithD6.shouldGetActiveD6
local ____constants = require("features.race.constants")
local COLLECTIBLE_13_LUCK_SERVER_ID = ____constants.COLLECTIBLE_13_LUCK_SERVER_ID
local COLLECTIBLE_15_LUCK_SERVER_ID = ____constants.COLLECTIBLE_15_LUCK_SERVER_ID
local placeLeft = require("features.race.placeLeft")
local raceRoom = require("features.race.raceRoom")
local socket = require("features.race.socket")
local socketFunctions = require("features.race.socketFunctions")
local sprites = require("features.race.sprites")
local startingRoom = require("features.race.startingRoom")
local tempMoreOptions = require("features.race.tempMoreOptions")
local topSprite = require("features.race.topSprite")
local resetRaceVars, giveFormatItems, validateRace, validateInRace, validateChallenge, validateDifficulty, validateSeed, validateCharacter, unseeded, unseededRankedSolo, seeded
function resetRaceVars(self)
    if g.raceVars.finished then
        socketFunctions:reset()
    end
    g.raceVars.finished = false
    g.raceVars.finishedTime = 0
end
function giveFormatItems(self, player)
    local ____switch8 = g.race.format
    if ____switch8 == "unseeded" then
        goto ____switch8_case_0
    elseif ____switch8 == "seeded" then
        goto ____switch8_case_1
    elseif ____switch8 == "diversity" then
        goto ____switch8_case_2
    end
    goto ____switch8_case_default
    ::____switch8_case_0::
    do
        do
            if g.race.ranked and g.race.solo then
                unseededRankedSolo(nil, player)
            else
                unseeded(nil, player)
            end
            goto ____switch8_end
        end
    end
    ::____switch8_case_1::
    do
        do
            seeded(nil, player)
            goto ____switch8_end
        end
    end
    ::____switch8_case_2::
    do
        do
            ____exports.diversity(nil, player)
            goto ____switch8_end
        end
    end
    ::____switch8_case_default::
    do
        do
            goto ____switch8_end
        end
    end
    ::____switch8_end::
end
function validateRace(self, player)
    return (((validateInRace(nil) and validateChallenge(nil)) and validateDifficulty(nil)) and validateSeed(nil)) and validateCharacter(nil, player)
end
function validateInRace(self)
    return g.race.status ~= "none"
end
function validateChallenge(self)
    local challenge = Isaac.GetChallenge()
    if (challenge ~= Challenge.CHALLENGE_NULL) and (g.race.format ~= "custom") then
        g.g:Fadeout(0.05, 2)
        log(nil, "We are in a race but also in a custom challenge; fading out back to the menu.")
        return false
    end
    return true
end
function validateDifficulty(self)
    if ((g.race.difficulty == "normal") and (g.g.Difficulty ~= Difficulty.DIFFICULTY_NORMAL)) and (g.race.format ~= "custom") then
        log(
            nil,
            ("Error: Supposed to be on normal mode. (Currently, the difficulty is " .. tostring(g.g.Difficulty)) .. ".)"
        )
        topSprite:setErrorHardMode()
        return false
    end
    if ((g.race.difficulty == "hard") and (g.g.Difficulty ~= Difficulty.DIFFICULTY_HARD)) and (g.race.format ~= "custom") then
        log(
            nil,
            ("Error: Supposed to be on hard mode. (Currently, the difficulty is " .. tostring(g.g.Difficulty)) .. ".)"
        )
        topSprite:setErrorNormalMode()
        return false
    end
    return true
end
function validateSeed(self)
    local startSeedString = g.seeds:GetStartSeedString()
    if (((g.race.format == "seeded") and (g.race.status == "in progress")) and (g.race.myStatus == "racing")) and (startSeedString ~= g.race.seed) then
        g.run.restart = true
        return false
    end
    if ((g.race.format == "unseeded") or (g.race.format == "diversity")) and playingOnSetSeed(nil) then
        g.seeds:Reset()
        g.run.restart = true
        return false
    end
    return true
end
function validateCharacter(self, player)
    local character = player:GetPlayerType()
    if (character ~= g.race.character) and (g.race.format ~= "custom") then
        g.run.restart = true
        return false
    end
    return true
end
function unseeded(self, player)
    if (g.race.status ~= "in progress") or (g.race.myStatus ~= "racing") then
        return
    end
    tempMoreOptions:give(player)
end
function unseededRankedSolo(self, player)
    for ____, itemID in ipairs(g.race.startingItems) do
        giveItemAndRemoveFromPools(nil, player, itemID)
    end
end
function seeded(self, player)
    local character = player:GetPlayerType()
    if not player:HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) then
        giveItemAndRemoveFromPools(nil, player, CollectibleType.COLLECTIBLE_COMPASS)
    end
    for ____, itemID in ipairs(g.race.startingItems) do
        if itemID == COLLECTIBLE_13_LUCK_SERVER_ID then
            itemID = CollectibleTypeCustom.COLLECTIBLE_13_LUCK
        elseif itemID == COLLECTIBLE_15_LUCK_SERVER_ID then
            itemID = CollectibleTypeCustom.COLLECTIBLE_15_LUCK
        end
        giveItemAndRemoveFromPools(nil, player, itemID)
    end
    if character == PlayerType.PLAYER_EDEN_B then
        giveItemAndRemoveFromPools(nil, player, CollectibleType.COLLECTIBLE_BIRTHRIGHT)
    end
    if (character == PlayerType.PLAYER_ISAAC_B) and (#g.race.startingItems >= 2) then
        giveItemAndRemoveFromPools(nil, player, CollectibleType.COLLECTIBLE_BIRTHRIGHT)
    end
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_SOL)
    g.itemPool:RemoveTrinket(TrinketType.TRINKET_CAINS_EYE)
end
function ____exports.diversity(self, player)
    local character = player:GetPlayerType()
    local trinket1 = player:GetTrinket(0)
    if (g.race.status ~= "in progress") or (g.race.myStatus ~= "racing") then
        return
    end
    tempMoreOptions:give(player)
    if shouldGetActiveD6(nil, player) and (character ~= PlayerType.PLAYER_ESAU) then
        giveItemAndRemoveFromPools(nil, player, CollectibleType.COLLECTIBLE_SCHOOLBAG)
    end
    local startingItems = g.race.startingItems
    do
        local i = 0
        while i < #startingItems do
            local itemOrTrinketID = startingItems[i + 1]
            if i == 0 then
                giveItemAndRemoveFromPools(nil, player, itemOrTrinketID)
            elseif ((i == 1) or (i == 2)) or (i == 3) then
                giveItemAndRemoveFromPools(nil, player, itemOrTrinketID)
                if itemOrTrinketID == CollectibleType.COLLECTIBLE_INCUBUS then
                    g.itemPool:RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1)
                elseif itemOrTrinketID == CollectibleType.COLLECTIBLE_SACRED_HEART then
                    g.itemPool:RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2)
                elseif itemOrTrinketID == CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT then
                    g.itemPool:RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3)
                end
            elseif i == 4 then
                if trinket1 ~= 0 then
                    player:TryRemoveTrinket(trinket1)
                end
                player:AddTrinket(itemOrTrinketID)
                player:UseActiveItem(CollectibleType.COLLECTIBLE_SMELTER, false, false, false, false)
                if trinket1 ~= 0 then
                    player:AddTrinket(trinket1)
                end
                g.itemPool:RemoveTrinket(itemOrTrinketID)
            end
            i = i + 1
        end
    end
    if (character == PlayerType.PLAYER_EDEN_B) or (character == PlayerType.PLAYER_ISAAC_B) then
        giveItemAndRemoveFromPools(nil, player, CollectibleType.COLLECTIBLE_BIRTHRIGHT)
    end
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_D4)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_D100)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_D_INFINITY)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_GENESIS)
    g.itemPool:RemoveCollectible(CollectibleType.COLLECTIBLE_ESAU_JR)
    g.itemPool:RemoveTrinket(TrinketType.TRINKET_DICE_BAG)
end
function ____exports.main(self)
    if not g.config.clientCommunication then
        return
    end
    resetRaceVars(nil)
    socket:postGameStarted()
    sprites:resetAll()
    local player = Isaac.GetPlayer()
    if not validateRace(nil, player) then
        return
    end
    socket:send("runMatchesRuleset")
    giveFormatItems(nil, player)
    raceRoom:initSprites()
    startingRoom:initSprites()
    topSprite:postGameStarted()
    placeLeft:postGameStarted()
end
return ____exports
 end,
["tableUtils"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____log = require("log")
local log = ____log.default
local DEBUG = false
function ____exports.merge(self, oldTable, newTable)
    if (type(oldTable) ~= "table") or (type(newTable) ~= "table") then
        error("merge is comparing a value that is not a table.")
    end
    if DEBUG then
        log(nil, "Beginning iterating over a table.")
    end
    for key, oldValue in pairs(oldTable) do
        do
            if DEBUG then
                log(
                    nil,
                    "Found key: " .. tostring(key)
                )
            end
            local newValue = newTable[key]
            local oldType = type(oldValue)
            local newType = type(newValue)
            if oldType ~= newType then
                goto __continue5
            end
            if oldType == "table" then
                ____exports.merge(nil, oldValue, newValue)
                goto __continue5
            end
            oldTable[key] = newValue
        end
        ::__continue5::
    end
    for key, newValue in pairs(newTable) do
        local num = tonumber(key)
        if num ~= nil then
            oldTable[key] = newValue
        end
    end
    if DEBUG then
        log(nil, "Finished iterating over a table.")
    end
end
return ____exports
 end,
["types.GlobalsToSave"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
return ____exports
 end,
["saveDat"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local jsonHelper = require("jsonHelper")
local ____log = require("log")
local log = ____log.default
local tableUtils = require("tableUtils")
local ____GlobalsRunRoom = require("types.GlobalsRunRoom")
local GlobalsRunRoom = ____GlobalsRunRoom.default
local readSaveDatFile, tryLoadModData
function readSaveDatFile(self, modObject)
    local isaacFrameCount = Isaac.GetFrameCount()
    local defaultModData = "{}"
    local ok, jsonStringOrErrMsg = pcall(tryLoadModData, modObject)
    if not ok then
        log(
            nil,
            (("Racing+ failed to read from the \"save#.dat\" file on Isaac frame " .. tostring(isaacFrameCount)) .. ": ") .. jsonStringOrErrMsg
        )
        return defaultModData
    end
    local jsonStringTrimmed = __TS__StringTrim(jsonStringOrErrMsg)
    if jsonStringTrimmed == "" then
        return defaultModData
    end
    return jsonStringTrimmed
end
function tryLoadModData(modObject)
    return Isaac.LoadModData(modObject)
end
local mod = nil
function ____exports.setMod(self, newMod)
    mod = newMod
end
function ____exports.save(self)
    local isClear = g.r:IsClear()
    if mod == nil then
        error("\"saveDat.save()\" was called without the mod being initialized.")
    end
    g.run.room = __TS__New(GlobalsRunRoom, isClear)
    g.run.fastClear.aliveEnemies = {}
    local globalsToSave = {config = g.config, hotkeys = g.hotkeys, run = g.run, race = g.race, speedrun = g.speedrun}
    local jsonString = jsonHelper:encode(globalsToSave)
    mod:SaveData(jsonString)
end
function ____exports.load(self)
    if mod == nil then
        error("\"saveDat.load()\" was called without the mod being initialized.")
    end
    if not Isaac.HasModData(mod) then
        return
    end
    local jsonString = readSaveDatFile(nil, mod)
    if jsonString == nil then
        return
    end
    local newGlobals = jsonHelper:decode(jsonString)
    local oldGlobals = {config = g.config, hotkeys = g.hotkeys, run = g.run, race = g.race, speedrun = g.speedrun}
    tableUtils:merge(oldGlobals, newGlobals)
    log(nil, "Loaded the \"save#.dat\" file.")
end
return ____exports
 end,
["features.mandatory.streakText"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local gridToPos = ____misc.gridToPos
local FRAMES_BEFORE_FADE, checkDraw, draw
function checkDraw(self)
    if VanillaStreakText ~= nil then
        return
    end
    if g.run.streakText.frame == 0 then
        if g.run.streakText.tabText ~= "" then
            draw(nil, g.run.streakText.tabText, 1)
        end
        return
    end
    local elapsedFrames = Isaac.GetFrameCount() - g.run.streakText.frame
    local fade
    if elapsedFrames <= FRAMES_BEFORE_FADE then
        fade = 1
    else
        local fadeFrames = elapsedFrames - FRAMES_BEFORE_FADE
        fade = 1 - (0.02 * fadeFrames)
    end
    if fade <= 0 then
        g.run.streakText.frame = 0
        return
    end
    draw(nil, g.run.streakText.text, fade)
end
function draw(self, text, fade)
    local positionGame = gridToPos(nil, 6, 0)
    local position = Isaac.WorldToRenderPosition(positionGame)
    local color = KColor(1, 1, 1, fade)
    local scale = 1
    local length = g.font:GetStringWidthUTF8(text) * scale
    g.font:DrawStringScaled(text, position.X - (length / 2), position.Y, scale, scale, color, 0, true)
end
FRAMES_BEFORE_FADE = 50
function ____exports.postRender(self)
    checkDraw(nil)
end
function ____exports.set(self, text)
    g.run.streakText.text = text
    g.run.streakText.frame = Isaac.GetFrameCount()
end
return ____exports
 end,
["features.optional.quality.openHushDoor"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.postNewLevel(self)
    if not g.config.openHushDoor then
        return
    end
    local stage = g.l:GetStage()
    local player = Isaac.GetPlayer()
    if stage == 9 then
        local hushDoor = g.r:GetDoor(1)
        if hushDoor ~= nil then
            hushDoor:TryUnlock(player, true)
        end
        g.sfx:Stop(SoundEffect.SOUND_BOSS_LITE_ROAR)
    end
end
return ____exports
 end,
["features.optional.sound.silenceMomDad"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local MOM_AND_DAD_SOUND_EFFECTS = {SoundEffect.SOUND_MOM_AND_DAD_1, SoundEffect.SOUND_MOM_AND_DAD_2, SoundEffect.SOUND_MOM_AND_DAD_3, SoundEffect.SOUND_MOM_AND_DAD_4}
function ____exports.postNewLevel(self)
    for ____, soundEffect in ipairs(MOM_AND_DAD_SOUND_EFFECTS) do
        g.sfx:Stop(soundEffect)
    end
end
return ____exports
 end,
["features.race.megaSatan"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.postNewLevel(self)
    local stage = g.l:GetStage()
    local player = Isaac.GetPlayer()
    if (((g.race.status ~= "in progress") or (g.race.myStatus ~= "racing")) or (g.race.goal ~= "Mega Satan")) or (stage ~= 11) then
        return
    end
    local topDoor = g.r:GetDoor(1)
    if topDoor ~= nil then
        topDoor:TryUnlock(player, true)
        g.sfx:Stop(SoundEffect.SOUND_UNLOCK00)
    end
end
return ____exports
 end,
["features.race.callbacks.postNewLevel"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local megaSatan = require("features.race.megaSatan")
local placeLeft = require("features.race.placeLeft")
local socket = require("features.race.socket")
local tempMoreOptions = require("features.race.tempMoreOptions")
function ____exports.main(self)
    if not g.config.clientCommunication then
        return
    end
    socket:postNewLevel()
    tempMoreOptions:postNewLevel()
    placeLeft:postNewLevel()
    megaSatan:postNewLevel()
end
return ____exports
 end,
["features.mandatory.controlsGraphic"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getRoomIndex = ____misc.getRoomIndex
local isAntibirthStage = ____misc.isAntibirthStage
local ____enums = require("types.enums")
local EffectSubTypeCustom = ____enums.EffectSubTypeCustom
local drawControlsGraphic, shouldDrawControlsGraphic, inSeededOrDiversityRace
function drawControlsGraphic(self)
    if not shouldDrawControlsGraphic(nil) then
        return
    end
    local stageType = g.l:GetStageType()
    local centerPos = g.r:GetCenterPos()
    local controlsEffect = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_RED, EffectSubTypeCustom.FLOOR_EFFECT_CREEP, centerPos, Vector.Zero, nil):ToEffect()
    if controlsEffect == nil then
        return
    end
    controlsEffect.CollisionDamage = 0
    controlsEffect.Timeout = 1000000
    local controlsSprite = controlsEffect:GetSprite()
    controlsSprite:Load("gfx/backdrop/controls_custom.anm2", true)
    controlsSprite:Play("Idle", true)
    controlsEffect.Scale = 1
    if stageType == StageType.STAGETYPE_AFTERBIRTH then
        controlsSprite.Color = Color(0.5, 0.5, 0.5, 1, 0, 0, 0)
    end
end
function shouldDrawControlsGraphic(self)
    local stage = g.l:GetStage()
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    local roomIndex = getRoomIndex(nil)
    return ((((not g.g:IsGreedMode()) and (stage == 1)) and (roomIndex == startingRoomIndex)) and (not isAntibirthStage(nil))) and (not inSeededOrDiversityRace(nil))
end
function inSeededOrDiversityRace(self)
    return ((g.race.status == "in progress") and (g.race.myStatus == "racing")) and ((g.race.format == "seeded") or (g.race.format == "diversity"))
end
function ____exports.postNewRoom(self)
    drawControlsGraphic(nil)
end
return ____exports
 end,
["features.mandatory.detectSlideAnimation"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local checkSlideAnimationFinished, recordSlideAnimationStarted
function checkSlideAnimationFinished(self)
    local isPaused = g.g:IsPaused()
    if not isPaused then
        g.run.slideAnimationHappening = false
    end
end
function recordSlideAnimationStarted(self)
    g.run.slideAnimationHappening = true
end
function ____exports.postRender(self)
    checkSlideAnimationFinished(nil)
end
function ____exports.postNewRoom(self)
    recordSlideAnimationStarted(nil)
end
return ____exports
 end,
["features.race.raceFinish"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local socket = require("features.race.socket")
function ____exports.default(self)
    local stage = g.l:GetStage()
    g.raceVars.finished = true
    g.raceVars.finishedTime = Isaac.GetTime() - g.raceVars.startedTime
    g.raceVars.finishedFrames = Isaac.GetFrameCount() - g.raceVars.startedFrame
    g.run.room.showEndOfRunText = true
    socket:send(
        "finish",
        tostring(g.raceVars.finishedTime)
    )
    log(
        nil,
        (("Finished race " .. tostring(g.race.raceID)) .. " with time: ") .. tostring(g.raceVars.finishedTime)
    )
    log(
        nil,
        "The total amount of frames in the race was: " .. tostring(g.raceVars.finishedFrames)
    )
    if stage == 11 then
    end
end
return ____exports
 end,
["features.speedrun.constants"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____enums = require("features.speedrun.enums")
local ChallengeCustom = ____enums.ChallengeCustom
____exports.CHALLENGE_DEFINITIONS = __TS__New(Map, {{ChallengeCustom.SEASON_1, {"R7S1", 7}}})
return ____exports
 end,
["features.speedrun.speedrun"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____enums = require("types.enums")
local CollectibleTypeCustom = ____enums.CollectibleTypeCustom
local SoundEffectCustom = ____enums.SoundEffectCustom
local ____constants = require("features.speedrun.constants")
local CHALLENGE_DEFINITIONS = ____constants.CHALLENGE_DEFINITIONS
function ____exports.checkValidCharOrder(self)
    local challenge = Isaac.GetChallenge()
    local challengeDefinition = CHALLENGE_DEFINITIONS:get(challenge)
    if challengeDefinition == nil then
        error(
            ("Failed to find challenge " .. tostring(challenge)) .. " in the challenge definitions."
        )
    end
    local abbreviation, numElements = table.unpack(challengeDefinition)
    if (abbreviation == nil) or (numElements == nil) then
        error(
            "Failed to find parse the challenge definition for challenge: " .. tostring(challenge)
        )
    end
    local characterOrder = g.speedrun.characterOrder[challenge]
    if characterOrder == nil then
        return false
    end
    if type(characterOrder) ~= "table" then
        log(
            nil,
            ("Error: The character order for challenge " .. tostring(challenge)) .. " was not a table."
        )
        return false
    end
    if #characterOrder ~= numElements then
        log(
            nil,
            ((((("Error: The character order for challenge " .. tostring(challenge)) .. " had ") .. tostring(#characterOrder)) .. " elements, but it needs to have ") .. tostring(numElements)) .. "."
        )
        return false
    end
    return true
end
function ____exports.getCurrentCharacter(self)
    local challenge = Isaac.GetChallenge()
    local challengeDefinition = CHALLENGE_DEFINITIONS:get(challenge)
    if challengeDefinition == nil then
        error(
            ("Failed to find challenge " .. tostring(challenge)) .. " in the challenge definitions."
        )
    end
    local abbreviation, numElements = table.unpack(challengeDefinition)
    if (abbreviation == nil) or (numElements == nil) then
        error(
            "Failed to find parse the challenge definition for challenge: " .. tostring(challenge)
        )
    end
    local characterOrder = g.speedrun.characterOrder[challenge]
    if characterOrder == nil then
        return 0
    end
    if type(characterOrder) ~= "table" then
        log(
            nil,
            ("Error: The character order for challenge " .. tostring(challenge)) .. " was not a table."
        )
        return 0
    end
    if #characterOrder ~= numElements then
        log(
            nil,
            ((((("Error: The character order for challenge " .. tostring(challenge)) .. " had ") .. tostring(#characterOrder)) .. " elements, but it needs to have ") .. tostring(numElements)) .. "."
        )
        return 0
    end
    if g.speedrun.characterNum < 1 then
        log(nil, "Error: The character number is less than 1.")
        return 0
    end
    if g.speedrun.characterNum > #characterOrder then
        log(
            nil,
            ("Error: The character number is greater than " .. tostring(#characterOrder)) .. " (i.e. the amount of characters in this speedrun)."
        )
        return 0
    end
    local arrayIndex = g.speedrun.characterNum - 1
    local character = characterOrder[arrayIndex + 1]
    if character == nil then
        log(
            nil,
            ((("Error: Failed to find the character at array index " .. tostring(arrayIndex)) .. " for the character order of challenge ") .. tostring(challenge)) .. "."
        )
        return 0
    end
    return character
end
function ____exports.inSpeedrun(self)
    local challenge = Isaac.GetChallenge()
    return __TS__ArrayIncludes(
        __TS__ObjectKeys(CHALLENGE_DEFINITIONS),
        tostring(challenge)
    )
end
function ____exports.isOnFinalCharacter(self)
    return g.speedrun.characterNum == 7
end
function ____exports.finish(self, player)
    player:AddCollectible(CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT)
    local elapsedTime = Isaac.GetTime() - g.speedrun.startedCharTime
    __TS__ArrayPush(g.speedrun.characterRunTimes, elapsedTime)
    g.run.room.showEndOfRunText = true
    g.speedrun.finished = true
    g.speedrun.finishedTime = Isaac.GetTime() - g.speedrun.startedTime
    g.speedrun.finishedFrames = Isaac.GetFrameCount() - g.speedrun.startedFrame
    g.sfx:Play(SoundEffectCustom.SOUND_SPEEDRUN_FINISH, 1.5, 0, false, 1)
end
return ____exports
 end,
["features.mandatory.trophy"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getRoomIndex = ____misc.getRoomIndex
local ____enums = require("types.enums")
local CollectibleTypeCustom = ____enums.CollectibleTypeCustom
local EntityTypeCustom = ____enums.EntityTypeCustom
local ____raceFinish = require("features.race.raceFinish")
local raceFinish = ____raceFinish.default
local ____SeededDeathState = require("features.race.types.SeededDeathState")
local SeededDeathState = ____SeededDeathState.default
local speedrun = require("features.speedrun.speedrun")
local TROPHY_TOUCH_DISTANCE, checkTouch, touch, checkRespawn
function checkTouch(self)
    if g.raceVars.finished or g.speedrun.finished then
        return
    end
    local trophies = Isaac.FindByType(EntityTypeCustom.ENTITY_RACE_TROPHY)
    for ____, trophy in ipairs(trophies) do
        local playersInRange = Isaac.FindInRadius(trophy.Position, TROPHY_TOUCH_DISTANCE, EntityPartition.PLAYER)
        for ____, entity in ipairs(playersInRange) do
            local player = entity:ToPlayer()
            if ((player ~= nil) and (not player:IsDead())) and (g.run.seededDeath.state == SeededDeathState.Disabled) then
                touch(nil, trophy, player)
                return
            end
        end
    end
end
function touch(self, trophy, player)
    trophy:Remove()
    g.run.level.trophy = nil
    player:AnimateCollectible(CollectibleTypeCustom.COLLECTIBLE_TROPHY, "Pickup", "PlayerPickupSparkle2")
    if speedrun:inSpeedrun() then
        speedrun:finish(player)
    else
        raceFinish(nil)
    end
end
function checkRespawn(self)
    local roomIndex = getRoomIndex(nil)
    if (g.run.level.trophy == nil) or (roomIndex ~= g.run.level.trophy.roomIndex) then
        return
    end
    Isaac.Spawn(EntityTypeCustom.ENTITY_RACE_TROPHY, 0, 0, g.run.level.trophy.position, Vector.Zero, nil)
end
TROPHY_TOUCH_DISTANCE = 24
function ____exports.spawn(self, position)
    local roomIndex = getRoomIndex(nil)
    Isaac.Spawn(EntityTypeCustom.ENTITY_RACE_TROPHY, 0, 0, position, Vector.Zero, nil)
    g.run.level.trophy = {roomIndex = roomIndex, position = position}
end
function ____exports.postUpdate(self)
    checkTouch(nil)
end
function ____exports.postNewRoom(self)
    checkRespawn(nil)
end
return ____exports
 end,
["features.optional.bosses.fastSatan"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local gridToPos = ____misc.gridToPos
local incrementRNG = ____misc.incrementRNG
local instantlySpawnSatan, spawnEnemies, primeStatue
function instantlySpawnSatan(self)
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomData = roomDesc.Data
    local roomStageID = roomData.StageID
    local roomVariant = roomData.Variant
    local roomClear = g.r:IsClear()
    if roomClear then
        return
    end
    if (roomStageID ~= 0) or (roomVariant ~= 3600) then
        return
    end
    spawnEnemies(nil)
    primeStatue(nil)
end
function spawnEnemies(self)
    local roomSeed = g.r:GetSpawnSeed()
    local seed = roomSeed
    for ____, position in ipairs(
        {
            gridToPos(nil, 5, 3),
            gridToPos(nil, 7, 3)
        }
    ) do
        seed = incrementRNG(nil, seed)
        g.g:Spawn(EntityType.ENTITY_LEECH, 1, position, Vector.Zero, nil, 0, seed)
    end
    seed = incrementRNG(nil, seed)
    g.g:Spawn(
        EntityType.ENTITY_FALLEN,
        0,
        gridToPos(nil, 6, 3),
        Vector.Zero,
        nil,
        0,
        seed
    )
end
function primeStatue(self)
    local satans = Isaac.FindByType(EntityType.ENTITY_SATAN)
    for ____, satan in ipairs(satans) do
        local npc = satan:ToNPC()
        if npc ~= nil then
            npc.I1 = 1
        end
    end
end
function ____exports.postNewRoom(self)
    if not g.config.fastSatan then
        return
    end
    instantlySpawnSatan(nil)
end
return ____exports
 end,
["features.optional.bugfix.teleportInvalidEntrance"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____constants = require("constants")
local MAX_NUM_DOORS = ____constants.MAX_NUM_DOORS
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local anyPlayerCloserThan = ____misc.anyPlayerCloserThan
local enteredRoomViaTeleport = ____misc.enteredRoomViaTeleport
local getAllDoors = ____misc.getAllDoors
local getPlayers = ____misc.getPlayers
local moveEsauNextToJacob = ____misc.moveEsauNextToJacob
local isPlayerNextToADoor, getFirstDoorSlotAndPosition, getDoorEnterPosition
function isPlayerNextToADoor(self)
    for ____, door in ipairs(
        getAllDoors(nil)
    ) do
        if (door.TargetRoomType ~= RoomType.ROOM_SECRET) and (door.TargetRoomType ~= RoomType.ROOM_SUPERSECRET) then
            if anyPlayerCloserThan(nil, door.Position, 60) then
                return true
            end
        end
    end
    return false
end
function getFirstDoorSlotAndPosition(self)
    do
        local i = 0
        while i < MAX_NUM_DOORS do
            local door = g.r:GetDoor(i)
            if ((door ~= nil) and (door.TargetRoomType ~= RoomType.ROOM_SECRET)) and (door.TargetRoomType ~= RoomType.ROOM_SUPERSECRET) then
                return {i, door.Position}
            end
            i = i + 1
        end
    end
    return {nil, nil}
end
function getDoorEnterPosition(self, doorSlot, doorPosition)
    local x = doorPosition.X
    local y = doorPosition.Y
    if (doorSlot == DoorSlot.LEFT0) or (doorSlot == DoorSlot.LEFT1) then
        x = x + 40
    elseif (doorSlot == DoorSlot.UP0) or (doorSlot == DoorSlot.UP1) then
        y = y + 40
    elseif (doorSlot == DoorSlot.RIGHT0) or (doorSlot == DoorSlot.RIGHT1) then
        x = x - 40
    elseif (doorSlot == DoorSlot.DOWN0) or (doorSlot == DoorSlot.DOWN1) then
        y = y - 40
    end
    return Vector(x, y)
end
function ____exports.postNewRoom(self)
    if not g.config.teleportInvalidEntrance then
        return
    end
    local stage = g.l:GetStage()
    local roomType = g.r:GetType()
    local roomShape = g.r:GetRoomShape()
    if not enteredRoomViaTeleport(nil) then
        return
    end
    if (stage == 6) and (roomType == RoomType.ROOM_BOSS) then
        return
    end
    if isPlayerNextToADoor(nil) then
        return
    end
    local firstDoorSlot, firstDoorPosition = table.unpack(
        getFirstDoorSlotAndPosition(nil)
    )
    if (firstDoorSlot == nil) or (firstDoorPosition == nil) then
        return
    end
    if roomShape >= RoomShape.ROOMSHAPE_1x2 then
        log(nil, "Not fixing an invalid entrance teleport due to being in a large room.")
        return
    end
    local position = getDoorEnterPosition(nil, firstDoorSlot, firstDoorPosition)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        player.Position = position
    end
    moveEsauNextToJacob(nil)
    local familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR)
    for ____, familiar in ipairs(familiars) do
        familiar.Position = position
    end
    log(nil, "Fixed teleporting a player to an invalid entrance.")
end
return ____exports
 end,
["features.optional.enemies.appearHands"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.postNPCUpdate(self, npc)
    if not g.config.appearHands then
        return
    end
    if npc.FrameCount == 0 then
        local sprite = npc:GetSprite()
        sprite:Play("Appear", true)
    end
end
function ____exports.preNPCUpdate(self, npc)
    if not g.config.appearHands then
        return nil
    end
    local sprite = npc:GetSprite()
    if sprite:IsPlaying("Appear") then
        return true
    end
    return nil
end
function ____exports.postNewRoom(self)
    if not g.config.appearHands then
        return
    end
    g.sfx:Stop(SoundEffect.SOUND_MOM_VOX_EVILLAUGH)
end
return ____exports
 end,
["features.optional.major.fastTravel.checkStateComplete"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local ____enums = require("types.enums")
local EffectVariantCustom = ____enums.EffectVariantCustom
local ____constants = require("features.optional.major.fastTravel.constants")
local FADE_TO_BLACK_FRAMES = ____constants.FADE_TO_BLACK_FRAMES
local FAMES_BEFORE_JUMP = ____constants.FAMES_BEFORE_JUMP
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelState = ____enums.FastTravelState
local ____setNewState = require("features.optional.major.fastTravel.setNewState")
local setNewState = ____setNewState.default
local setPlayersVisible = ____setNewState.setPlayersVisible
local postRenderFadingToBlack, postRenderFadingIn, incrementFramesPassed, resetPlayerCollision, makePlayersJump, postNewRoomChangingToSameRoom, postNewRoomGoingToNewFloor
function postRenderFadingToBlack(self)
    incrementFramesPassed(nil)
    if g.run.fastTravel.framesPassed < FADE_TO_BLACK_FRAMES then
        return
    end
    setNewState(nil, FastTravelState.ChangingToSameRoom)
end
function postRenderFadingIn(self)
    incrementFramesPassed(nil)
    if g.run.fastTravel.framesPassed == FAMES_BEFORE_JUMP then
        resetPlayerCollision(nil)
        setPlayersVisible(
            nil,
            getPlayers(nil),
            true
        )
        makePlayersJump(nil)
    end
    if g.run.fastTravel.framesPassed < FADE_TO_BLACK_FRAMES then
        return
    end
    setNewState(nil, FastTravelState.Disabled)
end
function incrementFramesPassed(self)
    if not g.g:IsPaused() then
        local ____obj, ____index = g.run.fastTravel, "framesPassed"
        ____obj[____index] = ____obj[____index] + 1
    end
end
function resetPlayerCollision(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL
    end
end
function makePlayersJump(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        player:PlayExtraAnimation("Jump")
    end
    local pitfalls = Isaac.FindByType(EntityType.ENTITY_EFFECT, EffectVariantCustom.PITFALL_CUSTOM)
    for ____, pitfall in ipairs(pitfalls) do
        local sprite = pitfall:GetSprite()
        sprite:Play("Disappear", true)
    end
end
function postNewRoomChangingToSameRoom(self)
    setNewState(nil, FastTravelState.GoingToNewFloor)
end
function postNewRoomGoingToNewFloor(self)
    setNewState(nil, FastTravelState.FadingIn)
end
function ____exports.postRender(self)
    local ____switch3 = g.run.fastTravel.state
    if ____switch3 == FastTravelState.FadingToBlack then
        goto ____switch3_case_0
    elseif ____switch3 == FastTravelState.FadingIn then
        goto ____switch3_case_1
    end
    goto ____switch3_case_default
    ::____switch3_case_0::
    do
        do
            postRenderFadingToBlack(nil)
            goto ____switch3_end
        end
    end
    ::____switch3_case_1::
    do
        do
            postRenderFadingIn(nil)
            goto ____switch3_end
        end
    end
    ::____switch3_case_default::
    do
        do
            goto ____switch3_end
        end
    end
    ::____switch3_end::
end
function ____exports.postNewRoom(self)
    local ____switch20 = g.run.fastTravel.state
    if ____switch20 == FastTravelState.ChangingToSameRoom then
        goto ____switch20_case_0
    elseif ____switch20 == FastTravelState.GoingToNewFloor then
        goto ____switch20_case_1
    end
    goto ____switch20_case_default
    ::____switch20_case_0::
    do
        do
            postNewRoomChangingToSameRoom(nil)
            goto ____switch20_end
        end
    end
    ::____switch20_case_1::
    do
        do
            postNewRoomGoingToNewFloor(nil)
            goto ____switch20_end
        end
    end
    ::____switch20_case_default::
    do
        do
            goto ____switch20_end
        end
    end
    ::____switch20_end::
end
return ____exports
 end,
["features.optional.major.fastTravel.crawlspace"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local getGridEntities = ____misc.getGridEntities
local getRoomIndex = ____misc.getRoomIndex
local movePlayersAndFamiliars = ____misc.movePlayersAndFamiliars
local teleport = ____misc.teleport
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelEntityType = ____enums.FastTravelEntityType
local fastTravel = require("features.optional.major.fastTravel.fastTravel")
local state = require("features.optional.major.fastTravel.state")
local GRID_INDEX_OF_TOP_OF_LADDER, TOP_OF_LADDER_POSITION, DEVIL_ANGEL_EXIT_MAP, BOSS_RUSH_EXIT_MAP, BOSS_ROOM_ENTER_MAP, FAST_TRAVEL_ENTITY_TYPE, initAll, repositionPlayer, checkBlackMarket, checkReturningToRoomOutsideTheGrid, checkPostRoomTransitionSubvert, getExitDirection, shouldSpawnOpen, touched
function initAll(self)
    for ____, gridEntity in ipairs(
        getGridEntities(nil)
    ) do
        local saveState = gridEntity:GetSaveState()
        if saveState.Type == GridEntityType.GRID_STAIRS then
            fastTravel:init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen)
        end
    end
end
function repositionPlayer(self)
    local roomIndex = getRoomIndex(nil)
    if (roomIndex == GridRooms.ROOM_DUNGEON_IDX) and (not g.run.level.fastTravel.blackMarket) then
        movePlayersAndFamiliars(nil, TOP_OF_LADDER_POSITION)
    end
end
function checkBlackMarket(self)
    local roomIndex = getRoomIndex(nil)
    g.run.level.fastTravel.blackMarket = roomIndex == GridRooms.ROOM_BLACK_MARKET_IDX
end
function checkReturningToRoomOutsideTheGrid(self)
    local roomIndex = getRoomIndex(nil)
    local prevRoomIndex = g.l:GetPreviousRoomIndex()
    if (((prevRoomIndex == GridRooms.ROOM_DUNGEON_IDX) and (roomIndex < 0)) and (roomIndex ~= GridRooms.ROOM_DUNGEON_IDX)) and (roomIndex ~= GridRooms.ROOM_BLACK_MARKET_IDX) then
        movePlayersAndFamiliars(nil, g.l.DungeonReturnPosition)
    end
end
function checkPostRoomTransitionSubvert(self)
    local direction = g.run.level.fastTravel.subvertedRoomTransitionDirection
    if direction ~= Direction.NO_DIRECTION then
        local gridPosition = BOSS_ROOM_ENTER_MAP:get(direction)
        if gridPosition ~= nil then
            local player = Isaac.GetPlayer()
            if player ~= nil then
                player.Position = g.r:GetGridPosition(gridPosition)
                g.run.level.fastTravel.subvertedRoomTransitionDirection = Direction.NO_DIRECTION
                log(nil, "Changed the player's position after subverting the room transition animation for a room outside of the grid.")
            end
        end
    end
end
function ____exports.checkTopOfCrawlspaceLadder(self, player)
    if (g.r:GetType() == RoomType.ROOM_DUNGEON) and (g.r:GetGridIndex(player.Position) == GRID_INDEX_OF_TOP_OF_LADDER) then
        g.run.room.fastTravel.amChangingRooms = true
        teleport(nil, g.l.DungeonReturnRoomIndex, Direction.UP, RoomTransitionAnim.WALK)
    end
end
function ____exports.checkExitSoftlock(self, player)
    local previousRoomIndex = g.l:GetPreviousRoomIndex()
    local roomType = g.r:GetType()
    if (previousRoomIndex ~= GridRooms.ROOM_DUNGEON_IDX) or (g.run.level.fastTravel.previousRoomIndex == nil) then
        return
    end
    local direction = getExitDirection(nil, roomType, player)
    if direction ~= nil then
        g.run.level.fastTravel.subvertedRoomTransitionDirection = direction
        g.run.room.fastTravel.amChangingRooms = true
        teleport(nil, g.run.level.fastTravel.previousRoomIndex, direction, RoomTransitionAnim.WALK)
        log(nil, "Subverted exiting a room outside of the grid to avoid a crawlspace-related softlock.")
    end
end
function getExitDirection(self, roomType, player)
    local playerGridIndex = g.r:GetGridIndex(player.Position)
    local ____switch23 = roomType
    if ____switch23 == RoomType.ROOM_DEVIL then
        goto ____switch23_case_0
    elseif ____switch23 == RoomType.ROOM_ANGEL then
        goto ____switch23_case_1
    elseif ____switch23 == RoomType.ROOM_BOSSRUSH then
        goto ____switch23_case_2
    end
    goto ____switch23_case_default
    ::____switch23_case_0::
    do
    end
    ::____switch23_case_1::
    do
        do
            return DEVIL_ANGEL_EXIT_MAP:get(playerGridIndex)
        end
    end
    ::____switch23_case_2::
    do
        do
            return BOSS_RUSH_EXIT_MAP:get(playerGridIndex)
        end
    end
    ::____switch23_case_default::
    do
        do
            return nil
        end
    end
    ::____switch23_end::
end
function shouldSpawnOpen(self, entity)
    if g.r:GetFrameCount() == 0 then
        if not g.r:IsClear() then
            return false
        end
        return state:shouldOpen(entity, FAST_TRAVEL_ENTITY_TYPE)
    end
    return false
end
function touched(self, entity)
    local roomIndex = getRoomIndex(nil)
    local previousRoomIndex = g.l:GetPreviousRoomIndex()
    local previousRoomIndexToUse = ((g.run.level.fastTravel.previousRoomIndex == nil) and previousRoomIndex) or g.run.level.fastTravel.previousRoomIndex
    g.run.level.fastTravel.previousRoomIndex = previousRoomIndexToUse
    g.l.DungeonReturnRoomIndex = roomIndex
    g.l.DungeonReturnPosition = entity.Position
    teleport(nil, GridRooms.ROOM_DUNGEON_IDX, Direction.DOWN, RoomTransitionAnim.WALK)
end
GRID_INDEX_OF_TOP_OF_LADDER = 2
TOP_OF_LADDER_POSITION = Vector(120, 160)
DEVIL_ANGEL_EXIT_MAP = __TS__New(Map, {{7, Direction.UP}, {74, Direction.RIGHT}, {127, Direction.DOWN}, {60, Direction.LEFT}})
BOSS_RUSH_EXIT_MAP = __TS__New(Map, {{7, Direction.UP}, {112, Direction.LEFT}, {139, Direction.RIGHT}, {427, Direction.DOWN}})
BOSS_ROOM_ENTER_MAP = __TS__New(Map, {{Direction.LEFT, 73}, {Direction.UP, 112}, {Direction.RIGHT, 61}, {Direction.DOWN, 22}})
FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.Crawlspace
function ____exports.postNewRoom(self)
    initAll(nil)
    repositionPlayer(nil)
    checkBlackMarket(nil)
    checkReturningToRoomOutsideTheGrid(nil)
    checkPostRoomTransitionSubvert(nil)
end
function ____exports.postPlayerUpdate(self, player)
    if g.run.room.fastTravel.amChangingRooms then
        return
    end
    ____exports.checkTopOfCrawlspaceLadder(nil, player)
    ____exports.checkExitSoftlock(nil, player)
end
function ____exports.postGridEntityUpdateCrawlspace(self, gridEntity)
    gridEntity.State = 0
    fastTravel:init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen)
    fastTravel:checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE)
    fastTravel:checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched)
end
return ____exports
 end,
["features.optional.major.fastTravel.trapdoor"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getGridEntities = ____misc.getGridEntities
local isAntibirthStage = ____misc.isAntibirthStage
local isPostBossVoidPortal = ____misc.isPostBossVoidPortal
local removeGridEntity = ____misc.removeGridEntity
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelEntityType = ____enums.FastTravelEntityType
local fastTravel = require("features.optional.major.fastTravel.fastTravel")
local ____setNewState = require("features.optional.major.fastTravel.setNewState")
local setFadingToBlack = ____setNewState.setFadingToBlack
local state = require("features.optional.major.fastTravel.state")
local FAST_TRAVEL_ENTITY_TYPE, initAll, shouldIgnore, shouldRemove, touched
function initAll(self)
    for ____, gridEntity in ipairs(
        getGridEntities(nil)
    ) do
        local saveState = gridEntity:GetSaveState()
        if (saveState.Type == GridEntityType.GRID_TRAPDOOR) and (not shouldIgnore(nil, gridEntity)) then
            fastTravel:init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, ____exports.shouldSpawnOpen)
        end
    end
end
function shouldIgnore(self, gridEntity)
    local stage = g.l:GetStage()
    if isPostBossVoidPortal(nil, gridEntity) then
        return true
    end
    if g.seeds:HasSeedEffect(SeedEffect.SEED_INFINITE_BASEMENT) then
        return true
    end
    if (stage == 8) and isAntibirthStage(nil) then
        return true
    end
    return false
end
function shouldRemove(self)
    local stage = g.l:GetStage()
    local roomType = g.r:GetType()
    if (((stage == 6) and (g.race.status == "in progress")) and (g.race.myStatus == "racing")) and (g.race.goal == "Boss Rush") then
        return true
    end
    if ((not ((((((stage == 1) or (stage == 3)) or (stage == 5)) or (stage == 6)) or (stage == 7)) and isAntibirthStage(nil))) and (g.race.goal == "Mother")) and (roomType == RoomType.ROOM_BOSS) then
        return true
    end
    return false
end
function ____exports.shouldSpawnOpen(self, entity)
    if g.r:GetFrameCount() == 0 then
        if not g.r:IsClear() then
            return false
        end
        return state:shouldOpen(entity, FAST_TRAVEL_ENTITY_TYPE)
    end
    if g.l:GetStage() == 10 then
        return true
    end
    return false
end
function touched(self, entity, player)
    setFadingToBlack(nil, entity, player, false)
end
FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.Trapdoor
function ____exports.postNewRoom(self)
    initAll(nil)
end
function ____exports.postGridEntityUpdateTrapdoor(self, gridEntity)
    if shouldIgnore(nil, gridEntity) then
        return
    end
    if shouldRemove(nil) then
        removeGridEntity(nil, gridEntity)
        return
    end
    gridEntity.State = 0
    fastTravel:init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, ____exports.shouldSpawnOpen)
    fastTravel:checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE)
    fastTravel:checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched)
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.postNewRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local checkStateComplete = require("features.optional.major.fastTravel.checkStateComplete")
local crawlspace = require("features.optional.major.fastTravel.crawlspace")
local trapdoor = require("features.optional.major.fastTravel.trapdoor")
function ____exports.main(self)
    if not g.config.fastTravel then
        return
    end
    checkStateComplete:postNewRoom()
    trapdoor:postNewRoom()
    crawlspace:postNewRoom()
end
return ____exports
 end,
["features.optional.quality.showDreamCatcherItem.bossPNGMap"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
____exports.bossPNGMap = __TS__New(Map, {{EntityType.ENTITY_LARRYJR, {"portrait_19.0_larryjr.png", "portrait_19.1_thehollow.png", "portrait_19.100_tufftwins.png", "portrait_shell.png"}}, {EntityType.ENTITY_MONSTRO, {"portrait_20.0_monstro.png"}}, {EntityType.ENTITY_CHUB, {"portrait_28.0_chub.png", "portrait_28.1_chad.png", "portrait_28.2_carrionqueen.png"}}, {EntityType.ENTITY_GURDY, {"portrait_36.0_gurdy.png"}}, {EntityType.ENTITY_MONSTRO2, {"portrait_43.0_monstro2.png", "portrait_43.1_gish.png"}}, {EntityType.ENTITY_MOM, {"portrait_45.0_mom.png"}}, {EntityType.ENTITY_PIN, {"portrait_62.0_pin.png", "portrait_62.1_scolex.png", "portrait_thefrail.png"}}, {EntityType.ENTITY_FAMINE, {"portrait_63.0_famine.png"}}, {EntityType.ENTITY_PESTILENCE, {"portrait_64.0_pestilence.png"}}, {EntityType.ENTITY_WAR, {"portrait_65.0_war.png", "portrait_65.1_conquest.png"}}, {EntityType.ENTITY_DEATH, {"portrait_66.0_death.png"}}, {EntityType.ENTITY_DUKE, {"portrait_67.0_dukeofflies.png", "portrait_67.1_thehusk.png"}}, {EntityType.ENTITY_PEEP, {"portrait_68.0_peep.png", "portrait_68.1_bloat.png"}}, {EntityType.ENTITY_LOKI, {"portrait_69.0_loki.png", "portrait_69.1_lokii.png"}}, {EntityType.ENTITY_FISTULA_BIG, {"portrait_71.0_fistula.png", "portrait_71.1_teratoma.png"}}, {EntityType.ENTITY_BLASTOCYST_BIG, {"portrait_74.0_blastocyst.png"}}, {EntityType.ENTITY_MOMS_HEART, {"portrait_78.0_momsheart.png", "portrait_78.1_itlives.png"}}, {EntityType.ENTITY_GEMINI, {"portrait_79.0_gemini.png", "portrait_79.1_steven.png", "portrait_79.2_blightedovum.png"}}, {EntityType.ENTITY_FALLEN, {"portrait_81.0_thefallen.png"}}, {EntityType.ENTITY_HEADLESS_HORSEMAN, {"portrait_82.0_headlesshorseman.png"}}, {EntityType.ENTITY_SATAN, {"portrait_84.0_satan.png"}}, {EntityType.ENTITY_MASK_OF_INFAMY, {"portrait_97.0_maskofinfamy.png"}}, {EntityType.ENTITY_GURDY_JR, {"portrait_99.0_gurdyjr.png"}}, {EntityType.ENTITY_WIDOW, {"portrait_100.0_widow.png", "portrait_100.1_thewretched.png"}}, {EntityType.ENTITY_DADDYLONGLEGS, {"portrait_101.0_daddylonglegs.png", "portrait_101.1_triachnid.png"}}, {EntityType.ENTITY_ISAAC, {"portrait_102.0_isaac.png", "portrait_102.1_bluebaby.png"}}, {EntityType.ENTITY_THE_HAUNT, {"portrait_260.0_thehaunt.png"}}, {EntityType.ENTITY_DINGLE, {"portrait_261.0_dingle.png", "portrait_dangle.png"}}, {EntityType.ENTITY_MEGA_MAW, {"portrait_262.0_megamaw.png"}}, {EntityType.ENTITY_GATE, {"portrait_263.0_megamaw2.png"}}, {EntityType.ENTITY_MEGA_FATTY, {"portrait_264.0_megafatty.png"}}, {EntityType.ENTITY_CAGE, {"portrait_265.0_fatty2.png"}}, {EntityType.ENTITY_MAMA_GURDY, {"portrait_266.0_mamagurdy.png"}}, {EntityType.ENTITY_DARK_ONE, {"portrait_267.0_darkone.png"}}, {EntityType.ENTITY_ADVERSARY, {"portrait_268.0_darkone2.png"}}, {EntityType.ENTITY_POLYCEPHALUS, {"portrait_269.0_polycephalus.png", "portrait_269.1_polycephalus2.png"}}, {EntityType.ENTITY_MR_FRED, {"portrait_270.0_megafred.png"}}, {EntityType.ENTITY_THE_LAMB, {"portrait_273.0_thelamb.png"}}, {EntityType.ENTITY_MEGA_SATAN, {"portrait_274.0_megasatan.png"}}, {EntityType.ENTITY_GURGLING, {"portrait_276.0_gurglings.png", "portrait_turdlings.png"}}, {EntityType.ENTITY_STAIN, {"portrait_401.0_thestain.png"}}, {EntityType.ENTITY_BROWNIE, {"portrait_402.0_brownie.png"}}, {EntityType.ENTITY_FORSAKEN, {"portrait_403.0_theforsaken.png"}}, {EntityType.ENTITY_LITTLE_HORN, {"portrait_404.0_littlehorn.png"}}, {EntityType.ENTITY_RAG_MAN, {"portrait_405.0_ragman.png"}}, {EntityType.ENTITY_ULTRA_GREED, {"portrait_406.0_ultragreed.png"}}, {EntityType.ENTITY_HUSH, {"portrait_407.0_hush.png"}}, {EntityType.ENTITY_RAG_MEGA, {"portrait_ragmega.png"}}, {EntityType.ENTITY_SISTERS_VIS, {"portrait_sistersvis.png"}}, {EntityType.ENTITY_BIG_HORN, {"portrait_bighorn.png"}}, {EntityType.ENTITY_DELIRIUM, {"portrait_delirium.png"}}, {EntityType.ENTITY_MATRIARCH, {"portrait_matriarch.png"}}, {EntityType.ENTITY_REAP_CREEP, {"portrait_900.0_reapcreep.png"}}, {EntityType.ENTITY_LIL_BLUB, {"portrait_901.0_beelzeblub.png"}}, {EntityType.ENTITY_RAINMAKER, {"portrait_902.0_rainmaker.png"}}, {EntityType.ENTITY_VISAGE, {"portrait_903.0_visage.png"}}, {EntityType.ENTITY_SIREN, {"portrait_904.0_siren.png"}}, {EntityType.ENTITY_HERETIC, {"portrait_905.0_heretic.png"}}, {EntityType.ENTITY_HORNFEL, {"portrait_906.0_hornfel.png"}}, {EntityType.ENTITY_GIDEON, {"portrait_907.0_gideon.png"}}, {EntityType.ENTITY_BABY_PLUM, {"portrait_908.0_babyplum.png"}}, {EntityType.ENTITY_SCOURGE, {"portrait_909.0_scourge.png"}}, {EntityType.ENTITY_CHIMERA, {"portrait_910.0_chimera.png"}}, {EntityType.ENTITY_ROTGUT, {"portrait_911.0_rotgut.png"}}, {EntityType.ENTITY_MOTHER, {"portrait_mother.png"}}, {EntityType.ENTITY_MIN_MIN, {"portrait_minmin.png"}}, {EntityType.ENTITY_CLOG, {"portrait_clog.png"}}, {EntityType.ENTITY_SINGE, {"portrait_singe.png"}}, {EntityType.ENTITY_BUMBINO, {"portrait_bumbino.png"}}, {EntityType.ENTITY_COLOSTOMIA, {"portrait_colostomia.png"}}, {EntityType.ENTITY_TURDLET, {"portrait_turdlet.png"}}, {EntityType.ENTITY_RAGLICH, {"portrait_raglich.png"}}, {EntityType.ENTITY_HORNY_BOYS, {"portrait_hornyboys.png"}}, {EntityType.ENTITY_CLUTCH, {"portrait_clutch.png"}}, {EntityType.ENTITY_DOGMA, {"portrait_dogma.png"}}})
return ____exports
 end,
["features.optional.quality.showDreamCatcherItem.postNewRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local anyPlayerHasCollectible = ____misc.anyPlayerHasCollectible
local changeRoom = ____misc.changeRoom
local getRoomIndex = ____misc.getRoomIndex
local getRoomNPCs = ____misc.getRoomNPCs
local initGlowingItemSprite = ____misc.initGlowingItemSprite
local initSprite = ____misc.initSprite
local ____enums = require("types.enums")
local PickupPriceCustom = ____enums.PickupPriceCustom
local ____bossPNGMap = require("features.optional.quality.showDreamCatcherItem.bossPNGMap")
local bossPNGMap = ____bossPNGMap.bossPNGMap
local ____enums = require("features.optional.quality.showDreamCatcherItem.enums")
local WarpState = ____enums.WarpState
local revertItemPrices, warp, shouldWarp, getMinimapDisplayFlagsMap, getRoomIndexForType, getRoomItemsAndSetPrice, getRoomBosses, isBossException, bossInArray, resetRoomState, restoreMinimapDisplayFlags, setItemSprites, shouldShowSprites, initBossSprite
function revertItemPrices(self)
    local collectibles = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE)
    for ____, entity in ipairs(collectibles) do
        local pickup = entity:ToPickup()
        if (pickup ~= nil) and (pickup.Price == PickupPriceCustom.PRICE_NO_MINIMAP) then
            pickup.Price = 0
        end
    end
end
function warp(self)
    local stage = g.l:GetStage()
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    if not shouldWarp(nil) then
        return
    end
    g.run.level.dreamCatcher.warpState = WarpState.Warping
    local displayFlagsMap = getMinimapDisplayFlagsMap(nil)
    local treasureRoomIndex = getRoomIndexForType(nil, RoomType.ROOM_TREASURE)
    local bossRoomIndex = nil
    if (stage >= 1) and (stage <= 7) then
        bossRoomIndex = getRoomIndexForType(nil, RoomType.ROOM_BOSS)
    end
    if treasureRoomIndex ~= nil then
        changeRoom(nil, treasureRoomIndex)
        g.run.level.dreamCatcher.items = getRoomItemsAndSetPrice(nil)
    end
    if bossRoomIndex ~= nil then
        changeRoom(nil, bossRoomIndex)
        g.run.level.dreamCatcher.bosses = getRoomBosses(nil)
    end
    changeRoom(nil, startingRoomIndex)
    if treasureRoomIndex ~= nil then
        resetRoomState(nil, treasureRoomIndex)
    end
    if bossRoomIndex ~= nil then
        resetRoomState(nil, bossRoomIndex)
    end
    restoreMinimapDisplayFlags(nil, displayFlagsMap)
    g.run.level.dreamCatcher.warpState = WarpState.RepositioningPlayer
end
function shouldWarp(self)
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    local isFirstVisit = g.r:IsFirstVisit()
    local roomIndex = getRoomIndex(nil)
    return (((anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_DREAM_CATCHER) and (g.run.level.dreamCatcher.warpState == WarpState.Initial)) and (not g.g:IsGreedMode())) and (roomIndex == startingRoomIndex)) and isFirstVisit
end
function getMinimapDisplayFlagsMap(self)
    local displayFlags = {}
    local rooms = g.l:GetRooms()
    do
        local i = 0
        while i < rooms.Size do
            local room = rooms:Get(i)
            if room ~= nil then
                displayFlags[room.SafeGridIndex] = room.DisplayFlags
            end
            i = i + 1
        end
    end
    return displayFlags
end
function getRoomIndexForType(self, roomType)
    local rooms = g.l:GetRooms()
    do
        local i = 0
        while i < rooms.Size do
            local room = rooms:Get(i)
            if (room ~= nil) and (room.Data.Type == roomType) then
                return room.SafeGridIndex
            end
            i = i + 1
        end
    end
    return nil
end
function getRoomItemsAndSetPrice(self)
    local collectibleTypes = {}
    local collectibles = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE)
    for ____, entity in ipairs(collectibles) do
        __TS__ArrayPush(collectibleTypes, entity.SubType)
        local pickup = entity:ToPickup()
        if pickup ~= nil then
            pickup.Price = PickupPriceCustom.PRICE_NO_MINIMAP
        end
    end
    return collectibleTypes
end
function getRoomBosses(self)
    local bosses = {}
    for ____, npc in ipairs(
        getRoomNPCs(nil)
    ) do
        if npc:IsBoss() and (not isBossException(nil, npc.Type, npc.Variant)) then
            local bossArray = {npc.Type, npc.Variant}
            if not bossInArray(nil, bossArray, bosses) then
                __TS__ArrayPush(bosses, bossArray)
            end
        end
    end
    return bosses
end
function isBossException(self, ____type, variant)
    if ____type == EntityType.ENTITY_GEMINI then
        return (((variant == 10) or (variant == 11)) or (variant == 12)) or (variant == 20)
    end
    return false
end
function bossInArray(self, newBossArray, bosses)
    for ____, bossArray in ipairs(bosses) do
        if (bossArray[1] == newBossArray[1]) and (bossArray[2] == newBossArray[2]) then
            return true
        end
    end
    return false
end
function resetRoomState(self, roomIndex)
    local room = g.l:GetRoomByIdx(roomIndex)
    room.VisitedCount = 0
    room.Clear = false
    room.ClearCount = 0
end
function restoreMinimapDisplayFlags(self, displayFlagsMap)
    for gridIndex, displayFlags in pairs(displayFlagsMap) do
        local room = g.l:GetRoomByIdx(gridIndex)
        room.DisplayFlags = displayFlags
    end
    g.l:UpdateVisibility()
end
function setItemSprites(self)
    if not shouldShowSprites(nil) then
        g.run.level.dreamCatcher.dreamCatcherSprite = nil
        g.run.level.dreamCatcher.itemSprites = {}
        g.run.level.dreamCatcher.bossSprites = {}
        return
    end
    g.run.level.dreamCatcher.dreamCatcherSprite = initGlowingItemSprite(nil, CollectibleType.COLLECTIBLE_DREAM_CATCHER)
    do
        local i = 0
        while i < #g.run.level.dreamCatcher.items do
            if g.run.level.dreamCatcher.itemSprites[i + 1] == nil then
                local collectibleType = g.run.level.dreamCatcher.items[i + 1]
                g.run.level.dreamCatcher.itemSprites[i + 1] = initGlowingItemSprite(nil, collectibleType)
            end
            i = i + 1
        end
    end
    do
        local i = 0
        while i < #g.run.level.dreamCatcher.bosses do
            if g.run.level.dreamCatcher.bossSprites[i + 1] == nil then
                local entityType, variant = table.unpack(g.run.level.dreamCatcher.bosses[i + 1])
                g.run.level.dreamCatcher.bossSprites[i + 1] = initBossSprite(nil, entityType, variant)
            end
            i = i + 1
        end
    end
end
function shouldShowSprites(self)
    local startingRoomIndex = g.l:GetStartingRoomIndex()
    local roomIndex = getRoomIndex(nil)
    return ((#g.run.level.dreamCatcher.items > 0) and (roomIndex == startingRoomIndex)) and (not g.g:IsGreedMode())
end
function initBossSprite(self, entityType, variant)
    local pngArray = bossPNGMap:get(entityType)
    if pngArray == nil then
        error(
            ("Failed to find the boss of " .. tostring(entityType)) .. " in the boss PNG map."
        )
    end
    local pngFileName = pngArray[variant + 1]
    if pngFileName == nil then
        error(
            ((("Failed to find the boss of " .. tostring(entityType)) .. ".") .. tostring(variant)) .. " in the boss PNG map."
        )
    end
    local pngPath = "gfx/ui/boss/" .. pngFileName
    return initSprite(nil, "gfx/boss.anm2", pngPath)
end
function ____exports.main(self)
    if not g.config.showDreamCatcherItem then
        return
    end
    revertItemPrices(nil)
    warp(nil)
    setItemSprites(nil)
end
return ____exports
 end,
["features.optional.quality.subvertTeleport"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local moveEsauNextToJacob = ____misc.moveEsauNextToJacob
local ENTITIES_THAT_CAUSE_TELEPORT, TOP_DOOR_POSITION, LEFT_DOOR_POSITION, RIGHT_DOOR_POSITION, BOTTOM_DOOR_POSITION, shouldSubvertTeleport, subvertTeleport, getNormalRoomEnterPosition, shouldForceMomStomp, forceMomStomp
function shouldSubvertTeleport(self)
    local roomShape = g.r:GetRoomShape()
    if roomShape ~= RoomShape.ROOMSHAPE_1x1 then
        return false
    end
    for ____, entityType in ipairs(ENTITIES_THAT_CAUSE_TELEPORT) do
        local entities = Isaac.FindByType(entityType, -1, -1, false, true)
        if #entities > 0 then
            return true
        end
    end
    return false
end
function subvertTeleport(self)
    local normalPosition = getNormalRoomEnterPosition(nil)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        player.Position = normalPosition
        local character = player:GetPlayerType()
        if character == PlayerType.PLAYER_THESOUL then
            g.run.switchForgotten = true
        end
    end
    moveEsauNextToJacob(nil)
    local familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR)
    for ____, familiar in ipairs(familiars) do
        familiar.Position = normalPosition
    end
    log(nil, "Subverted a teleport.")
end
function getNormalRoomEnterPosition(self)
    local ____switch15 = g.l.LeaveDoor
    if ____switch15 == DoorSlot.LEFT0 then
        goto ____switch15_case_0
    elseif ____switch15 == DoorSlot.UP0 then
        goto ____switch15_case_1
    elseif ____switch15 == DoorSlot.RIGHT0 then
        goto ____switch15_case_2
    elseif ____switch15 == DoorSlot.DOWN0 then
        goto ____switch15_case_3
    elseif ____switch15 == DoorSlot.LEFT1 then
        goto ____switch15_case_4
    elseif ____switch15 == DoorSlot.UP1 then
        goto ____switch15_case_5
    elseif ____switch15 == DoorSlot.RIGHT1 then
        goto ____switch15_case_6
    elseif ____switch15 == DoorSlot.DOWN1 then
        goto ____switch15_case_7
    end
    goto ____switch15_case_default
    ::____switch15_case_0::
    do
        do
            return RIGHT_DOOR_POSITION
        end
    end
    ::____switch15_case_1::
    do
        do
            return BOTTOM_DOOR_POSITION
        end
    end
    ::____switch15_case_2::
    do
        do
            return LEFT_DOOR_POSITION
        end
    end
    ::____switch15_case_3::
    do
        do
            return TOP_DOOR_POSITION
        end
    end
    ::____switch15_case_4::
    do
        do
            return RIGHT_DOOR_POSITION
        end
    end
    ::____switch15_case_5::
    do
        do
            return BOTTOM_DOOR_POSITION
        end
    end
    ::____switch15_case_6::
    do
        do
            return LEFT_DOOR_POSITION
        end
    end
    ::____switch15_case_7::
    do
        do
            return TOP_DOOR_POSITION
        end
    end
    ::____switch15_case_default::
    do
        do
            return BOTTOM_DOOR_POSITION
        end
    end
    ::____switch15_end::
end
function shouldForceMomStomp(self)
    local moms = Isaac.FindByType(EntityType.ENTITY_MOM, -1, -1, false, true)
    return #moms > 0
end
function forceMomStomp(self)
end
ENTITIES_THAT_CAUSE_TELEPORT = {EntityType.ENTITY_GURDY, EntityType.ENTITY_MOM, EntityType.ENTITY_MOMS_HEART}
TOP_DOOR_POSITION = Vector(320, 160)
LEFT_DOOR_POSITION = Vector(80, 280)
RIGHT_DOOR_POSITION = Vector(560, 280)
BOTTOM_DOOR_POSITION = Vector(320, 400)
function ____exports.postNewRoom(self)
    if not g.config.subvertTeleport then
        return
    end
    if shouldSubvertTeleport(nil) then
        subvertTeleport(nil)
        if shouldForceMomStomp(nil) then
            forceMomStomp(nil)
        end
    end
end
return ____exports
 end,
["features.race.banFirstFloorTreasureRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____constants = require("constants")
local MAX_NUM_DOORS = ____constants.MAX_NUM_DOORS
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local isAntibirthStage = ____misc.isAntibirthStage
local shouldBanB1TreasureRoom
function shouldBanB1TreasureRoom(self)
    local stage = g.l:GetStage()
    return ((((stage == 1) and (not isAntibirthStage(nil))) and (g.race.status == "in progress")) and (g.race.myStatus == "racing")) and (g.race.format == "seeded")
end
function ____exports.postNewRoom(self)
    if not shouldBanB1TreasureRoom(nil) then
        return
    end
    local roomIndex = g.l:QueryRoomTypeIndex(
        RoomType.ROOM_TREASURE,
        false,
        RNG()
    )
    do
        local i = 0
        while i < MAX_NUM_DOORS do
            local door = g.r:GetDoor(i)
            if (door ~= nil) and (door.TargetRoomIndex == roomIndex) then
                g.r:RemoveDoor(i)
                log(nil, "Removed the Treasure Room door on B1.")
            end
            i = i + 1
        end
    end
    local roomDesc
    if MinimapAPI == nil then
        roomDesc = g.l:GetRoomByIdx(roomIndex)
        roomDesc.DisplayFlags = 0
        g.l:UpdateVisibility()
    else
        roomDesc = MinimapAPI:GetRoomByIdx(roomIndex)
        if roomDesc ~= nil then
            roomDesc:Remove()
        end
    end
end
return ____exports
 end,
["features.race.callbacks.postNewRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local banFirstFloorTreasureRoom = require("features.race.banFirstFloorTreasureRoom")
local raceRoom = require("features.race.raceRoom")
local socket = require("features.race.socket")
local startingRoom = require("features.race.startingRoom")
local tempMoreOptions = require("features.race.tempMoreOptions")
local topSprite = require("features.race.topSprite")
function ____exports.main(self)
    if not g.config.clientCommunication then
        return
    end
    socket:postNewRoom()
    tempMoreOptions:postNewRoom()
    raceRoom:postNewRoom()
    startingRoom:postNewRoom()
    topSprite:postNewRoom()
    banFirstFloorTreasureRoom:postNewRoom()
end
return ____exports
 end,
["callbacks.postNewRoom"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local cache = require("cache")
local controlsGraphic = require("features.mandatory.controlsGraphic")
local detectSlideAnimation = require("features.mandatory.detectSlideAnimation")
local trophy = require("features.mandatory.trophy")
local fastSatan = require("features.optional.bosses.fastSatan")
local teleportInvalidEntrance = require("features.optional.bugfix.teleportInvalidEntrance")
local appearHands = require("features.optional.enemies.appearHands")
local fastTravelPostNewRoom = require("features.optional.major.fastTravel.callbacks.postNewRoom")
local freeDevilItem = require("features.optional.major.freeDevilItem")
local startWithD6 = require("features.optional.major.startWithD6")
local showDreamCatcherItemPostNewRoom = require("features.optional.quality.showDreamCatcherItem.postNewRoom")
local showEdenStartingItems = require("features.optional.quality.showEdenStartingItems")
local subvertTeleport = require("features.optional.quality.subvertTeleport")
local racePostNewRoom = require("features.race.callbacks.postNewRoom")
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____GlobalsRunRoom = require("types.GlobalsRunRoom")
local GlobalsRunRoom = ____GlobalsRunRoom.default
function ____exports.newRoom(self)
    local gameFrameCount = g.g:GetFrameCount()
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomData = roomDesc.Data
    local roomStageID = roomData.StageID
    local roomVariant = roomData.Variant
    local isClear = g.r:IsClear()
    log(
        nil,
        ((((((((("MC_POST_NEW_ROOM_2 - " .. tostring(roomStageID)) .. ".") .. tostring(roomVariant)) .. " (on stage ") .. tostring(stage)) .. ".") .. tostring(stageType)) .. ") (game frame ") .. tostring(gameFrameCount)) .. ")"
    )
    g.run.room = __TS__New(GlobalsRunRoom, isClear)
    local ____obj, ____index = g.run, "roomsEntered"
    ____obj[____index] = ____obj[____index] + 1
    detectSlideAnimation:postNewRoom()
    controlsGraphic:postNewRoom()
    racePostNewRoom:main()
    trophy:postNewRoom()
    startWithD6:postNewRoom()
    freeDevilItem:postNewRoom()
    fastTravelPostNewRoom:main()
    showEdenStartingItems:postNewRoom()
    fastSatan:postNewRoom()
    appearHands:postNewRoom()
    showDreamCatcherItemPostNewRoom:main()
    subvertTeleport:postNewRoom()
    teleportInvalidEntrance:postNewRoom()
end
function ____exports.main(self)
    cache:updateAPIFunctions()
    local gameFrameCount = g.g:GetFrameCount()
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomData = roomDesc.Data
    local roomStageID = roomData.StageID
    local roomVariant = roomData.Variant
    log(
        nil,
        ((((((((("MC_POST_NEW_ROOM - " .. tostring(roomStageID)) .. ".") .. tostring(roomVariant)) .. " (on stage ") .. tostring(stage)) .. ".") .. tostring(stageType)) .. ") (game frame ") .. tostring(gameFrameCount)) .. ")"
    )
    if (((gameFrameCount == 0) or (g.run.level.stage ~= stage)) or (g.run.level.stageType ~= stageType)) and (not g.run.forceNextRoom) then
        return
    end
    g.run.forceNextRoom = false
    ____exports.newRoom(nil)
end
return ____exports
 end,
["callbacks.postNewLevel"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local streakText = require("features.mandatory.streakText")
local openHushDoor = require("features.optional.quality.openHushDoor")
local silenceMomDad = require("features.optional.sound.silenceMomDad")
local racePostNewLevel = require("features.race.callbacks.postNewLevel")
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local isAntibirthStage = ____misc.isAntibirthStage
local saveDat = require("saveDat")
local ____GlobalsRunLevel = require("types.GlobalsRunLevel")
local GlobalsRunLevel = ____GlobalsRunLevel.default
local postNewRoom = require("callbacks.postNewRoom")
local shouldShowLevelText, showLevelText, getLevelText, goingToRaceRoom, oneOrMorePlayersIsRandomBaby
function ____exports.newLevel(self)
    local gameFrameCount = g.g:GetFrameCount()
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    log(
        nil,
        ((((("MC_POST_NEW_LEVEL_2 - " .. tostring(stage)) .. ".") .. tostring(stageType)) .. " (game frame ") .. tostring(gameFrameCount)) .. ")"
    )
    g.run.level = __TS__New(GlobalsRunLevel, stage, stageType)
    saveDat:save()
    if shouldShowLevelText(nil) then
        showLevelText(nil, stage)
    end
    racePostNewLevel:main()
    openHushDoor:postNewLevel()
    silenceMomDad:postNewLevel()
    postNewRoom:newRoom()
end
function shouldShowLevelText(self)
    return (not g.raceVars.finished) and (not oneOrMorePlayersIsRandomBaby(nil))
end
function showLevelText(self, stage)
    if VanillaStreakText and ((stage ~= 1) or isAntibirthStage(nil)) then
        g.l:ShowName(false)
    elseif not goingToRaceRoom(nil) then
        local text = getLevelText(nil)
        streakText:set(text)
    end
end
function getLevelText(self)
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    if stage == 9 then
        return "Blue Womb"
    end
    return g.l:GetName(stage, stageType)
end
function goingToRaceRoom(self)
    local stage = g.l:GetStage()
    return ((g.race.status == "open") and (stage == 1)) and ((g.run.roomsEntered == 0) or (g.run.roomsEntered == 1))
end
function oneOrMorePlayersIsRandomBaby(self)
    local randomBaby = Isaac.GetPlayerTypeByName("Random Baby")
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local character = player:GetPlayerType()
        if character == randomBaby then
            return true
        end
    end
    return false
end
function ____exports.main(self)
    local gameFrameCount = g.g:GetFrameCount()
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    log(
        nil,
        ((((("MC_POST_NEW_LEVEL - " .. tostring(stage)) .. ".") .. tostring(stageType)) .. " (game frame ") .. tostring(gameFrameCount)) .. ")"
    )
    if (gameFrameCount == 0) and (not g.run.forceNextLevel) then
        return
    end
    g.run.forceNextLevel = false
    ____exports.newLevel(nil)
end
return ____exports
 end,
["callbacks.postGameStarted"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local centerStart = require("features.mandatory.centerStart")
local removeKarma = require("features.mandatory.removeKarma")
local removeMercurius = require("features.mandatory.removeMercurius")
local saveFileCheck = require("features.mandatory.saveFileCheck")
local seededDrops = require("features.mandatory.seededDrops")
local seededFloors = require("features.mandatory.seededFloors")
local startWithD6 = require("features.optional.major.startWithD6")
local judasAddBomb = require("features.optional.quality.judasAddBomb")
local samsonDropHeart = require("features.optional.quality.samsonDropHeart")
local showEdenStartingItems = require("features.optional.quality.showEdenStartingItems")
local taintedKeeperMoney = require("features.optional.quality.taintedKeeperMoney")
local racePostGameStarted = require("features.race.callbacks.postGameStarted")
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local saveDat = require("saveDat")
local ____enums = require("types.enums")
local CollectibleTypeCustom = ____enums.CollectibleTypeCustom
local SaveFileState = ____enums.SaveFileState
local ____GlobalsRun = require("types.GlobalsRun")
local GlobalsRun = ____GlobalsRun.default
local postNewLevel = require("callbacks.postNewLevel")
local setSeeds, isCorruptMod
function setSeeds(self)
    g.seeds:RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN)
    g.seeds:AddSeedEffect(SeedEffect.SEED_PREVENT_CURSE_DARKNESS)
end
function ____exports.continued(self)
    saveDat:load()
    if g.saveFile.state == SaveFileState.NotChecked then
        g.saveFile.state = SaveFileState.DeferredUntilNewRunBegins
    end
end
function isCorruptMod(self)
    local sprite = Sprite()
    sprite:Load("gfx/ui/boss/versusscreen.anm2", true)
    sprite:SetFrame("Scene", 0)
    sprite:SetLastFrame()
    local lastFrame = sprite:GetFrame()
    if lastFrame ~= 0 then
        log(
            nil,
            ("Error: Corrupted Racing+ instantiation detected. (The last frame of the \"Scene\" animation is frame " .. tostring(lastFrame)) .. ".)"
        )
        g.corrupted = true
    end
    return g.corrupted
end
function ____exports.main(self, isContinued)
    local startSeedString = g.seeds:GetStartSeedString()
    local isaacFrameCount = Isaac.GetFrameCount()
    log(
        nil,
        (("MC_POST_GAME_STARTED - Seed: " .. startSeedString) .. " - IsaacFrame: ") .. tostring(isaacFrameCount)
    )
    setSeeds(nil)
    if MinimapAPI ~= nil then
        MinimapAPI.Config.Disable = false
    end
    if isContinued then
        ____exports.continued(nil)
        return
    end
    g.run = __TS__New(
        GlobalsRun,
        getPlayers(nil)
    )
    if isCorruptMod(nil) or (not saveFileCheck:isFullyUnlocked()) then
        return
    end
    removeMercurius:postGameStarted()
    removeKarma:postGameStarted()
    seededDrops:postGameStarted()
    seededFloors:postGameStarted()
    centerStart:postGameStarted()
    showEdenStartingItems:postGameStarted()
    racePostGameStarted:main()
    startWithD6:postGameStarted()
    samsonDropHeart:postGameStarted()
    judasAddBomb:postGameStarted()
    taintedKeeperMoney:postGameStarted()
    if ((g.race.status ~= "in progress") or (g.race.myStatus ~= "racing")) or (g.race.format ~= "diversity") then
        g.itemPool:RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1)
        g.itemPool:RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2)
        g.itemPool:RemoveCollectible(CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3)
    end
    postNewLevel:newLevel()
end
return ____exports
 end,
["features.optional.major.fastClear.callbacks.postNPCRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local checkFinalFrameOfDeathAnimation
function checkFinalFrameOfDeathAnimation(self, npc)
    local data = npc:GetData()
    if data.resetAttributeFrame == nil then
        return
    end
    local sprite = npc:GetSprite()
    local animation = sprite:GetAnimation()
    local animationFrame = sprite:GetFrame()
    if (animation == "Death") and (animationFrame == data.resetAttributeFrame) then
        npc.CanShutDoors = true
        data.resetAttributeFrame = nil
    end
end
function ____exports.main(self, npc)
    if not g.config.fastClear then
        return
    end
    checkFinalFrameOfDeathAnimation(nil, npc)
end
return ____exports
 end,
["callbacks.postNPCRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fastClearPostNPCRender = require("features.optional.major.fastClear.callbacks.postNPCRender")
function ____exports.main(self, npc)
    fastClearPostNPCRender:main(npc)
end
return ____exports
 end,
["features.optional.bosses.fastHaunt"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local FIRST_LIL_HAUNT_UPDATE_FRAME, BLACK_CHAMPION_COLOR_IDX, checkDetachLilHaunts, getAttachedLilHaunts, getLowestIndexLilHaunt, detachLilHaunt, checkAngrySkinAnimation
function checkDetachLilHaunts(self, npc)
    if npc.FrameCount ~= FIRST_LIL_HAUNT_UPDATE_FRAME then
        return
    end
    local colorIdx = npc:GetBossColorIdx()
    local attachedLilHaunts = getAttachedLilHaunts(nil, npc)
    if colorIdx == BLACK_CHAMPION_COLOR_IDX then
        __TS__ArrayForEach(
            attachedLilHaunts,
            function(____, lilHaunt)
                detachLilHaunt(nil, lilHaunt)
            end
        )
    else
        local lowestIndexLilHaunt = getLowestIndexLilHaunt(nil, attachedLilHaunts)
        if lowestIndexLilHaunt ~= nil then
            detachLilHaunt(nil, lowestIndexLilHaunt)
        end
    end
end
function getAttachedLilHaunts(self, haunt)
    local hauntPtrHash = GetPtrHash(haunt)
    local lilHaunts = Isaac.FindByType(EntityType.ENTITY_THE_HAUNT, 10)
    local childrenLilHaunts = {}
    for ____, lilHaunt in ipairs(lilHaunts) do
        local npc = lilHaunt:ToNPC()
        if ((npc ~= nil) and (npc.Parent ~= nil)) and (GetPtrHash(npc.Parent) == hauntPtrHash) then
            __TS__ArrayPush(childrenLilHaunts, npc)
        end
    end
    return childrenLilHaunts
end
function getLowestIndexLilHaunt(self, lilHaunts)
    local lowestIndexLilHaunt = nil
    for ____, lilHaunt in ipairs(lilHaunts) do
        if (lowestIndexLilHaunt == nil) or (lilHaunt.Index < lowestIndexLilHaunt.Index) then
            lowestIndexLilHaunt = lilHaunt
        end
    end
    return lowestIndexLilHaunt
end
function detachLilHaunt(self, npc)
    npc.State = NpcState.STATE_MOVE
    npc:SetColor(Color.Default, 0, 0)
end
function checkAngrySkinAnimation(self, npc)
    local sprite = npc:GetSprite()
    local animation = sprite:GetAnimation()
    local ____switch19 = animation
    if ____switch19 == "AngrySkin" then
        goto ____switch19_case_0
    elseif ____switch19 == "Peel" then
        goto ____switch19_case_1
    elseif ____switch19 == "IdleNoSkin" then
        goto ____switch19_case_2
    end
    goto ____switch19_case_default
    ::____switch19_case_0::
    do
        do
            local spedUpSpeed = 2
            if sprite.PlaybackSpeed ~= spedUpSpeed then
                sprite.PlaybackSpeed = spedUpSpeed
            end
            goto ____switch19_end
        end
    end
    ::____switch19_case_1::
    do
        do
            local spedUpSpeed = 4
            if sprite.PlaybackSpeed ~= spedUpSpeed then
                sprite.PlaybackSpeed = spedUpSpeed
            end
            goto ____switch19_end
        end
    end
    ::____switch19_case_2::
    do
        do
            local normalSpeed = 1
            if sprite.PlaybackSpeed ~= normalSpeed then
                sprite.PlaybackSpeed = normalSpeed
            end
            goto ____switch19_end
        end
    end
    ::____switch19_case_default::
    do
        do
            goto ____switch19_end
        end
    end
    ::____switch19_end::
end
FIRST_LIL_HAUNT_UPDATE_FRAME = 19
BLACK_CHAMPION_COLOR_IDX = 17
function ____exports.postNPCUpdate(self, npc)
    if not g.config.fastHaunt then
        return
    end
    if npc.Variant ~= 0 then
        return
    end
    checkDetachLilHaunts(nil, npc)
    checkAngrySkinAnimation(nil, npc)
end
return ____exports
 end,
["features.optional.bosses.stopDeathSlow"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.postNPCUpdate(self, npc)
    if not g.config.stopDeathSlow then
        return
    end
    if npc.Variant ~= 0 then
        return
    end
    if npc.State == NpcState.STATE_ATTACK then
        npc.State = NpcState.STATE_MOVE
    end
end
return ____exports
 end,
["features.optional.enemies.disableInvulnerability"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.setGhostCollisionClass(self, npc)
    if not g.config.disableInvulnerability then
        return
    end
    if (npc.Type == EntityType.ENTITY_THE_HAUNT) and (npc.Variant ~= 10) then
        return
    end
    if npc.FrameCount == 0 then
        npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_PLAYEROBJECTS
    end
end
return ____exports
 end,
["features.optional.enemies.fastGhosts"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.postNPCUpdate(self, npc)
    if not g.config.fastGhosts then
        return
    end
    if (npc.State == NpcState.STATE_IDLE) and (npc.StateFrame ~= 0) then
        npc.StateFrame = 0
    end
end
return ____exports
 end,
["features.optional.enemies.fastHands"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local SHADOW_APPEAR_FRAME, START_FRAME, DELAY_FRAMES, speedUpInitialDelay, checkOtherHandOverlap, isOtherHandOverlapping
function speedUpInitialDelay(self, npc)
    if npc.StateFrame < START_FRAME then
        npc.StateFrame = START_FRAME
    end
end
function checkOtherHandOverlap(self, npc)
    if npc.StateFrame == SHADOW_APPEAR_FRAME then
        if isOtherHandOverlapping(nil, npc) then
            npc.StateFrame = npc.StateFrame + DELAY_FRAMES
        end
    end
end
function isOtherHandOverlapping(self, initialHand)
    local momsHands = Isaac.FindByType(EntityType.ENTITY_MOMS_HAND)
    local momsDeadHands = Isaac.FindByType(EntityType.ENTITY_MOMS_DEAD_HAND)
    local hands = __TS__ArrayConcat(momsHands, momsDeadHands)
    for ____, hand in ipairs(hands) do
        local npc = hand:ToNPC()
        if (((npc ~= nil) and (GetPtrHash(npc) ~= GetPtrHash(initialHand))) and (npc.State == NpcState.STATE_MOVE)) and (npc.StateFrame == initialHand.StateFrame) then
            return true
        end
    end
    return false
end
SHADOW_APPEAR_FRAME = 40
START_FRAME = SHADOW_APPEAR_FRAME - 15
DELAY_FRAMES = 4
function ____exports.postNPCUpdate(self, npc)
    if not g.config.fastHands then
        return
    end
    if npc.State == NpcState.STATE_MOVE then
        speedUpInitialDelay(nil, npc)
        checkOtherHandOverlap(nil, npc)
    end
end
return ____exports
 end,
["features.optional.enemies.globinSoftlock"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local MAX_REGENERATIONS = 4
function ____exports.postNPCUpdate(self, npc)
    if not g.config.globinSoftlock then
        return
    end
    local data = npc:GetData()
    if npc.State == data.lastState then
        return
    end
    data.lastState = npc.State
    if npc.State ~= NpcState.STATE_IDLE then
        return
    end
    if data.numRegenerations == nil then
        data.numRegenerations = 0
    end
    data.numRegenerations = data.numRegenerations + 1
    if data.numRegenerations == MAX_REGENERATIONS then
        npc:Kill()
        log(nil, "Manually killed a Globin to prevent a softlock.")
    end
end
return ____exports
 end,
["callbacks.postNPCUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fastHaunt = require("features.optional.bosses.fastHaunt")
local stopDeathSlow = require("features.optional.bosses.stopDeathSlow")
local appearHands = require("features.optional.enemies.appearHands")
local disableInvulnerability = require("features.optional.enemies.disableInvulnerability")
local fastGhosts = require("features.optional.enemies.fastGhosts")
local fastHands = require("features.optional.enemies.fastHands")
local globinSoftlock = require("features.optional.enemies.globinSoftlock")
function ____exports.globin(self, npc)
    globinSoftlock:postNPCUpdate(npc)
end
function ____exports.death(self, npc)
    stopDeathSlow:postNPCUpdate(npc)
end
function ____exports.momsHand(self, npc)
    appearHands:postNPCUpdate(npc)
    fastHands:postNPCUpdate(npc)
end
function ____exports.wizoob(self, npc)
    disableInvulnerability:setGhostCollisionClass(npc)
    fastGhosts:postNPCUpdate(npc)
end
function ____exports.haunt(self, npc)
    disableInvulnerability:setGhostCollisionClass(npc)
    fastHaunt:postNPCUpdate(npc)
end
function ____exports.redGhost(self, npc)
    disableInvulnerability:setGhostCollisionClass(npc)
    fastGhosts:postNPCUpdate(npc)
end
function ____exports.momsDeadHand(self, npc)
    appearHands:postNPCUpdate(npc)
    fastHands:postNPCUpdate(npc)
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, ____exports.globin, EntityType.ENTITY_GLOBIN)
    mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, ____exports.death, EntityType.ENTITY_DEATH)
    mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, ____exports.momsHand, EntityType.ENTITY_MOMS_HAND)
    mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, ____exports.wizoob, EntityType.ENTITY_WIZOOB)
    mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, ____exports.haunt, EntityType.ENTITY_THE_HAUNT)
    mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, ____exports.redGhost, EntityType.ENTITY_RED_GHOST)
    mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, ____exports.momsDeadHand, EntityType.ENTITY_MOMS_DEAD_HAND)
end
return ____exports
 end,
["features.optional.graphics.flyItemSprites"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local COLLECTIBLE_SPRITE_LAYER = ____constants.COLLECTIBLE_SPRITE_LAYER
local ____globals = require("globals")
local g = ____globals.default
local PNG_DIRECTORY = "gfx/items/collectibles"
local CUSTOM_PNG_MAP = __TS__New(Map, {{CollectibleType.COLLECTIBLE_DISTANT_ADMIRATION, "collectibles_057_distantadmiration_custom.png"}, {CollectibleType.COLLECTIBLE_FOREVER_ALONE, "collectibles_128_foreveralone_custom.png"}, {CollectibleType.COLLECTIBLE_FRIEND_ZONE, "collectibles_364_friendzone_custom.png"}})
function ____exports.postPickupInit(self, pickup)
    if not g.config.flyItemSprites then
        return
    end
    local customSprite = CUSTOM_PNG_MAP:get(pickup.SubType)
    if customSprite ~= nil then
        local sprite = pickup:GetSprite()
        sprite:ReplaceSpritesheet(COLLECTIBLE_SPRITE_LAYER, (PNG_DIRECTORY .. "/") .. customSprite)
        sprite:LoadGraphics()
    end
end
return ____exports
 end,
["features.optional.graphics.starOfBethlehem"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____constants = require("constants")
local COLLECTIBLE_SPRITE_LAYER = ____constants.COLLECTIBLE_SPRITE_LAYER
local ____globals = require("globals")
local g = ____globals.default
local CUSTOM_PNG_PATH = "gfx/items/collectibles/collectibles_651_starofbethlehem_custom.png"
function ____exports.postPickupInit(self, pickup)
    if not g.config.starOfBethlehem then
        return
    end
    if pickup.SubType == CollectibleType.COLLECTIBLE_STAR_OF_BETHLEHEM then
        local sprite = pickup:GetSprite()
        sprite:ReplaceSpritesheet(COLLECTIBLE_SPRITE_LAYER, CUSTOM_PNG_PATH)
        sprite:LoadGraphics()
    end
end
return ____exports
 end,
["features.optional.graphics.twentyTwenty"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____constants = require("constants")
local COLLECTIBLE_SPRITE_LAYER = ____constants.COLLECTIBLE_SPRITE_LAYER
local ____globals = require("globals")
local g = ____globals.default
local CUSTOM_PNG_PATH = "gfx/items/collectibles/collectibles_245_2020_custom.png"
function ____exports.postPickupInit(self, pickup)
    if not g.config.twentyTwenty then
        return
    end
    if pickup.SubType == CollectibleType.COLLECTIBLE_20_20 then
        local sprite = pickup:GetSprite()
        sprite:ReplaceSpritesheet(COLLECTIBLE_SPRITE_LAYER, CUSTOM_PNG_PATH)
        sprite:LoadGraphics()
    end
end
return ____exports
 end,
["features.optional.major.fastTravel.bigChest"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local anyPlayerHasCollectible = ____misc.anyPlayerHasCollectible
local ensureAllCases = ____misc.ensureAllCases
local getRoomIndex = ____misc.getRoomIndex
local isAntibirthStage = ____misc.isAntibirthStage
local ____enums = require("types.enums")
local CollectibleTypeCustom = ____enums.CollectibleTypeCustom
local trophy = require("features.mandatory.trophy")
local ____enums = require("features.speedrun.enums")
local ChallengeCustom = ____enums.ChallengeCustom
local ____enums = require("features.optional.major.fastTravel.enums")
local FastTravelEntityType = ____enums.FastTravelEntityType
local fastTravel = require("features.optional.major.fastTravel.fastTravel")
local ReplacementAction, DEFAULT_REPLACEMENT_ACTION, getReplacementAction, season1, blueBaby, theLamb, megaSatan, hush, delirium, mother, bossRush, replace
function getReplacementAction(self)
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    local challenge = Isaac.GetChallenge()
    if ((stage == 10) and (stageType == 0)) and anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_NEGATIVE) then
        return ReplacementAction.TrapdoorDown
    end
    if ((stage == 10) and (stageType == 1)) and anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_POLAROID) then
        return ReplacementAction.BeamOfLightUp
    end
    if challenge == ChallengeCustom.SEASON_1 then
        return season1(nil)
    end
    if g.raceVars.finished then
        return ReplacementAction.VictoryLap
    end
    if (g.race.status == "in progress") and (g.race.myStatus == "racing") then
        if g.race.goal == "Blue Baby" then
            return blueBaby(nil)
        end
        if g.race.goal == "The Lamb" then
            return theLamb(nil)
        end
        if g.race.goal == "Mega Satan" then
            return megaSatan(nil)
        end
        if g.race.goal == "Hush" then
            return hush(nil)
        end
        if g.race.goal == "Delirium" then
            return delirium(nil)
        end
        if g.race.goal == "Mother" then
            return mother(nil)
        end
        if g.race.goal == "Boss Rush" then
            return bossRush(nil)
        end
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function season1(self)
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    if (stage == 11) and (stageType == 1) then
        if g.speedrun.characterNum == 7 then
            return ReplacementAction.Trophy
        end
        return ReplacementAction.Checkpoint
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function blueBaby(self)
    local roomIndex = getRoomIndex(nil)
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    if ((stage == 11) and (stageType == 1)) and (roomIndex ~= GridRooms.ROOM_MEGA_SATAN_IDX) then
        return ReplacementAction.Trophy
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function theLamb(self)
    local roomIndex = getRoomIndex(nil)
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    if ((stage == 11) and (stageType == 0)) and (roomIndex ~= GridRooms.ROOM_MEGA_SATAN_IDX) then
        return ReplacementAction.Trophy
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function megaSatan(self)
    local roomIndex = getRoomIndex(nil)
    local stage = g.l:GetStage()
    if (stage == 11) and (roomIndex ~= GridRooms.ROOM_MEGA_SATAN_IDX) then
        return ReplacementAction.Remove
    end
    if (stage == 11) and (roomIndex == GridRooms.ROOM_MEGA_SATAN_IDX) then
        return ReplacementAction.Trophy
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function hush(self)
    local stage = g.l:GetStage()
    if stage == 9 then
        return ReplacementAction.Trophy
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function delirium(self)
    local stage = g.l:GetStage()
    if stage == 12 then
        return ReplacementAction.Trophy
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function mother(self)
    local stage = g.l:GetStage()
    local antibirthStage = isAntibirthStage(nil)
    if (stage == 8) and antibirthStage then
        return ReplacementAction.Trophy
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function bossRush(self)
    local stage = g.l:GetStage()
    if stage == 6 then
        return ReplacementAction.Trophy
    end
    return DEFAULT_REPLACEMENT_ACTION
end
function replace(self, pickup, replacementAction)
    local position = g.r:FindFreePickupSpawnPosition(pickup.Position)
    if replacementAction ~= ReplacementAction.LeaveAlone then
        pickup:Remove()
    end
    local ____switch36 = replacementAction
    if ____switch36 == ReplacementAction.LeaveAlone then
        goto ____switch36_case_0
    elseif ____switch36 == ReplacementAction.TrapdoorDown then
        goto ____switch36_case_1
    elseif ____switch36 == ReplacementAction.BeamOfLightUp then
        goto ____switch36_case_2
    elseif ____switch36 == ReplacementAction.Checkpoint then
        goto ____switch36_case_3
    elseif ____switch36 == ReplacementAction.Trophy then
        goto ____switch36_case_4
    elseif ____switch36 == ReplacementAction.VictoryLap then
        goto ____switch36_case_5
    elseif ____switch36 == ReplacementAction.Remove then
        goto ____switch36_case_6
    end
    goto ____switch36_case_default
    ::____switch36_case_0::
    do
        do
            pickup.Touched = true
            goto ____switch36_end
        end
    end
    ::____switch36_case_1::
    do
        do
            Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, position, true)
            goto ____switch36_end
        end
    end
    ::____switch36_case_2::
    do
        do
            local heavenDoor = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.HEAVEN_LIGHT_DOOR, 0, position, Vector.Zero, nil):ToEffect()
            if heavenDoor ~= nil then
                fastTravel:init(
                    heavenDoor,
                    FastTravelEntityType.HeavenDoor,
                    function() return true end
                )
            end
            goto ____switch36_end
        end
    end
    ::____switch36_case_3::
    do
        do
            Isaac.Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT, position, Vector.Zero, nil)
            goto ____switch36_end
        end
    end
    ::____switch36_case_4::
    do
        do
            trophy:spawn(position)
            goto ____switch36_end
        end
    end
    ::____switch36_case_5::
    do
        do
            goto ____switch36_end
        end
    end
    ::____switch36_case_6::
    do
        do
            goto ____switch36_end
        end
    end
    ::____switch36_case_default::
    do
        do
            ensureAllCases(nil, replacementAction)
            goto ____switch36_end
        end
    end
    ::____switch36_end::
end
ReplacementAction = ReplacementAction or ({})
ReplacementAction.LeaveAlone = 0
ReplacementAction[ReplacementAction.LeaveAlone] = "LeaveAlone"
ReplacementAction.TrapdoorDown = 1
ReplacementAction[ReplacementAction.TrapdoorDown] = "TrapdoorDown"
ReplacementAction.BeamOfLightUp = 2
ReplacementAction[ReplacementAction.BeamOfLightUp] = "BeamOfLightUp"
ReplacementAction.Checkpoint = 3
ReplacementAction[ReplacementAction.Checkpoint] = "Checkpoint"
ReplacementAction.Trophy = 4
ReplacementAction[ReplacementAction.Trophy] = "Trophy"
ReplacementAction.VictoryLap = 5
ReplacementAction[ReplacementAction.VictoryLap] = "VictoryLap"
ReplacementAction.Remove = 6
ReplacementAction[ReplacementAction.Remove] = "Remove"
DEFAULT_REPLACEMENT_ACTION = ReplacementAction.LeaveAlone
function ____exports.postPickupInit(self, pickup)
    local replacementAction = getReplacementAction(nil)
    replace(nil, pickup, replacementAction)
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.postPickupInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local bc = require("features.optional.major.fastTravel.bigChest")
function ____exports.bigChest(self, pickup)
    bc:postPickupInit(pickup)
end
return ____exports
 end,
["callbacks.postPickupInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local flyItemSprites = require("features.optional.graphics.flyItemSprites")
local starOfBethlehem = require("features.optional.graphics.starOfBethlehem")
local twentyTwenty = require("features.optional.graphics.twentyTwenty")
local fastTravelPostPickupInit = require("features.optional.major.fastTravel.callbacks.postPickupInit")
function ____exports.collectible(self, pickup)
    flyItemSprites:postPickupInit(pickup)
    twentyTwenty:postPickupInit(pickup)
    starOfBethlehem:postPickupInit(pickup)
end
function ____exports.bigChest(self, pickup)
    fastTravelPostPickupInit:bigChest(pickup)
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_POST_PICKUP_INIT, ____exports.collectible, PickupVariant.PICKUP_COLLECTIBLE)
    mod:AddCallback(ModCallbacks.MC_POST_PICKUP_INIT, ____exports.bigChest, PickupVariant.PICKUP_BIGCHEST)
end
return ____exports
 end,
["callbacks.postPlayerInit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____GlobalsRun = require("types.GlobalsRun")
local initPlayerVariables = ____GlobalsRun.initPlayerVariables
function ____exports.main(self, player)
    local gameFrameCount = g.g:GetFrameCount()
    if gameFrameCount ~= 0 then
        initPlayerVariables(nil, player, g.run)
    end
end
return ____exports
 end,
["features.optional.cutscenes.fastTeleports"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ANIMATION_SPEED_MULTIPLIER = 1.66
function ____exports.postPlayerRender(self, player)
    if not g.config.fastTeleports then
        return
    end
    local sprite = player:GetSprite()
    local animation = sprite:GetAnimation()
    if ((animation == "TeleportUp") or (animation == "TeleportDown")) and (sprite.PlaybackSpeed == 1) then
        sprite.PlaybackSpeed = ANIMATION_SPEED_MULTIPLIER
        log(nil, ("Increased the playback speed of a " .. animation) .. " animation.")
    end
end
return ____exports
 end,
["callbacks.postPlayerRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fastTeleports = require("features.optional.cutscenes.fastTeleports")
function ____exports.main(self, player)
    fastTeleports:postPlayerRender(player)
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.postPlayerUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local crawlspace = require("features.optional.major.fastTravel.crawlspace")
function ____exports.main(self, player)
    if not g.config.fastTravel then
        return
    end
    crawlspace:postPlayerUpdate(player)
end
return ____exports
 end,
["callbacks.postPlayerUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fastTravelPostPlayerUpdate = require("features.optional.major.fastTravel.callbacks.postPlayerUpdate")
function ____exports.main(self, player)
    fastTravelPostPlayerUpdate:main(player)
end
return ____exports
 end,
["features.mandatory.errors"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____enums = require("types.enums")
local SaveFileState = ____enums.SaveFileState
local ____speedrun = require("features.speedrun.speedrun")
local checkValidCharOrder = ____speedrun.checkValidCharOrder
local inSpeedrun = ____speedrun.inSpeedrun
local STARTING_X, STARTING_Y, drawNoRepentance, drawCorrupted, drawNotFullyUnlocked, drawSetCharOrder, drawTurnOffBabies
function drawNoRepentance(self)
    local x = STARTING_X
    local y = STARTING_Y
    Isaac.RenderText("Error: You must have the Repentance DLC installed", x, y, 2, 2, 2, 2)
    x = x + 42
    y = y + 10
    Isaac.RenderText("in order to use Racing+.", x, y, 2, 2, 2, 2)
    y = y + 20
    Isaac.RenderText("If you want to use the Afterbirth+ version", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("of the mod, then you must download it", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("manually from GitHub.", x, y, 2, 2, 2, 2)
end
function drawCorrupted(self)
    local x = STARTING_X
    local y = STARTING_Y
    Isaac.RenderText("Error: You must close and re-open the game after", x, y, 2, 2, 2, 2)
    x = x + 42
    y = y + 10
    Isaac.RenderText("enabling or disabling any mods.", x, y, 2, 2, 2, 2)
    y = y + 20
    Isaac.RenderText("If this error persists after re-opening the game,", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("then your Racing+ mod is corrupted and needs to be", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("redownloaded/reinstalled.", x, y, 2, 2, 2, 2)
end
function drawNotFullyUnlocked(self)
    local x = STARTING_X
    local y = STARTING_Y
    Isaac.RenderText("Error: You must use a fully unlocked save file to", x, y, 2, 2, 2, 2)
    x = x + 42
    y = y + 10
    Isaac.RenderText("play the Racing+ mod. This is so that all", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("players will have consistent items in races", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("and speedruns. You can download a fully", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("unlocked save file at:", x, y, 2, 2, 2, 2)
    x = x - 42
    y = y + 20
    Isaac.RenderText("https://www.speedrun.com/repentance/resources", x, y, 2, 2, 2, 2)
    y = y + 20
    Isaac.RenderText("If you have problems, please read this guide:", x, y, 2, 2, 2, 2)
    y = y + 20
    Isaac.RenderText("https://pastebin.com/1YY4jb4P", x, y, 2, 2, 2, 2)
end
function drawSetCharOrder(self)
    local x = STARTING_X
    local y = STARTING_Y
    Isaac.RenderText("Error: You must set a character order first", x, y, 2, 2, 2, 2)
    x = x + 42
    y = y + 10
    Isaac.RenderText("by using the \"Change Char Order\" custom", x, y, 2, 2, 2, 2)
    y = y + 10
    Isaac.RenderText("challenge.", x, y, 2, 2, 2, 2)
end
function drawTurnOffBabies(self)
    local x = STARTING_X
    local y = STARTING_Y
    Isaac.RenderText("Error: You must turn off The Babies Mod when playing", x, y, 2, 2, 2, 2)
    x = x + 42
    y = y + 10
    Isaac.RenderText("characters other than Random Baby.", x, y, 2, 2, 2, 2)
end
STARTING_X = 115
STARTING_Y = 70
function ____exports.postRender(self)
    if REPENTANCE == nil then
        drawNoRepentance(nil)
        return true
    end
    if g.corrupted then
        drawCorrupted(nil)
        return true
    end
    if (g.saveFile.state == SaveFileState.Finished) and (not g.saveFile.fullyUnlocked) then
        drawNotFullyUnlocked(nil)
        return true
    end
    if inSpeedrun(nil) and (not checkValidCharOrder(nil)) then
        drawSetCharOrder(nil)
        return true
    end
    if BabiesModGlobals ~= nil then
        local player = Isaac.GetPlayer()
        local character = player:GetPlayerType()
        local randomBabyID = Isaac.GetPlayerTypeByName("Random Baby")
        if character ~= randomBabyID then
            drawTurnOffBabies(nil)
            return true
        end
    end
    return false
end
return ____exports
 end,
["types.TimerType"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local TimerType = TimerType or ({})
TimerType.RaceOrSpeedrun = 0
TimerType[TimerType.RaceOrSpeedrun] = "RaceOrSpeedrun"
TimerType.RunRealTime = 1
TimerType[TimerType.RunRealTime] = "RunRealTime"
____exports.default = TimerType
return ____exports
 end,
["timer"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____misc = require("misc")
local getHUDOffsetVector = ____misc.getHUDOffsetVector
local initSprite = ____misc.initSprite
local getNewTimerSprites
function getNewTimerSprites(self)
    local sprites = {
        clock = initSprite(nil, "gfx/timer/clock.anm2"),
        colons = {},
        digits = {},
        digitMini = initSprite(nil, "gfx/timer/timer_mini.anm2")
    }
    do
        local i = 0
        while i < 2 do
            local colonSprite = initSprite(nil, "gfx/timer/colon.anm2")
            __TS__ArrayPush(sprites.colons, colonSprite)
            i = i + 1
        end
    end
    do
        local i = 0
        while i < 5 do
            local digitSprite = initSprite(nil, "gfx/timer/timer.anm2")
            __TS__ArrayPush(sprites.digits, digitSprite)
            i = i + 1
        end
    end
    return sprites
end
function ____exports.convertSecondsToTimerValues(self, totalSeconds)
    local hours = math.floor(totalSeconds / 3600)
    local minutes = math.floor(totalSeconds / 60)
    if hours > 0 then
        minutes = minutes - (hours * 60)
    end
    local minutesString
    if minutes < 10 then
        minutesString = "0" .. tostring(minutes)
    else
        minutesString = tostring(minutes)
    end
    local minute1String = string.sub(minutesString, 1, 1)
    local minute1 = tonumber(minute1String)
    if minute1 == nil then
        error("Failed to parse the first minute of the timer.")
    end
    local minute2String = string.sub(minutesString, 2, 2)
    local minute2 = tonumber(minute2String)
    if minute2 == nil then
        error("Failed to parse the second minute of the timer.")
    end
    local seconds = math.floor(totalSeconds % 60)
    local secondsString
    if seconds < 10 then
        secondsString = "0" .. tostring(seconds)
    else
        secondsString = tostring(seconds)
    end
    local second1String = string.sub(secondsString, 1, 1)
    local second1 = tonumber(second1String)
    if second1 == nil then
        error("Failed to parse the first second of the timer.")
    end
    local second2String = string.sub(secondsString, 2, 2)
    local second2 = tonumber(second2String)
    if second2 == nil then
        error("Failed to parse the second second of the timer.")
    end
    local rawSeconds = totalSeconds % 60
    local decimals = rawSeconds - math.floor(rawSeconds)
    local tenths = math.floor(decimals * 10)
    return {hours, minute1, minute2, second1, second2, tenths}
end
local DIGIT_LENGTH = 7.25
local RACE_TIMER_POSITION = Vector(19, 198)
local spriteCollectionMap = __TS__New(Map)
function ____exports.display(self, timerType, seconds, startingX, startingY)
    if startingX == nil then
        startingX = RACE_TIMER_POSITION.X
    end
    if startingY == nil then
        startingY = RACE_TIMER_POSITION.Y
    end
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    local HUDOffsetVector = getHUDOffsetVector(nil)
    startingX = startingX + HUDOffsetVector.X
    startingY = startingY + HUDOffsetVector.Y
    if (character == PlayerType.PLAYER_BETHANY) or (character == PlayerType.PLAYER_JACOB) then
        startingY = startingY + 8
    elseif character == PlayerType.PLAYER_BETHANY_B then
        startingY = startingY - 5
    end
    if player:HasCollectible(CollectibleType.COLLECTIBLE_DUALITY) then
        startingY = startingY - 10
    end
    local hourAdjustment = 2
    local hourAdjustment2 = 0
    local sprites = spriteCollectionMap:get(timerType)
    if sprites == nil then
        sprites = getNewTimerSprites(nil)
        spriteCollectionMap:set(timerType, sprites)
    end
    local hours, minute1, minute2, second1, second2, tenths = table.unpack(
        ____exports.convertSecondsToTimerValues(nil, seconds)
    )
    local positionClock = Vector(startingX + 34, startingY + 45)
    sprites.clock:RenderLayer(0, positionClock)
    if hours > 0 then
        hourAdjustment2 = 2
        startingX = startingX + (DIGIT_LENGTH + hourAdjustment)
        local positionHours = Vector((startingX - DIGIT_LENGTH) - hourAdjustment, startingY)
        local hoursDigitSprite = sprites.digits[5]
        hoursDigitSprite:SetFrame("Default", hours)
        hoursDigitSprite:RenderLayer(0, positionHours)
        local positionColon = Vector((startingX - DIGIT_LENGTH) + 7, startingY + 19)
        local colonHoursSprite = sprites.colons[2]
        colonHoursSprite:RenderLayer(0, positionColon)
    end
    local positionMinute1 = Vector(startingX, startingY)
    local minute1Sprite = sprites.digits[1]
    minute1Sprite:SetFrame("Default", minute1)
    minute1Sprite:RenderLayer(0, positionMinute1)
    local positionMinute2 = Vector(startingX + DIGIT_LENGTH, startingY)
    local minute2Sprite = sprites.digits[2]
    minute2Sprite:SetFrame("Default", minute2)
    minute2Sprite:RenderLayer(0, positionMinute2)
    local positionColon1 = Vector((startingX + DIGIT_LENGTH) + 10, startingY + 19)
    local colonMinutesSprite = sprites.colons[1]
    colonMinutesSprite:RenderLayer(0, positionColon1)
    local positionSecond1 = Vector((startingX + DIGIT_LENGTH) + 11, startingY)
    local second1Sprite = sprites.digits[3]
    second1Sprite:SetFrame("Default", second1)
    second1Sprite:RenderLayer(0, positionSecond1)
    local positionSecond2 = Vector(((((startingX + DIGIT_LENGTH) + 11) + DIGIT_LENGTH) + 1) - hourAdjustment2, startingY)
    local second2Sprite = sprites.digits[4]
    second2Sprite:SetFrame("Default", second2)
    second2Sprite:RenderLayer(0, positionSecond2)
    local positionTenths = Vector((((((startingX + DIGIT_LENGTH) + 11) + DIGIT_LENGTH) + 1) - hourAdjustment2) + DIGIT_LENGTH, startingY + 1)
    sprites.digitMini:SetFrame("Default", tenths)
    sprites.digitMini:RenderLayer(0, positionTenths)
end
return ____exports
 end,
["features.mandatory.runTimer"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local isActionPressedOnAnyInput = ____misc.isActionPressedOnAnyInput
local timer = require("timer")
local ____TimerType = require("types.TimerType")
local TimerType = ____TimerType.default
local RUN_TIMER_X, RUN_TIMER_Y, checkStartTimer
function checkStartTimer(self)
    if g.run.startedTime == 0 then
        g.run.startedTime = Isaac.GetTime()
    end
end
function ____exports.checkDisplay(self)
    if not isActionPressedOnAnyInput(nil, ButtonAction.ACTION_MAP) then
        return
    end
    if g.seeds:HasSeedEffect(SeedEffect.SEED_NO_HUD) then
        return
    end
    if #g.run.pills >= 11 then
        return
    end
    local elapsedTime
    if g.run.startedTime == 0 then
        elapsedTime = 0
    else
        elapsedTime = Isaac.GetTime() - g.run.startedTime
    end
    local seconds = elapsedTime / 1000
    timer:display(TimerType.RunRealTime, seconds, RUN_TIMER_X, RUN_TIMER_Y)
end
RUN_TIMER_X = 52
RUN_TIMER_Y = 49
function ____exports.postUpdate(self)
    checkStartTimer(nil)
end
function ____exports.postRender(self)
    ____exports.checkDisplay(nil)
end
return ____exports
 end,
["features.optional.major.fastReset"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local isActionTriggeredOnAnyInput = ____misc.isActionTriggeredOnAnyInput
local checkResetInput, reset
function checkResetInput(self)
    local isPaused = g.g:IsPaused()
    if isPaused then
        return
    end
    if ((((Input.IsButtonPressed(Keyboard.KEY_LEFT_CONTROL, 0) or Input.IsButtonPressed(Keyboard.KEY_LEFT_ALT, 0)) or Input.IsButtonPressed(Keyboard.KEY_LEFT_SUPER, 0)) or Input.IsButtonPressed(Keyboard.KEY_RIGHT_CONTROL, 0)) or Input.IsButtonPressed(Keyboard.KEY_RIGHT_ALT, 0)) or Input.IsButtonPressed(Keyboard.KEY_RIGHT_SUPER, 0) then
        return
    end
    if isActionTriggeredOnAnyInput(nil, ButtonAction.ACTION_RESTART) then
        reset(nil)
    end
end
function reset(self)
    local isaacFrameCount = Isaac.GetFrameCount()
    if (g.run.roomsEntered <= 3) or (isaacFrameCount <= (g.run.fastResetFrame + 60)) then
        g.speedrun.fastReset = true
        consoleCommand(nil, "restart")
    else
        g.run.fastResetFrame = isaacFrameCount
    end
end
function ____exports.postRender(self)
    if not g.config.fastReset then
        return
    end
    checkResetInput(nil)
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.postRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local blackSprite = require("features.optional.major.fastTravel.blackSprite")
local checkStateComplete = require("features.optional.major.fastTravel.checkStateComplete")
function ____exports.main(self)
    if not g.config.fastTravel then
        return
    end
    checkStateComplete:postRender()
    blackSprite:draw()
end
return ____exports
 end,
["features.optional.quality.customConsole"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local isConsoleOpen, consoleText, consoleTextIndex, keysPressed, checkKeyboardInput, handleInput, open, close
function checkKeyboardInput(self)
    local player = Isaac.GetPlayer()
    if g.g:IsPaused() then
        return
    end
    for ____, keyboardValue in ipairs(
        __TS__ObjectValues(Keyboard)
    ) do
        if Input.IsButtonPressed(keyboardValue, player.ControllerIndex) then
            keysPressed:set(keyboardValue, true)
        else
            keysPressed:delete(keyboardValue)
        end
    end
    if isConsoleOpen then
        handleInput(nil)
    elseif keysPressed:has(Keyboard.KEY_ENTER) then
        open(nil)
    end
end
function handleInput(self)
    if keysPressed:has(Keyboard.KEY_ENTER) then
        close(nil)
    end
end
function open(self)
    isConsoleOpen = true
    consoleText = ""
    consoleTextIndex = 0
end
function close(self)
    isConsoleOpen = false
    if consoleText ~= "" then
        consoleCommand(nil, consoleText)
    end
    if consoleTextIndex == 0 then
    end
end
isConsoleOpen = false
consoleText = ""
consoleTextIndex = 0
keysPressed = __TS__New(Map)
function ____exports.postRender(self)
    if not g.config.customConsole then
        return
    end
    checkKeyboardInput(nil)
end
return ____exports
 end,
["features.optional.quality.showDreamCatcherItem.postRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local gridToPos = ____misc.gridToPos
local ____centerStart = require("features.mandatory.centerStart")
local centerPlayers = ____centerStart.centerPlayers
local ____enums = require("features.optional.quality.showDreamCatcherItem.enums")
local WarpState = ____enums.WarpState
local SPRITE_SPACING, repositionPlayer, drawItemSprites
function repositionPlayer(self)
    if g.run.level.dreamCatcher.warpState == WarpState.RepositioningPlayer then
        g.run.level.dreamCatcher.warpState = WarpState.Finished
        centerPlayers(nil)
    end
end
function drawItemSprites(self)
    local player = Isaac.GetPlayer()
    local playerSprite = player:GetSprite()
    local playerAnimation = playerSprite:GetAnimation()
    if g.run.slideAnimationHappening and (playerAnimation ~= "Appear") then
        return
    end
    local topLeftRoomPosition = gridToPos(nil, 1, 1)
    local nextToDreamCatcherPosition = gridToPos(nil, 2, 1)
    if g.run.level.dreamCatcher.dreamCatcherSprite ~= nil then
        local sprite = g.run.level.dreamCatcher.dreamCatcherSprite
        local renderPosition = Isaac.WorldToRenderPosition(topLeftRoomPosition)
        sprite:RenderLayer(0, renderPosition)
    end
    do
        local i = 0
        while i < #g.run.level.dreamCatcher.itemSprites do
            local sprite = g.run.level.dreamCatcher.itemSprites[i + 1]
            local renderPosition = Isaac.WorldToRenderPosition(nextToDreamCatcherPosition)
            local numRightShifts = i
            local positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0)
            local position = renderPosition + positionAdjustment
            sprite:RenderLayer(0, position)
            i = i + 1
        end
    end
    do
        local i = 0
        while i < #g.run.level.dreamCatcher.bossSprites do
            local sprite = g.run.level.dreamCatcher.bossSprites[i + 1]
            local renderPosition = Isaac.WorldToRenderPosition(nextToDreamCatcherPosition)
            local numRightShifts = i + #g.run.level.dreamCatcher.itemSprites
            local positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0)
            local position = renderPosition + positionAdjustment
            sprite:RenderLayer(0, position)
            i = i + 1
        end
    end
end
SPRITE_SPACING = 30
function ____exports.main(self)
    if not g.config.showDreamCatcherItem then
        return
    end
    repositionPlayer(nil)
    drawItemSprites(nil)
end
return ____exports
 end,
["features.optional.quality.showMaxFamiliars"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local initSprite = ____misc.initSprite
local SPRITE_POSITION, sprite, drawSprite
function drawSprite(self)
    if g.run.maxFamiliars then
        sprite:RenderLayer(0, SPRITE_POSITION)
    end
end
local MAX_FAMILIARS = 64
SPRITE_POSITION = Vector(35, 33)
sprite = initSprite(nil, "gfx/ui/max_familiars.anm2")
function ____exports.postUpdate(self)
    local familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR)
    g.run.maxFamiliars = #familiars >= MAX_FAMILIARS
end
function ____exports.postRender(self)
    if not g.config.showMaxFamiliars then
        return
    end
    drawSprite(nil)
end
return ____exports
 end,
["features.optional.quality.showPills"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____constants = require("constants")
local KCOLOR_DEFAULT = ____constants.KCOLOR_DEFAULT
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local anyPlayerHasCollectible = ____misc.anyPlayerHasCollectible
local initSprite = ____misc.initSprite
local isActionPressedOnAnyInput = ____misc.isActionPressedOnAnyInput
local NUM_PILLS_IN_POOL, PHD_PILL_CONVERSIONS, FALSE_PHD_PILL_CONVERSIONS, sprites, initSprites, drawTextAndSprite, checkPHD, checkFalsePHD
function initSprites(self)
    __TS__ArrayPush(
        sprites,
        Sprite()
    )
    do
        local i = 1
        while i < PillColor.NUM_STANDARD_PILLS do
            local sprite = initSprite(
                nil,
                "gfx/pills/pill.anm2",
                ("gfx/pills/" .. tostring(i)) .. ".png"
            )
            __TS__ArrayPush(sprites, sprite)
            i = i + 1
        end
    end
end
function drawTextAndSprite(self)
    local x = 80
    local baseY = 97
    do
        local i = 9
        while i <= 12 do
            if #g.run.pills >= i then
                baseY = baseY - 20
            end
            i = i + 1
        end
    end
    local text = (("Pills identified: " .. tostring(#g.run.pills)) .. " / ") .. tostring(NUM_PILLS_IN_POOL)
    g.font:DrawString(text, x - 10, (baseY - 9) + 20, KCOLOR_DEFAULT, 0, true)
    baseY = baseY + 20
    do
        local i = 0
        while i < #g.run.pills do
            local pillEntry = g.run.pills[i + 1]
            local y = baseY + (20 * (i + 1))
            local pos = Vector(x, y)
            pillEntry.sprite:RenderLayer(0, pos)
            local effectName = g.itemConfig:GetPillEffect(pillEntry.effect).Name
            if text == "Feels like I'm walking on sunshine!" then
                effectName = "Walking on sunshine!"
            end
            g.font:DrawString(effectName, x + 15, y - 9, KCOLOR_DEFAULT, 0, true)
            i = i + 1
        end
    end
end
function checkPHD(self)
    if g.run.pillsPHD then
        return
    end
    if (not anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_PHD)) and (not anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_VIRGO)) then
        return
    end
    g.run.pillsPHD = true
    log(nil, "Converting bad pill effects.")
    for ____, pillEntry in ipairs(g.run.pills) do
        local newEffect = PHD_PILL_CONVERSIONS:get(pillEntry.effect)
        if newEffect ~= nil then
            pillEntry.effect = newEffect
        end
    end
end
function checkFalsePHD(self)
    if g.run.pillsFalsePHD then
        return
    end
    if not anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_FALSE_PHD) then
        return
    end
    g.run.pillsFalsePHD = true
    log(nil, "Converting good pill effects.")
    for ____, pillEntry in ipairs(g.run.pills) do
        local newEffect = FALSE_PHD_PILL_CONVERSIONS:get(pillEntry.effect)
        if newEffect ~= nil then
            pillEntry.effect = newEffect
        end
    end
end
NUM_PILLS_IN_POOL = 13
PHD_PILL_CONVERSIONS = __TS__New(Map, {{PillEffect.PILLEFFECT_BAD_TRIP, PillEffect.PILLEFFECT_BALLS_OF_STEEL}, {PillEffect.PILLEFFECT_HEALTH_DOWN, PillEffect.PILLEFFECT_HEALTH_UP}, {PillEffect.PILLEFFECT_RANGE_DOWN, PillEffect.PILLEFFECT_RANGE_UP}, {PillEffect.PILLEFFECT_SPEED_DOWN, PillEffect.PILLEFFECT_SPEED_UP}, {PillEffect.PILLEFFECT_TEARS_DOWN, PillEffect.PILLEFFECT_TEARS_UP}, {PillEffect.PILLEFFECT_LUCK_DOWN, PillEffect.PILLEFFECT_LUCK_UP}, {PillEffect.PILLEFFECT_PARALYSIS, PillEffect.PILLEFFECT_PHEROMONES}, {PillEffect.PILLEFFECT_AMNESIA, PillEffect.PILLEFFECT_SEE_FOREVER}, {PillEffect.PILLEFFECT_WIZARD, PillEffect.PILLEFFECT_POWER}, {PillEffect.PILLEFFECT_ADDICTED, PillEffect.PILLEFFECT_PERCS}, {PillEffect.PILLEFFECT_QUESTIONMARK, PillEffect.PILLEFFECT_TELEPILLS}, {PillEffect.PILLEFFECT_RETRO_VISION, PillEffect.PILLEFFECT_SEE_FOREVER}, {PillEffect.PILLEFFECT_X_LAX, PillEffect.PILLEFFECT_SOMETHINGS_WRONG}, {PillEffect.PILLEFFECT_IM_EXCITED, PillEffect.PILLEFFECT_IM_DROWSY}, {PillEffect.PILLEFFECT_HORF, PillEffect.PILLEFFECT_GULP}, {PillEffect.PILLEFFECT_SHOT_SPEED_DOWN, PillEffect.PILLEFFECT_SHOT_SPEED_UP}})
FALSE_PHD_PILL_CONVERSIONS = __TS__New(Map, {{PillEffect.PILLEFFECT_BAD_GAS, PillEffect.PILLEFFECT_HEALTH_DOWN}, {PillEffect.PILLEFFECT_BALLS_OF_STEEL, PillEffect.PILLEFFECT_BAD_TRIP}, {PillEffect.PILLEFFECT_BOMBS_ARE_KEYS, PillEffect.PILLEFFECT_TEARS_DOWN}, {PillEffect.PILLEFFECT_EXPLOSIVE_DIARRHEA, PillEffect.PILLEFFECT_RANGE_DOWN}, {PillEffect.PILLEFFECT_FULL_HEALTH, PillEffect.PILLEFFECT_BAD_TRIP}, {PillEffect.PILLEFFECT_HEALTH_UP, PillEffect.PILLEFFECT_HEALTH_DOWN}, {PillEffect.PILLEFFECT_PRETTY_FLY, PillEffect.PILLEFFECT_LUCK_DOWN}, {PillEffect.PILLEFFECT_RANGE_UP, PillEffect.PILLEFFECT_RANGE_DOWN}, {PillEffect.PILLEFFECT_SPEED_UP, PillEffect.PILLEFFECT_SPEED_DOWN}, {PillEffect.PILLEFFECT_TEARS_UP, PillEffect.PILLEFFECT_TEARS_DOWN}, {PillEffect.PILLEFFECT_LUCK_UP, PillEffect.PILLEFFECT_LUCK_DOWN}, {PillEffect.PILLEFFECT_TELEPILLS, PillEffect.PILLEFFECT_IM_EXCITED}, {PillEffect.PILLEFFECT_48HOUR_ENERGY, PillEffect.PILLEFFECT_SPEED_DOWN}, {PillEffect.PILLEFFECT_HEMATEMESIS, PillEffect.PILLEFFECT_BAD_TRIP}, {PillEffect.PILLEFFECT_SEE_FOREVER, PillEffect.PILLEFFECT_RETRO_VISION}, {PillEffect.PILLEFFECT_PHEROMONES, PillEffect.PILLEFFECT_PARALYSIS}, {PillEffect.PILLEFFECT_LEMON_PARTY, PillEffect.PILLEFFECT_HORF}, {PillEffect.PILLEFFECT_PERCS, PillEffect.PILLEFFECT_ADDICTED}, {PillEffect.PILLEFFECT_LARGER, PillEffect.PILLEFFECT_RANGE_DOWN}, {PillEffect.PILLEFFECT_SMALLER, PillEffect.PILLEFFECT_SPEED_DOWN}, {PillEffect.PILLEFFECT_INFESTED_EXCLAMATION, PillEffect.PILLEFFECT_TEARS_DOWN}, {PillEffect.PILLEFFECT_INFESTED_QUESTION, PillEffect.PILLEFFECT_LUCK_DOWN}, {PillEffect.PILLEFFECT_POWER, PillEffect.PILLEFFECT_WIZARD}, {PillEffect.PILLEFFECT_FRIENDS_TILL_THE_END, PillEffect.PILLEFFECT_HEALTH_DOWN}, {PillEffect.PILLEFFECT_SOMETHINGS_WRONG, PillEffect.PILLEFFECT_X_LAX}, {PillEffect.PILLEFFECT_IM_DROWSY, PillEffect.PILLEFFECT_IM_EXCITED}, {PillEffect.PILLEFFECT_GULP, PillEffect.PILLEFFECT_HORF}, {PillEffect.PILLEFFECT_SUNSHINE, PillEffect.PILLEFFECT_RETRO_VISION}, {PillEffect.PILLEFFECT_VURP, PillEffect.PILLEFFECT_HORF}, {PillEffect.PILLEFFECT_SHOT_SPEED_UP, PillEffect.PILLEFFECT_SHOT_SPEED_DOWN}})
sprites = {}
initSprites(nil)
function ____exports.getSprite(self, pillColor)
    return sprites[pillColor + 1]
end
function ____exports.postRender(self)
    if not g.config.showPills then
        return
    end
    if BabiesModGlobals ~= nil then
        return
    end
    if not isActionPressedOnAnyInput(nil, ButtonAction.ACTION_MAP) then
        return
    end
    if #g.run.pills == 0 then
        return
    end
    drawTextAndSprite(nil)
end
function ____exports.postUpdate(self)
    if not g.config.showPills then
        return
    end
    checkPHD(nil)
    checkFalsePHD(nil)
end
return ____exports
 end,
["features.optional.quality.speedUpFadeIn"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local FADE_IN_SPEED, shouldSpeedUpFadeIn, speedUpFadeIn
function shouldSpeedUpFadeIn(self)
    local gameFrameCount = g.g:GetFrameCount()
    return (not g.run.spedUpFadeIn) and (gameFrameCount == 0)
end
function speedUpFadeIn(self)
    g.run.spedUpFadeIn = true
    g.g:Fadein(FADE_IN_SPEED)
end
FADE_IN_SPEED = 0.15
function ____exports.postRender(self)
    if not g.config.speedUpFadeIn then
        return
    end
    if shouldSpeedUpFadeIn(nil) then
        speedUpFadeIn(nil)
    end
end
return ____exports
 end,
["features.race.raceTimer"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local timer = require("timer")
local ____TimerType = require("types.TimerType")
local TimerType = ____TimerType.default
local checkDisplay
function checkDisplay(self)
    if g.race.myStatus ~= "racing" then
        return
    end
    if g.seeds:HasSeedEffect(SeedEffect.SEED_NO_HUD) then
        return
    end
    local elapsedTime
    if g.raceVars.finished then
        elapsedTime = g.raceVars.finishedTime
    else
        elapsedTime = Isaac.GetTime() - g.raceVars.startedTime
    end
    local seconds = elapsedTime / 1000
    timer:display(TimerType.RaceOrSpeedrun, seconds)
end
function ____exports.postRender(self)
    checkDisplay(nil)
end
return ____exports
 end,
["features.race.callbacks.postRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local restartAsCharacter = ____misc.restartAsCharacter
local placeLeft = require("features.race.placeLeft")
local raceRoom = require("features.race.raceRoom")
local ____raceStart = require("features.race.raceStart")
local raceStart = ____raceStart.default
local raceTimer = require("features.race.raceTimer")
local socket = require("features.race.socket")
local startingRoom = require("features.race.startingRoom")
local topSprite = require("features.race.topSprite")
local checkGameOpenedInMiddleOfRace
function checkGameOpenedInMiddleOfRace(self)
    if ((g.race.status == "in progress") and (g.race.myStatus == "racing")) and (not g.raceVars.started) then
        log(nil, "The game was opened in the middle of a race!")
        raceStart(nil)
    end
end
function ____exports.main(self)
    if not g.config.clientCommunication then
        return
    end
    socket:postRender()
    if g.race.status ~= "none" then
        checkGameOpenedInMiddleOfRace(nil)
        raceRoom:postRender()
        startingRoom:postRender()
        placeLeft:postRender()
        topSprite:postRender()
        raceTimer:postRender()
    end
end
function ____exports.checkRestartWrongCharacter(self)
    if ((not g.config.clientCommunication) or (g.race.status == "none")) or (g.race.format == "custom") then
        return false
    end
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    if character == g.race.character then
        return false
    end
    restartAsCharacter(nil, g.race.character)
    return true
end
function ____exports.checkRestartWrongSeed(self)
    if (((not g.config.clientCommunication) or (g.race.format ~= "seeded")) or (g.race.status ~= "in progress")) or (g.race.myStatus ~= "racing") then
        return false
    end
    local startSeedString = g.seeds:GetStartSeedString()
    if startSeedString ~= g.race.seed then
        consoleCommand(nil, "seed " .. g.race.seed)
        return true
    end
    return false
end
return ____exports
 end,
["features.speedrun.callbacks.postRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____misc = require("misc")
local restartAsCharacter = ____misc.restartAsCharacter
local ____speedrun = require("features.speedrun.speedrun")
local checkValidCharOrder = ____speedrun.checkValidCharOrder
local getCurrentCharacter = ____speedrun.getCurrentCharacter
local inSpeedrun = ____speedrun.inSpeedrun
function ____exports.checkRestartWrongCharacter(self)
    if not inSpeedrun(nil) then
        return false
    end
    if not checkValidCharOrder(nil) then
        return false
    end
    local player = Isaac.GetPlayer()
    local character = player:GetPlayerType()
    local characterForThisSpeedrun = getCurrentCharacter(nil)
    if character == characterForThisSpeedrun then
        return false
    end
    restartAsCharacter(nil, characterForThisSpeedrun)
    return true
end
return ____exports
 end,
["callbacks.postRender"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local cache = require("cache")
local ____constants = require("constants")
local VERSION = ____constants.VERSION
local detectSlideAnimation = require("features.mandatory.detectSlideAnimation")
local errors = require("features.mandatory.errors")
local racingPlusSprite = require("features.mandatory.racingPlusSprite")
local runTimer = require("features.mandatory.runTimer")
local saveFileCheck = require("features.mandatory.saveFileCheck")
local streakText = require("features.mandatory.streakText")
local fastReset = require("features.optional.major.fastReset")
local fastTravelPostRender = require("features.optional.major.fastTravel.callbacks.postRender")
local customConsole = require("features.optional.quality.customConsole")
local showDreamCatcherItemPostRender = require("features.optional.quality.showDreamCatcherItem.postRender")
local showEdenStartingItems = require("features.optional.quality.showEdenStartingItems")
local showMaxFamiliars = require("features.optional.quality.showMaxFamiliars")
local showPills = require("features.optional.quality.showPills")
local speedUpFadeIn = require("features.optional.quality.speedUpFadeIn")
local racePostRender = require("features.race.callbacks.postRender")
local speedrunPostRender = require("features.speedrun.callbacks.postRender")
local speedrun = require("features.speedrun.speedrun")
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local consoleCommand = ____misc.consoleCommand
local checkRestart, drawTopLeftText
function checkRestart(self)
    if not g.run.restart then
        return false
    end
    g.run.restart = false
    if saveFileCheck:checkRestart() then
        return true
    end
    if racePostRender:checkRestartWrongCharacter() then
        return true
    end
    if racePostRender:checkRestartWrongSeed() then
        return true
    end
    if speedrunPostRender:checkRestartWrongCharacter() then
        return true
    end
    consoleCommand(nil, "restart")
    return true
end
function drawTopLeftText(self)
    local roomType = g.r:GetType()
    local roomFrameCount = g.r:GetFrameCount()
    local seedString = g.seeds:GetStartSeedString()
    local x = 55 + ____exports.getHeartXOffset(nil)
    local y = 10
    local lineLength = 15
    if g.config.clientCommunication and (g.run.victoryLaps > 0) then
        local text = "Victory Lap #" .. tostring(g.run.victoryLaps)
        Isaac.RenderText(text, x, y, 2, 2, 2, 2)
    elseif g.run.room.showEndOfRunText then
        local firstLine = (("R+ " .. VERSION) .. " - ") .. seedString
        Isaac.RenderText(firstLine, x, y, 2, 2, 2, 2)
        y = y + lineLength
        local secondLine
        if speedrun:inSpeedrun() then
            secondLine = "Avg. time per char: unknown"
        else
            secondLine = "Rooms entered: " .. tostring(g.run.roomsEntered)
        end
        Isaac.RenderText(secondLine, x, y, 2, 2, 2, 2)
        if (not speedrun:inSpeedrun()) or speedrun:isOnFinalCharacter() then
            local frames
            if speedrun:inSpeedrun() then
                frames = g.speedrun.finishedFrames
            else
                frames = g.raceVars.finishedFrames
            end
            local seconds = math.floor(frames / 60)
            y = y + lineLength
            local thirdLine = ((tostring(frames) .. " frames (") .. tostring(seconds)) .. "s)"
            Isaac.RenderText(thirdLine, x, y, 2, 2, 2, 2)
        end
    elseif (((g.config.clientCommunication and (g.race.raceID ~= -1)) and (g.race.status == "in progress")) and (g.race.myStatus == "racing")) and ((Isaac.GetTime() - g.raceVars.startedTime) <= 2000) then
        local text = "Race ID: " .. tostring(g.race.raceID)
        Isaac.RenderText(text, x, y, 2, 2, 2, 2)
    elseif (g.config.showNumSacrifices and (roomType == RoomType.ROOM_SACRIFICE)) and (roomFrameCount > 0) then
        local text = "Sacrifices: " .. tostring(g.run.level.numSacrifices)
        Isaac.RenderText(text, x, y, 2, 2, 2, 2)
    end
end
function ____exports.getHeartXOffset(self)
    local curses = g.l:GetCurses()
    local player = Isaac.GetPlayer()
    local maxHearts = player:GetMaxHearts()
    local soulHearts = player:GetSoulHearts()
    local boneHearts = player:GetBoneHearts()
    local extraLives = player:GetExtraLives()
    local heartLength = 12
    local combinedHearts = (maxHearts + soulHearts) + (boneHearts * 2)
    if combinedHearts > 12 then
        combinedHearts = 12
    end
    if curses == LevelCurse.CURSE_OF_THE_UNKNOWN then
        combinedHearts = 2
    end
    local offset = (combinedHearts / 2) * heartLength
    if extraLives > 9 then
        offset = offset + 20
        if player:HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR) then
            offset = offset + 6
        end
    elseif extraLives > 0 then
        offset = offset + 16
        if player:HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR) then
            offset = offset + 4
        end
    end
    return offset
end
function ____exports.main(self)
    cache:updateAPIFunctions()
    if checkRestart(nil) then
        return
    end
    speedUpFadeIn:postRender()
    if errors:postRender() then
        return
    end
    racingPlusSprite:postRender()
    detectSlideAnimation:postRender()
    streakText:postRender()
    runTimer:postRender()
    drawTopLeftText(nil)
    racePostRender:main()
    fastTravelPostRender:main()
    fastReset:postRender()
    showEdenStartingItems:postRender()
    showDreamCatcherItemPostRender:main()
    showPills:postRender()
    showMaxFamiliars:postRender()
    customConsole:postRender()
end
return ____exports
 end,
["features.optional.quality.fadeVasculitisTears"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local anyPlayerHasCollectible = ____misc.anyPlayerHasCollectible
local FADED_COLOR, shouldFadeTear, fadeTear
function shouldFadeTear(self, tear)
    return ((tear.FrameCount == 0) and (tear.SpawnerType == 0)) and anyPlayerHasCollectible(nil, CollectibleType.COLLECTIBLE_VASCULITIS)
end
function fadeTear(self, tear)
    tear:SetColor(FADED_COLOR, 1000, 0)
end
local FADE_AMOUNT = 0.15
FADED_COLOR = Color(1, 1, 1, FADE_AMOUNT, 0, 0, 0)
function ____exports.postTearUpdateBloodParticle(self, tear)
    if not g.config.fadeVasculitisTears then
        return
    end
    if shouldFadeTear(nil, tear) then
        fadeTear(nil, tear)
    end
end
return ____exports
 end,
["callbacks.postTearUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fadeVasculitisTears = require("features.optional.quality.fadeVasculitisTears")
function ____exports.blood(self, tear)
    fadeVasculitisTears:postTearUpdateBloodParticle(tear)
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE, ____exports.blood, TearVariant.BLOOD)
end
return ____exports
 end,
["features.race.callbacks.postItemPickup"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local socket = require("features.race.socket")
function ____exports.main(self, pickingUpItemDescription)
    if not g.config.clientCommunication then
        return
    end
    socket:postItemPickup(pickingUpItemDescription)
end
return ____exports
 end,
["customCallbacks.itemPickup"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local streakText = require("features.mandatory.streakText")
local racePostItemPickup = require("features.race.callbacks.postItemPickup")
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local getRoomIndex = ____misc.getRoomIndex
local ____GlobalsRun = require("types.GlobalsRun")
local getPlayerLuaTableIndex = ____GlobalsRun.getPlayerLuaTableIndex
local queueEmpty, queueNotEmpty, preItemPickup, postItemPickup
function queueEmpty(self, player)
    local index = getPlayerLuaTableIndex(nil, player)
    local pickingUpItemDescription = g.run.pickingUpItem[index]
    if pickingUpItemDescription == nil then
        return
    end
    if pickingUpItemDescription.id ~= CollectibleType.COLLECTIBLE_NULL then
        postItemPickup(nil, player, pickingUpItemDescription)
        pickingUpItemDescription.id = CollectibleType.COLLECTIBLE_NULL
        pickingUpItemDescription.type = ItemType.ITEM_NULL
        pickingUpItemDescription.roomIndex = 0
    end
end
function queueNotEmpty(self, player)
    local roomIndex = getRoomIndex(nil)
    local index = getPlayerLuaTableIndex(nil, player)
    local pickingUpItem = g.run.pickingUpItem[index]
    local queuedItem = player.QueuedItem.Item
    if (queuedItem ~= nil) and (queuedItem.ID ~= pickingUpItem.id) then
        pickingUpItem.id = queuedItem.ID
        pickingUpItem.type = queuedItem.Type
        pickingUpItem.roomIndex = roomIndex
        preItemPickup(nil, player, queuedItem)
    end
end
function preItemPickup(self, _player, queuedItem)
    streakText:set(queuedItem.Name)
end
function postItemPickup(self, _player, pickingUpItemDescription)
    racePostItemPickup:main(pickingUpItemDescription)
end
function ____exports.postUpdate(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        if player:IsItemQueueEmpty() then
            queueEmpty(nil, player)
        else
            queueNotEmpty(nil, player)
        end
    end
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.postGridEntityUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local cs = require("features.optional.major.fastTravel.crawlspace")
local td = require("features.optional.major.fastTravel.trapdoor")
function ____exports.trapdoor(self, gridEntity)
    if not g.config.fastTravel then
        return
    end
    td:postGridEntityUpdateTrapdoor(gridEntity)
end
function ____exports.crawlspace(self, gridEntity)
    if not g.config.fastTravel then
        return
    end
    cs:postGridEntityUpdateCrawlspace(gridEntity)
end
return ____exports
 end,
["features.optional.quality.deleteVoidPortals"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local isPostBossVoidPortal = ____misc.isPostBossVoidPortal
local removeGridEntity = ____misc.removeGridEntity
function ____exports.postGridEntityUpdateTrapdoor(self, gridEntity)
    if not g.config.deleteVoidPortals then
        return
    end
    if isPostBossVoidPortal(nil, gridEntity) then
        removeGridEntity(nil, gridEntity)
    end
end
return ____exports
 end,
["customCallbacks.postGridEntityUpdateFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local fastTravelPostGridEntityUpdate = require("features.optional.major.fastTravel.callbacks.postGridEntityUpdate")
local deleteVoidPortals = require("features.optional.quality.deleteVoidPortals")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    GridEntityType.GRID_TRAPDOOR,
    function(____, gridEntity)
        deleteVoidPortals:postGridEntityUpdateTrapdoor(gridEntity)
        fastTravelPostGridEntityUpdate:trapdoor(gridEntity)
    end
)
functionMap:set(
    GridEntityType.GRID_STAIRS,
    function(____, gridEntity)
        fastTravelPostGridEntityUpdate:crawlspace(gridEntity)
    end
)
return ____exports
 end,
["customCallbacks.postGridEntityUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____misc = require("misc")
local getGridEntities = ____misc.getGridEntities
local ____postGridEntityUpdateFunctions = require("customCallbacks.postGridEntityUpdateFunctions")
local postGridEntityUpdateFunctions = ____postGridEntityUpdateFunctions.default
function ____exports.postUpdate(self)
    for ____, gridEntity in ipairs(
        getGridEntities(nil)
    ) do
        local saveState = gridEntity:GetSaveState()
        local postGridEntityUpdateFunction = postGridEntityUpdateFunctions:get(saveState.Type)
        if postGridEntityUpdateFunction ~= nil then
            postGridEntityUpdateFunction(nil, gridEntity)
        end
    end
end
return ____exports
 end,
["customCallbacks.postPlayerChange"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local startWithD6 = require("features.optional.major.startWithD6")
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local ____GlobalsRun = require("types.GlobalsRun")
local getPlayerLuaTableIndex = ____GlobalsRun.getPlayerLuaTableIndex
local postPlayerChange
function postPlayerChange(self, player)
    startWithD6:postPlayerChange(player)
end
function ____exports.postUpdate(self)
    for ____, player in ipairs(
        getPlayers(nil, true)
    ) do
        local character = player:GetPlayerType()
        local index = getPlayerLuaTableIndex(nil, player)
        if character ~= g.run.currentCharacters[index] then
            log(nil, "Detected a character change for player: " .. index)
            g.run.currentCharacters[index] = character
            postPlayerChange(nil, player)
        end
    end
end
return ____exports
 end,
["features.optional.major.fastClear.callbacks.postRoomClear"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getRoomNPCs = ____misc.getRoomNPCs
local resetAllDyingNPCs
function resetAllDyingNPCs(self)
    for ____, npc in ipairs(
        getRoomNPCs(nil)
    ) do
        do
            local data = npc:GetData()
            if data.resetAttributeFrame == nil then
                goto __continue5
            end
            npc.CanShutDoors = true
            data.resetAttributeFrame = nil
        end
        ::__continue5::
    end
end
function ____exports.main(self)
    if not g.config.fastClear then
        return
    end
    resetAllDyingNPCs(nil)
end
return ____exports
 end,
["features.optional.major.fastTravel.callbacks.postRoomClear"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local heavenDoor = require("features.optional.major.fastTravel.heavenDoor")
function ____exports.main(self)
    if not g.config.fastTravel then
        return
    end
    heavenDoor:postRoomClear()
end
return ____exports
 end,
["features.race.openAntibirthDoor"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getAllDoors = ____misc.getAllDoors
function ____exports.default(self)
    if ((g.race.status ~= "in progress") or (g.race.myStatus ~= "racing")) or (g.race.goal ~= "Mother") then
        return
    end
    local player = Isaac.GetPlayer()
    local roomType = g.r:GetType()
    local isRoomCleared = g.r:IsClear()
    if (roomType == RoomType.ROOM_BOSS) and isRoomCleared then
        for ____, door in ipairs(
            getAllDoors(nil)
        ) do
            if (door ~= nil) and door:IsLocked() then
                door:TryUnlock(player, true)
            end
        end
    end
end
return ____exports
 end,
["features.race.callbacks.postRoomClear"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____openAntibirthDoor = require("features.race.openAntibirthDoor")
local openAntibirthDoor = ____openAntibirthDoor.default
function ____exports.main(self)
    if not g.config.clientCommunication then
        return
    end
    openAntibirthDoor(nil)
end
return ____exports
 end,
["customCallbacks.postRoomClear"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local fastClearPostRoomClear = require("features.optional.major.fastClear.callbacks.postRoomClear")
local fastTravelPostRoomClear = require("features.optional.major.fastTravel.callbacks.postRoomClear")
local racePostRoomClear = require("features.race.callbacks.postRoomClear")
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local roomClear
function roomClear(self)
    local gameFrameCount = g.g:GetFrameCount()
    log(
        nil,
        "Room clear detected on frame: " .. tostring(gameFrameCount)
    )
    fastClearPostRoomClear:main()
    fastTravelPostRoomClear:main()
    racePostRoomClear:main()
end
function ____exports.postUpdate(self)
    local gameFrameCount = g.g:GetFrameCount()
    local isClear = g.r:IsClear()
    if isClear ~= g.run.room.clear then
        g.run.room.clear = isClear
        g.run.room.clearFrame = gameFrameCount
        roomClear(nil)
    end
end
return ____exports
 end,
["customCallbacks.postTransformation"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local streakText = require("features.mandatory.streakText")
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local ____GlobalsRun = require("types.GlobalsRun")
local getPlayerLuaTableIndex = ____GlobalsRun.getPlayerLuaTableIndex
local postTransformation, showStreakText
function postTransformation(self, transformation)
    showStreakText(nil, transformation)
end
function showStreakText(self, transformation)
    local transformationName = ____exports.TRANSFORMATION_NAMES[transformation + 1]
    streakText:set(transformationName)
end
____exports.TRANSFORMATION_NAMES = {"Guppy", "Beelzebub", "Fun Guy", "Seraphim", "Bob", "Spun", "Yes Mother?", "Conjoined", "Leviathan", "Oh Crap", "Bookworm", "Adult", "Spider Baby", "Stompy", "Flight"}
function ____exports.postUpdate(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local index = getPlayerLuaTableIndex(nil, player)
        local transformations = g.run.transformations[index]
        if transformations == nil then
            return
        end
        do
            local i = 0
            while i < PlayerForm.NUM_PLAYER_FORMS do
                local hasForm = player:HasPlayerForm(i)
                local storedForm = transformations[i + 1]
                if storedForm == nil then
                    if hasForm and (not storedForm) then
                        transformations[i + 1] = true
                        postTransformation(nil, i)
                    end
                end
                i = i + 1
            end
        end
    end
end
return ____exports
 end,
["features.mandatory.fireworks"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local gridToPos = ____misc.gridToPos
local makeFireworksQuieter, spawnSparkleOnPlayer, spawnFireworks
function makeFireworksQuieter(self)
    if not g.sfx:IsPlaying(SoundEffect.SOUND_BOSS1_EXPLOSIONS) then
        return
    end
    local fireworks = Isaac.FindByType(EntityType.ENTITY_EFFECT, EffectVariant.FIREWORKS)
    if #fireworks > 0 then
        g.sfx:AdjustVolume(SoundEffect.SOUND_BOSS1_EXPLOSIONS, 0.2)
    end
end
function spawnSparkleOnPlayer(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        local randomVector = RandomVector() * 10
        local blingPosition = player.Position + randomVector
        Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.ULTRA_GREED_BLING, 0, blingPosition, Vector.Zero, nil)
    end
end
function spawnFireworks(self)
    local gameFrameCount = g.g:GetFrameCount()
    if (g.run.fireworksSpawned < 40) and ((gameFrameCount % 20) == 0) then
        do
            local i = 0
            while i < 5 do
                local ____obj, ____index = g.run, "fireworksSpawned"
                ____obj[____index] = ____obj[____index] + 1
                local fireworkPos = gridToPos(
                    nil,
                    math.random(1, 11),
                    math.random(2, 8)
                )
                local firework = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.FIREWORKS, 0, fireworkPos, Vector.Zero, nil):ToEffect()
                if firework ~= nil then
                    firework:SetTimeout(20)
                end
                i = i + 1
            end
        end
    end
end
function ____exports.postUpdate(self)
    makeFireworksQuieter(nil)
    if (((g.raceVars.finished and (g.race.status == "none")) and (g.race.place == 1)) and (g.race.numEntrants >= 3)) or g.speedrun.finished then
        spawnSparkleOnPlayer(nil)
        spawnFireworks(nil)
    end
end
return ____exports
 end,
["features.mandatory.showLevelText"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local isActionPressedOnAnyInput = ____misc.isActionPressedOnAnyInput
function ____exports.postUpdate(self)
    if VanillaStreakText ~= nil then
        return
    end
    if not isActionPressedOnAnyInput(nil, ButtonAction.ACTION_MAP) then
        g.run.streakText.tabText = ""
        return
    end
    local stage = g.l:GetStage()
    local stageType = g.l:GetStageType()
    g.run.streakText.tabText = g.l:GetName(stage, stageType, 0, 0, false)
end
return ____exports
 end,
["features.optional.hotkeys.fastDrop"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local ____misc = require("misc")
local getPlayers = ____misc.getPlayers
local checkInput, checkInputAll, checkInputTrinkets, checkInputPocket, fastDrop, isKeyboardPressed
function checkInput(self)
    for ____, player in ipairs(
        getPlayers(nil)
    ) do
        checkInputAll(nil, player)
        checkInputTrinkets(nil, player)
        checkInputPocket(nil, player)
    end
end
function checkInputAll(self, player)
    if (g.hotkeys.fastDropAllKeyboard ~= -1) and isKeyboardPressed(nil, g.hotkeys.fastDropAllKeyboard, player.ControllerIndex) then
        fastDrop(nil, player, ____exports.FastDropTarget.All)
    end
    if (g.hotkeys.fastDropAllController ~= -1) and Input.IsButtonPressed(g.hotkeys.fastDropAllController, player.ControllerIndex) then
        fastDrop(nil, player, ____exports.FastDropTarget.All)
    end
end
function checkInputTrinkets(self, player)
    if (g.hotkeys.fastDropTrinketsKeyboard ~= -1) and isKeyboardPressed(nil, g.hotkeys.fastDropTrinketsKeyboard, player.ControllerIndex) then
        fastDrop(nil, player, ____exports.FastDropTarget.Trinkets)
    end
    if (g.hotkeys.fastDropTrinketsController ~= -1) and Input.IsButtonPressed(g.hotkeys.fastDropTrinketsController, player.ControllerIndex) then
        fastDrop(nil, player, ____exports.FastDropTarget.Trinkets)
    end
end
function checkInputPocket(self, player)
    if (g.hotkeys.fastDropPocketKeyboard ~= -1) and isKeyboardPressed(nil, g.hotkeys.fastDropPocketKeyboard, player.ControllerIndex) then
        fastDrop(nil, player, ____exports.FastDropTarget.Pocket)
    end
    if (g.hotkeys.fastDropPocketController ~= -1) and Input.IsButtonPressed(g.hotkeys.fastDropPocketController, player.ControllerIndex) then
        fastDrop(nil, player, ____exports.FastDropTarget.Pocket)
    end
end
function fastDrop(self, player, target)
    if not player:IsItemQueueEmpty() then
        return
    end
    if (target == ____exports.FastDropTarget.All) or (target == ____exports.FastDropTarget.Trinkets) then
        local pos1 = g.r:FindFreePickupSpawnPosition(player.Position, 0, true)
        player:DropTrinket(pos1, false)
        local pos2 = g.r:FindFreePickupSpawnPosition(player.Position, 0, true)
        player:DropTrinket(pos2, false)
    end
    if (target == ____exports.FastDropTarget.All) or (target == ____exports.FastDropTarget.Pocket) then
        local pos1 = g.r:FindFreePickupSpawnPosition(player.Position, 0, true)
        player:DropPocketItem(0, pos1)
        local pos2 = g.r:FindFreePickupSpawnPosition(player.Position, 0, true)
        player:DropPocketItem(1, pos2)
    end
end
function isKeyboardPressed(self, key, controllerIndex)
    return Input.IsButtonPressed(key, controllerIndex) and (not Input.IsButtonPressed(key % 32, controllerIndex))
end
____exports.FastDropTarget = FastDropTarget or ({})
____exports.FastDropTarget.All = 0
____exports.FastDropTarget[____exports.FastDropTarget.All] = "All"
____exports.FastDropTarget.Trinkets = 1
____exports.FastDropTarget[____exports.FastDropTarget.Trinkets] = "Trinkets"
____exports.FastDropTarget.Pocket = 2
____exports.FastDropTarget[____exports.FastDropTarget.Pocket] = "Pocket"
function ____exports.postUpdate(self)
    checkInput(nil)
end
return ____exports
 end,
["features.optional.major.fastClear.callbacks.postUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local angels = require("features.optional.major.fastClear.angels")
local krampus = require("features.optional.major.fastClear.krampus")
function ____exports.main(self)
    if not g.config.fastClear then
        return
    end
    krampus:postUpdate()
    angels:postUpdate()
end
return ____exports
 end,
["features.race.callbacks.postUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
function ____exports.main(self)
end
return ____exports
 end,
["callbacks.postUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local itemPickup = require("customCallbacks.itemPickup")
local postGridEntityUpdate = require("customCallbacks.postGridEntityUpdate")
local postPlayerChange = require("customCallbacks.postPlayerChange")
local postRoomClear = require("customCallbacks.postRoomClear")
local postTransformation = require("customCallbacks.postTransformation")
local fireworks = require("features.mandatory.fireworks")
local runTimer = require("features.mandatory.runTimer")
local showLevelText = require("features.mandatory.showLevelText")
local trophy = require("features.mandatory.trophy")
local fastDrop = require("features.optional.hotkeys.fastDrop")
local fastClearPostUpdate = require("features.optional.major.fastClear.callbacks.postUpdate")
local startWithD6 = require("features.optional.major.startWithD6")
local showMaxFamiliars = require("features.optional.quality.showMaxFamiliars")
local showPills = require("features.optional.quality.showPills")
local racePostUpdate = require("features.race.callbacks.postUpdate")
function ____exports.main(self)
    postRoomClear:postUpdate()
    postGridEntityUpdate:postUpdate()
    postPlayerChange:postUpdate()
    postTransformation:postUpdate()
    itemPickup:postUpdate()
    trophy:postUpdate()
    fireworks:postUpdate()
    showLevelText:postUpdate()
    runTimer:postUpdate()
    racePostUpdate:main()
    startWithD6:postUpdate()
    fastClearPostUpdate:main()
    fastDrop:postUpdate()
    showPills:postUpdate()
    showMaxFamiliars:postUpdate()
end
return ____exports
 end,
["features.optional.enemies.replaceCodWorms"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.preEntitySpawn(self, initSeed)
    if g.config.replaceCodWorms then
        return {EntityType.ENTITY_PARA_BITE, 0, 0, initSeed}
    end
    return nil
end
return ____exports
 end,
["callbacks.preEntitySpawnFunctions"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local replaceCodWorms = require("features.optional.enemies.replaceCodWorms")
local functionMap = __TS__New(Map)
____exports.default = functionMap
functionMap:set(
    EntityType.ENTITY_COD_WORM,
    function(____, _variant, _subType, _position, _spawner, initSeed)
        return replaceCodWorms:preEntitySpawn(initSeed)
    end
)
return ____exports
 end,
["callbacks.preEntitySpawn"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____preEntitySpawnFunctions = require("callbacks.preEntitySpawnFunctions")
local preEntitySpawnFunctions = ____preEntitySpawnFunctions.default
function ____exports.main(self, entityType, variant, subType, position, _velocity, spawner, initSeed)
    local preEntityFunction = preEntitySpawnFunctions:get(entityType)
    if preEntityFunction ~= nil then
        return preEntityFunction(nil, variant, subType, position, spawner, initSeed)
    end
    return nil
end
return ____exports
 end,
["features.race.callbacks.preGameExit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
local socket = require("features.race.socket")
function ____exports.main(self)
    if not g.config.clientCommunication then
        return
    end
    socket:preGameExit()
end
return ____exports
 end,
["callbacks.preGameExit"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local racePreGameExit = require("features.race.callbacks.preGameExit")
local ____globals = require("globals")
local g = ____globals.default
local ____log = require("log")
local log = ____log.default
local saveDat = require("saveDat")
local ____GlobalsRun = require("types.GlobalsRun")
local GlobalsRun = ____GlobalsRun.default
function ____exports.main(self, shouldSave)
    log(nil, "MC_PRE_GAME_EXIT")
    if shouldSave then
        saveDat:save()
        log(nil, "Saved variables.")
    else
        g.run = __TS__New(GlobalsRun, {})
    end
    racePreGameExit:main()
end
return ____exports
 end,
["callbacks.preNPCUpdate"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local appearHands = require("features.optional.enemies.appearHands")
function ____exports.momsHand(self, npc)
    return appearHands:preNPCUpdate(npc)
end
function ____exports.momsDeadHand(self, npc)
    return appearHands:preNPCUpdate(npc)
end
function ____exports.init(self, mod)
    mod:AddCallback(ModCallbacks.MC_PRE_NPC_UPDATE, ____exports.momsHand, EntityType.ENTITY_MOMS_HAND)
    mod:AddCallback(ModCallbacks.MC_PRE_NPC_UPDATE, ____exports.momsDeadHand, EntityType.ENTITY_MOMS_DEAD_HAND)
end
return ____exports
 end,
["features.optional.quality.easyFirstFloorItems"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.preRoomEntitySpawn(self, gridIndex)
    if not g.config.easyFirstFloorItems then
        return nil
    end
    local stage = g.l:GetStage()
    local roomDesc = g.l:GetCurrentRoomDesc()
    local roomData = roomDesc.Data
    local roomVariant = roomData.Variant
    local roomType = g.r:GetType()
    local roomFrameCount = g.r:GetFrameCount()
    if roomFrameCount ~= -1 then
        return nil
    end
    if stage ~= 1 then
        return nil
    end
    if roomType ~= RoomType.ROOM_TREASURE then
        return nil
    end
    local ____switch7 = roomVariant
    if ____switch7 == 11 then
        goto ____switch7_case_0
    elseif ____switch7 == 39 then
        goto ____switch7_case_1
    elseif ____switch7 == 41 then
        goto ____switch7_case_2
    elseif ____switch7 == 42 then
        goto ____switch7_case_3
    end
    goto ____switch7_case_default
    ::____switch7_case_0::
    do
        do
            local rockIndexes = {66, 68, 82}
            for ____, rockIndex in ipairs(rockIndexes) do
                if rockIndex == gridIndex then
                    return {1930, 0, 0}
                end
            end
            goto ____switch7_end
        end
    end
    ::____switch7_case_1::
    do
        do
            local rockReplaceIndexes = {49, 63, 65, 79}
            for ____, rockIndex in ipairs(rockReplaceIndexes) do
                if rockIndex == gridIndex then
                    return {1930, 0, 0}
                end
            end
            local rockDeleteIndexes = {20, 47, 48, 62, 77, 78, 82, 95, 109}
            for ____, rockIndex in ipairs(rockDeleteIndexes) do
                if rockIndex == gridIndex then
                    return {999, 0, 0}
                end
            end
            goto ____switch7_end
        end
    end
    ::____switch7_case_2::
    do
        do
            local spikeIndexes = {48, 50, 78, 80}
            for ____, spikeIndex in ipairs(spikeIndexes) do
                if spikeIndex == gridIndex then
                    return {999, 0, 0}
                end
            end
            goto ____switch7_end
        end
    end
    ::____switch7_case_3::
    do
        do
            local potIndexes = {49, 63, 65, 79}
            for ____, potIndex in ipairs(potIndexes) do
                if potIndex == gridIndex then
                    return {1930, 0, 0}
                end
            end
            goto ____switch7_end
        end
    end
    ::____switch7_case_default::
    do
        do
            goto ____switch7_end
        end
    end
    ::____switch7_end::
    return nil
end
return ____exports
 end,
["callbacks.preRoomEntitySpawn"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local easyFirstFloorItems = require("features.optional.quality.easyFirstFloorItems")
function ____exports.main(self, _entityType, _variant, _subType, gridIndex, _seed)
    local newTable = easyFirstFloorItems:preRoomEntitySpawn(gridIndex)
    if newTable ~= nil then
        return newTable
    end
    return nil
end
return ____exports
 end,
["callbacks.useCard"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local streakText = require("features.mandatory.streakText")
local ____globals = require("globals")
local g = ____globals.default
local showStreakText
function showStreakText(self, card)
    if card ~= Card.RUNE_BLANK then
        local cardName = g.itemConfig:GetCard(card).Name
        streakText:set(cardName)
    end
end
function ____exports.main(self, card)
    showStreakText(nil, card)
end
return ____exports
 end,
["callbacks.usePill"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local streakText = require("features.mandatory.streakText")
local showPills = require("features.optional.quality.showPills")
local ____globals = require("globals")
local g = ____globals.default
local checkNewPill, newPill, showStreakText
function checkNewPill(self, player, pillEffect)
    local pillColor = player:GetPill(0)
    if pillColor == PillColor.PILL_NULL then
        return
    end
    for ____, pill in ipairs(g.run.pills) do
        if pill.color == pillColor then
            return
        end
    end
    newPill(nil, pillColor, pillEffect)
end
function newPill(self, pillColor, pillEffect)
    local pillDescription = {
        color = pillColor,
        effect = pillEffect,
        sprite = showPills:getSprite(pillColor)
    }
    __TS__ArrayPush(g.run.pills, pillDescription)
end
function showStreakText(self, pillEffect)
    local pillEffectName = g.itemConfig:GetPillEffect(pillEffect).Name
    streakText:set(pillEffectName)
end
function ____exports.main(self, pillEffect)
    local player = Isaac.GetPlayer()
    checkNewPill(nil, player, pillEffect)
    showStreakText(nil, pillEffect)
end
return ____exports
 end,
["modConfigMenu"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
require("lualib_bundle");
local ____exports = {}
local ____configDescription = require("configDescription")
local ALL_CONFIG_DESCRIPTIONS = ____configDescription.ALL_CONFIG_DESCRIPTIONS
local ALL_HOTKEY_DESCRIPTIONS = ____configDescription.ALL_HOTKEY_DESCRIPTIONS
local BOSS_CHANGES = ____configDescription.BOSS_CHANGES
local BUG_FIXES = ____configDescription.BUG_FIXES
local CHARACTER_CHANGES = ____configDescription.CHARACTER_CHANGES
local CUSTOM_HOTKEYS = ____configDescription.CUSTOM_HOTKEYS
local CUTSCENE_CHANGES = ____configDescription.CUTSCENE_CHANGES
local ENEMY_CHANGES = ____configDescription.ENEMY_CHANGES
local GAMEPLAY_CHANGES = ____configDescription.GAMEPLAY_CHANGES
local GRAPHIC_CHANGES = ____configDescription.GRAPHIC_CHANGES
local MAJOR_CHANGES = ____configDescription.MAJOR_CHANGES
local OTHER_FEATURES = ____configDescription.OTHER_FEATURES
local QUALITY_OF_LIFE_CHANGES_1 = ____configDescription.QUALITY_OF_LIFE_CHANGES_1
local QUALITY_OF_LIFE_CHANGES_2 = ____configDescription.QUALITY_OF_LIFE_CHANGES_2
local SOUND_CHANGES = ____configDescription.SOUND_CHANGES
local ____globals = require("globals")
local g = ____globals.default
local saveDat = require("saveDat")
local CATEGORY_NAME, PRESETS_NAME, deleteOldConfig, validateConfigDescriptions, registerPresets, isAllConfigSetTo, setAllSettings, registerSubMenuConfig, registerSubMenuHotkeys, getDefaultValue, getDisplayTextBoolean, getDisplayTextKeyboardController, onOff, getPopupDescription, popupGetDeviceString, popupGetKeepSettingString, getKeyName, popupGetBackKeyText, getPopupGfx, getPopupWidth
function deleteOldConfig(self)
    local categoryID = ModConfigMenu.GetCategoryIDByName(CATEGORY_NAME)
    if categoryID ~= nil then
        ModConfigMenu.MenuData[categoryID] = {Name = CATEGORY_NAME, Subcategories = {}}
    end
end
function validateConfigDescriptions(self)
    for ____, key in ipairs(
        __TS__ObjectKeys(g.config)
    ) do
        if not __TS__ArraySome(
            ALL_CONFIG_DESCRIPTIONS,
            function(____, array) return key == array[1] end
        ) then
            error(("Failed to find key \"" .. key) .. "\" in the config descriptions.")
        end
    end
    for ____, key in ipairs(
        __TS__ObjectKeys(g.hotkeys)
    ) do
        if not __TS__ArraySome(
            ALL_HOTKEY_DESCRIPTIONS,
            function(____, array) return key == array[1] end
        ) then
            error(("Failed to find key \"" .. key) .. "\" in the hotkey descriptions.")
        end
    end
end
function registerPresets(self)
    ModConfigMenu.AddText(
        CATEGORY_NAME,
        PRESETS_NAME,
        function() return "Mod by Zamiel" end
    )
    ModConfigMenu.AddText(
        CATEGORY_NAME,
        PRESETS_NAME,
        function() return "isaacracing.net" end
    )
    ModConfigMenu.AddSpace(CATEGORY_NAME, PRESETS_NAME)
    ModConfigMenu.AddSetting(
        CATEGORY_NAME,
        PRESETS_NAME,
        {
            Type = 4,
            CurrentSetting = function() return isAllConfigSetTo(nil, true) end,
            Display = function() return "Enable every setting: " .. onOff(
                nil,
                isAllConfigSetTo(nil, true)
            ) end,
            OnChange = function(newValue)
                local booleanNewValue = newValue
                setAllSettings(nil, booleanNewValue)
            end,
            Info = {"Turn every configurable setting on."}
        }
    )
    ModConfigMenu.AddSetting(
        CATEGORY_NAME,
        PRESETS_NAME,
        {
            Type = 4,
            CurrentSetting = function() return isAllConfigSetTo(nil, false) end,
            Display = function() return "Disable every setting: " .. onOff(
                nil,
                isAllConfigSetTo(nil, false)
            ) end,
            OnChange = function(newValue)
                local booleanNewValue = newValue
                setAllSettings(nil, not booleanNewValue)
            end,
            Info = {"Turn every configurable setting off."}
        }
    )
end
function isAllConfigSetTo(self, value)
    for ____, key in ipairs(
        __TS__ObjectKeys(g.config)
    ) do
        local assertedKey = key
        local currentValue = g.config[assertedKey]
        if currentValue ~= value then
            return false
        end
    end
    return true
end
function setAllSettings(self, newValue)
    for ____, key in ipairs(
        __TS__ObjectKeys(g.config)
    ) do
        local assertedKey = key
        g.config[assertedKey] = newValue
    end
    saveDat:save()
end
function registerSubMenuConfig(self, subMenuName, descriptions)
    for ____, ____value in ipairs(descriptions) do
        local configName
        configName = ____value[1]
        local array
        array = ____value[2]
        local optionType, code, shortDescription, longDescription = table.unpack(array)
        ModConfigMenu.AddSetting(
            CATEGORY_NAME,
            subMenuName,
            {
                Type = optionType,
                CurrentSetting = function() return g.config[configName] end,
                Display = function() return getDisplayTextBoolean(nil, configName, code, shortDescription) end,
                OnChange = function(newValue)
                    g.config[configName] = newValue
                    saveDat:save()
                end,
                Info = {longDescription}
            }
        )
    end
end
function registerSubMenuHotkeys(self, subMenuName, descriptions)
    for ____, ____value in ipairs(descriptions) do
        local configName
        configName = ____value[1]
        local array
        array = ____value[2]
        local optionType, ____, shortDescription, longDescription = table.unpack(array)
        ModConfigMenu.AddSetting(
            CATEGORY_NAME,
            subMenuName,
            {
                Type = optionType,
                CurrentSetting = function() return g.hotkeys[configName] end,
                Display = function() return getDisplayTextKeyboardController(nil, configName, optionType, shortDescription) end,
                OnChange = function(newValue)
                    if newValue == nil then
                        newValue = getDefaultValue(nil, optionType)
                    end
                    g.hotkeys[configName] = newValue
                end,
                Popup = function() return getPopupDescription(nil, configName, optionType) end,
                PopupGfx = getPopupGfx(nil, optionType),
                PopupWidth = getPopupWidth(nil, optionType),
                Info = {longDescription}
            }
        )
    end
end
function getDefaultValue(self, optionType)
    local ____switch40 = optionType
    if ____switch40 == 4 then
        goto ____switch40_case_0
    elseif ____switch40 == 6 then
        goto ____switch40_case_1
    elseif ____switch40 == 7 then
        goto ____switch40_case_2
    end
    goto ____switch40_case_default
    ::____switch40_case_0::
    do
        do
            return true
        end
    end
    ::____switch40_case_1::
    do
    end
    ::____switch40_case_2::
    do
        do
            return -1
        end
    end
    ::____switch40_case_default::
    do
        do
            error(
                ("Option types of " .. tostring(optionType)) .. " are unsupported."
            )
            return false
        end
    end
    ::____switch40_end::
end
function getDisplayTextBoolean(self, configName, code, shortDescription)
    local ____switch45 = code
    if ____switch45 == "" then
        goto ____switch45_case_0
    end
    goto ____switch45_case_default
    ::____switch45_case_0::
    do
        do
            return shortDescription .. ": n/a"
        end
    end
    ::____switch45_case_default::
    do
        do
            local currentValue = g.config[configName]
            return (((code .. " - ") .. shortDescription) .. ": ") .. onOff(nil, currentValue)
        end
    end
    ::____switch45_end::
end
function getDisplayTextKeyboardController(self, configName, optionType, shortDescription)
    local ____switch49 = optionType
    if ____switch49 == 6 then
        goto ____switch49_case_0
    elseif ____switch49 == 7 then
        goto ____switch49_case_1
    end
    goto ____switch49_case_default
    ::____switch49_case_0::
    do
        do
            local currentValue = g.hotkeys[configName]
            local text
            if currentValue == -1 then
                text = "None"
            else
                local stringValue = InputHelper.KeyboardToString[currentValue]
                text = ((stringValue == nil) and "Unknown Key") or stringValue
            end
            return ((shortDescription .. ": ") .. text) .. " (keyboard)"
        end
    end
    ::____switch49_case_1::
    do
        do
            local currentValue = g.hotkeys[configName]
            local text
            if currentValue == -1 then
                text = "None"
            else
                local stringValue = InputHelper.ControllerToString[currentValue]
                text = ((stringValue == nil) and "Unknown Button") or stringValue
            end
            return ((shortDescription .. ": ") .. text) .. " (controller)"
        end
    end
    ::____switch49_case_default::
    do
        do
            error(
                ("Option types of " .. tostring(optionType)) .. " are unsupported."
            )
            return "Unknown"
        end
    end
    ::____switch49_end::
end
function onOff(self, setting)
    return (setting and "ON") or "OFF"
end
function getPopupDescription(self, configName, optionType)
    local currentValue = g.hotkeys[configName]
    local deviceString = popupGetDeviceString(nil, optionType)
    local keepSettingString = popupGetKeepSettingString(nil, optionType, currentValue)
    local backKeyText = popupGetBackKeyText(nil)
    return ((((("Press a button on your " .. deviceString) .. " to change this setting.$newline$newline") .. keepSettingString) .. "Press \"") .. backKeyText) .. "\" to go back and clear this setting."
end
function popupGetDeviceString(self, optionType)
    local ____switch60 = optionType
    if ____switch60 == 6 then
        goto ____switch60_case_0
    elseif ____switch60 == 7 then
        goto ____switch60_case_1
    end
    goto ____switch60_case_default
    ::____switch60_case_0::
    do
        do
            return "keyboard"
        end
    end
    ::____switch60_case_1::
    do
        do
            return "controller"
        end
    end
    ::____switch60_case_default::
    do
        do
            error(
                ("Option types of " .. tostring(optionType)) .. " are unsupported."
            )
            return "unknown"
        end
    end
    ::____switch60_end::
end
function popupGetKeepSettingString(self, optionType, currentValue)
    if currentValue == -1 then
        return ""
    end
    local currentKeyName = getKeyName(nil, optionType, currentValue)
    return ("This setting is currently set to \"" .. tostring(currentKeyName)) .. "\".$newlinePress this button to keep it unchanged.$newline$newline"
end
function getKeyName(self, optionType, key)
    local ____switch67 = optionType
    if ____switch67 == 6 then
        goto ____switch67_case_0
    elseif ____switch67 == 7 then
        goto ____switch67_case_1
    end
    goto ____switch67_case_default
    ::____switch67_case_0::
    do
        do
            return InputHelper.KeyboardToString[key]
        end
    end
    ::____switch67_case_1::
    do
        do
            return InputHelper.ControllerToString[key]
        end
    end
    ::____switch67_case_default::
    do
        do
            error(
                ("Option types of " .. tostring(optionType)) .. " are unsupported."
            )
            return "unknown"
        end
    end
    ::____switch67_end::
end
function popupGetBackKeyText(self)
    local lastBackPressed = ModConfigMenu.Config.LastBackPressed
    local keyboardString = InputHelper.KeyboardToString[lastBackPressed]
    if keyboardString ~= nil then
        return keyboardString
    end
    local controllerString = InputHelper.ControllerToString[lastBackPressed]
    if controllerString ~= nil then
        return controllerString
    end
    return "back"
end
function getPopupGfx(self, optionType)
    return (((optionType == 6) or (optionType == 7)) and ModConfigMenu.PopupGfx.WIDE_SMALL) or nil
end
function getPopupWidth(self, optionType)
    return (((optionType == 6) or (optionType == 7)) and 280) or nil
end
CATEGORY_NAME = "Racing+"
PRESETS_NAME = "Presets"
function ____exports.register(self)
    if (ModConfigMenu == nil) or (InputHelper == nil) then
        return
    end
    deleteOldConfig(nil)
    validateConfigDescriptions(nil)
    registerPresets(nil)
    registerSubMenuConfig(nil, "Major", MAJOR_CHANGES)
    registerSubMenuHotkeys(nil, "Hotkeys", CUSTOM_HOTKEYS)
    registerSubMenuConfig(nil, "Chars", CHARACTER_CHANGES)
    registerSubMenuConfig(nil, "Bosses", BOSS_CHANGES)
    registerSubMenuConfig(nil, "Enemies", ENEMY_CHANGES)
    registerSubMenuConfig(nil, "QoL (1)", QUALITY_OF_LIFE_CHANGES_1)
    registerSubMenuConfig(nil, "QoL (2)", QUALITY_OF_LIFE_CHANGES_2)
    registerSubMenuConfig(nil, "Gameplay", GAMEPLAY_CHANGES)
    registerSubMenuConfig(nil, "Cutscene", CUTSCENE_CHANGES)
    registerSubMenuConfig(nil, "Bug Fixes", BUG_FIXES)
    registerSubMenuConfig(nil, "Graphics", GRAPHIC_CHANGES)
    registerSubMenuConfig(nil, "Sound", SOUND_CHANGES)
    registerSubMenuConfig(nil, "Other", OTHER_FEATURES)
end
return ____exports
 end,
["main"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local entityTakeDmg = require("callbacks.entityTakeDmg")
local evaluateCache = require("callbacks.evaluateCache")
local executeCmd = require("callbacks.executeCmd")
local getPillEffect = require("callbacks.getPillEffect")
local inputAction = require("callbacks.inputAction")
local postCurseEval = require("callbacks.postCurseEval")
local postEffectInit = require("callbacks.postEffectInit")
local postEffectUpdate = require("callbacks.postEffectUpdate")
local postEntityKill = require("callbacks.postEntityKill")
local postFamiliarInit = require("callbacks.postFamiliarInit")
local postFireTear = require("callbacks.postFireTear")
local postGameStarted = require("callbacks.postGameStarted")
local postNewLevel = require("callbacks.postNewLevel")
local postNewRoom = require("callbacks.postNewRoom")
local postNPCRender = require("callbacks.postNPCRender")
local postNPCUpdate = require("callbacks.postNPCUpdate")
local postPickupInit = require("callbacks.postPickupInit")
local postPlayerInit = require("callbacks.postPlayerInit")
local postPlayerRender = require("callbacks.postPlayerRender")
local postPlayerUpdate = require("callbacks.postPlayerUpdate")
local postRender = require("callbacks.postRender")
local postTearUpdate = require("callbacks.postTearUpdate")
local postUpdate = require("callbacks.postUpdate")
local preEntitySpawn = require("callbacks.preEntitySpawn")
local preGameExit = require("callbacks.preGameExit")
local preNPCUpdate = require("callbacks.preNPCUpdate")
local preRoomEntitySpawn = require("callbacks.preRoomEntitySpawn")
local useCard = require("callbacks.useCard")
local usePill = require("callbacks.usePill")
local ____constants = require("constants")
local VERSION = ____constants.VERSION
local ____log = require("log")
local log = ____log.default
local modConfigMenu = require("modConfigMenu")
local saveDat = require("saveDat")
local main, welcomeBanner, registerCallbacks, registerMainCallbacks
function main(self)
    local racingPlus = RegisterMod("Racing+", 1)
    welcomeBanner(nil)
    saveDat:setMod(racingPlus)
    saveDat:load()
    modConfigMenu:register()
    registerCallbacks(nil, racingPlus)
end
function welcomeBanner(self)
    local modName = "Racing+"
    local welcomeText = ((modName .. " ") .. VERSION) .. " initialized."
    local hyphens = string.rep(
        "-",
        math.floor(#welcomeText)
    )
    local welcomeTextBorder = ("+-" .. hyphens) .. "-+"
    log(nil, welcomeTextBorder)
    log(nil, ("| " .. welcomeText) .. " |")
    log(nil, welcomeTextBorder)
end
function registerCallbacks(self, mod)
    registerMainCallbacks(nil, mod)
    postNPCUpdate:init(mod)
    postFamiliarInit:init(mod)
    entityTakeDmg:init(mod)
    postPickupInit:init(mod)
    postTearUpdate:init(mod)
    postEffectInit:init(mod)
    postEffectUpdate:init(mod)
    preNPCUpdate:init(mod)
end
function registerMainCallbacks(self, mod)
    mod:AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main)
    mod:AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main)
    mod:AddCallback(ModCallbacks.MC_USE_CARD, useCard.main)
    mod:AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main)
    mod:AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main)
    mod:AddCallback(ModCallbacks.MC_USE_PILL, usePill.main)
    mod:AddCallback(ModCallbacks.MC_POST_CURSE_EVAL, postCurseEval.main)
    mod:AddCallback(ModCallbacks.MC_INPUT_ACTION, inputAction.main)
    mod:AddCallback(ModCallbacks.MC_POST_GAME_STARTED, postGameStarted.main)
    mod:AddCallback(ModCallbacks.MC_PRE_GAME_EXIT, preGameExit.main)
    mod:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, postNewLevel.main)
    mod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom.main)
    mod:AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main)
    mod:AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, preEntitySpawn.main)
    mod:AddCallback(ModCallbacks.MC_POST_NPC_RENDER, postNPCRender.main)
    mod:AddCallback(ModCallbacks.MC_POST_PLAYER_UPDATE, postPlayerUpdate.main)
    mod:AddCallback(ModCallbacks.MC_POST_PLAYER_RENDER, postPlayerRender.main)
    mod:AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, postFireTear.main)
    mod:AddCallback(ModCallbacks.MC_GET_PILL_EFFECT, getPillEffect.main)
    mod:AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, postEntityKill.main)
    mod:AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN, preRoomEntitySpawn.main)
end
main(nil)
return ____exports
 end,
["features.optional.quality.removeFortuneCookieBanners"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____globals = require("globals")
local g = ____globals.default
function ____exports.useItem(self)
    local HUD = g.g:GetHUD()
    if not g.config.removeFortuneCookieBanners then
        return
    end
    if VanillaStreakText then
        return
    end
    HUD:ShowItemText("")
end
return ____exports
 end,
["callbacks.useItem"] = function() --[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local removeFortuneCookieBanners = require("features.optional.quality.removeFortuneCookieBanners")
function ____exports.fortuneCookie(self)
    removeFortuneCookieBanners:useItem()
end
return ____exports
 end,
}
return require("main")
