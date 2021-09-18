local Shadow = {
  sprite = nil,
  head = nil,
  body = nil,
  isActive = false,
}

local state = {
  lastUpdated = 0,
  x = nil,
  y = nil,
  level = nil,
  room = nil,
  character = nil,
  anim_name = nil,
  anim_frame = nil,
}

function Shadow:Draw()
  local shadowPos = Isaac.WorldToScreen(Vector(state.x, state.y))

  if #state.anim_name > 0 then
    if string.find(state.anim_name, "Trapdoor") then
      Shadow.head:SetFrame("Trapdoor", state.anim_frame)
      Shadow.body:SetFrame("Trapdoor", state.anim_frame)
    elseif string.find(state.anim_name, "Walk") then
      local headanim = string.gsub(state.anim_name, "Walk", "Head")
      Shadow.head:SetFrame(headanim, state.anim_frame)
      Shadow.body:SetFrame(state.anim_name, state.anim_frame)
    else
      Shadow.head:SetFrame(state.anim_name, state.anim_frame)
      Shadow.body:SetFrame(state.anim_name, state.anim_frame)
    end
    Shadow.head:Render(shadowPos, Vector.Zero, Vector.Zero)
  else
    Shadow.body:SetFrame("Death", 0)
  end

  Shadow.body:Render(shadowPos, Vector.Zero, Vector.Zero)
end
