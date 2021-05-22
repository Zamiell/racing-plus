-- Taken from DeadInfinity and Revelations
-- Made by filloax for both genesis and revelations, and his mods, this aint plagiarizing
-- Returns a clone of source when called with no second arg, or a clone of source with, for fields not in source, the target's fields
function RevelCopyTable(source, target)
  local output = {}

  if not target or type(target) ~= "table" or RevelTlen(target) < RevelTlen(source) then --This needs to be done, to prevent errors when using a nil as a table
    for k,v in pairs(source) do --For every variable in target (not in source as it might not have variables added in a new version)
      if type(source[k]) == "table" then --If the value of the variable is also a table, we need to do this again. (Actually, I'm not sure, but to be safe, do this)
        output[k] = RevelCopyTable(v);
      else
        output[k] = v; --If the value of k isn't a table, just copy it over to the output.
      end
    end
  else
    for k,v in pairs(target) do --For every variable in target (not in source as it might not have variables added in a new version)
      if source[k] ~= nil and type(source[k]) == type(target[k]) then --If the source contains the variable
        if type(source[k]) == "table" then --If the value of the variable is also a table, we need to do this again. (Actually, I'm not sure, but to be safe, do this)
          output[k] = RevelCopyTable(source[k],target[k]);
        else
          output[k] = source[k]; --If the value of k isn't a table, just copy it over to the output.
        end
      else   --If the variable is only in target
        if type(target[k]) == "table" then --If the value of the variable is also a table, we need to do this again. (Actually, I'm not sure, but to be safe, do this)
          output[k] = RevelCopyTable({},target[k]);
        else
          output[k] = target[k]; --If the value of k isn't a table, just copy it over to the output.
        end
      end
    end
  end

  return output;
end

function RevelTlen(t)
  local c = 0
  for k,_ in pairs(t) do c = c+1 end
  return c
end
