local gorp = require(script.Parent.bundled.gorp)
local ecr = require(script.Parent.bundled.ecr);

gorp.set_ecr = function(assigned_ecr)
	for index, value in pairs(assigned_ecr) do
		ecr[index] = value;
	end
end

return {
	default = gorp,
};
